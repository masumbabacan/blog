const User = require("../models/User");
const Token = require("../models/Token");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const crypto = require('crypto');
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
const { 
    attachCookiesToResponse, 
    createTokenUser, 
    sendVerificationEmail, 
    sendResetPasswordEmail,
    createHash,
    nullControl
} = require("../utils/index");

const register = async (req,res) => {
    //information required for registration
    const { email, name, surname,username, password } = req.body;
    //email check
    const emailExist = await User.findOne({email});
    if (emailExist) throw new CustomError.BadRequestError("Bu email zaten kayıtlı");
    //username check
    const usernameExist = await User.findOne({username});
    if (usernameExist) throw new CustomError.BadRequestError("Bu kullanıcı adı daha önceden alınmış");
    //Generating tokens for email verification
    const verificationToken = crypto.randomBytes(40).toString('hex');
    //save data
    const user = await User.create({name,surname,email,username,password,verificationToken});
    //Creating the necessary information to send an email
    const origin = 'http://localhost:3000/api/v1/auth';
    await sendVerificationEmail({
        name : user.name,
        email : user.email,
        verificationToken : user.verificationToken,
        origin : origin,
    });
    //return successful message
    res.status(StatusCodes.CREATED).json({msg : "İşlem başarılı! Lütfen hesabınızı doğrulamak için e-postanızı kontrol edin"});
}

const verifyEmail = async (req,res) => {
    //Parameters required for verification
    const {verificationToken,email} = req.body;
    //email check and verificationCode check
    const user = await User.findOne({email});
    if (!user || user.verificationToken !== verificationToken) {
        throw new CustomError.UnauthenticatedError("Doğrulama esnasında hata oluştu!");
    }
    //verify account if no errors
    await User.findOneAndUpdate(
        {_id : user._id},
        {isVerified : true, verified : Date.now(),verificationToken : ''}
    );
    //return successful message
    res.status(StatusCodes.OK).json({msg : 'E-posta başarıyla doğrulandı'});
}

const login = async (req,res) => {
    //Information required for login
    const {username,password} = req.body;
    //null data check
    await nullControl([username,password]);
    //user check
    const user = await User.findOne({username});
    if (!user) throw new CustomError.UnauthenticatedError("Geçersiz kimlik bilgileri");
    //password check
    const isPasswordCorrect = await user.comparePassword(password);
    console.log(isPasswordCorrect)
    if (!isPasswordCorrect) throw new CustomError.BadRequestError("Geçersiz kimlik bilgileri");
    //verify account control
    if (!user.isVerified) throw new CustomError.UnauthenticatedError("Lütfen email adresinizi doğrulayın");
    //blocked check
    if (user.accountBlock) throw new CustomError.UnauthenticatedError("Hesap bloke edilmiş");
    //generating token information
    const tokenUser = createTokenUser(user);
    let refreshToken = '';
    //Has a token been created before?
    const existingToken = await Token.findOne({ user : user._id });
    if (existingToken) {
        //Is the created token valid?
        if (!existingToken.isValid) throw new CustomError.UnauthenticatedError("geçersiz kimlik bilgileri");
        //use existing token
        refreshToken = existingToken.refreshToken;
        //attach cookies to response
        attachCookiesToResponse({res,user:tokenUser,refreshToken});
        //return successful message
        res.status(StatusCodes.OK).json({user:tokenUser, msg: 'Giriş başarılı'});
        return;
    }
    //generate refresh token
    refreshToken = crypto.randomBytes(40).toString('hex');
    //user agent information
    const userAgent = req.headers['user-agent'];
    //user ip information
    const ip = req.ip;
    //generate user token
    const userToken = {refreshToken,ip,userAgent,user:user._id};
    //save user token
    await Token.create(userToken);
    //attach cookies to response
    attachCookiesToResponse({res,user:tokenUser,refreshToken});
    //return successful message
    res.status(StatusCodes.OK).json({user:tokenUser});
}

const logout = async (req,res) => {
    //delete generated token from database
    await Token.findOneAndDelete({user:req.user.userId});
    //delete generated token from cookies
    res.cookie("accessToken","logout",{
        httpOnly : true,
        expires : new Date(Date.now()),
    });
    //delete generated token from cookies
    res.cookie("refreshToken","logout",{
        httpOnly : true,
        expires : new Date(Date.now()),
    });
    //return successful message
    res.status(StatusCodes.OK).json({msg : 'Kullanıcı çıkış yaptı'});
}

const forgotPassword = async (req,res) => {
    //email information
    const {email} = req.body;
    //null data check
    await nullControl([email]);
    //user check
    const user = await User.findOne({email});
    if (!user) throw new CustomError.BadRequestError("Hatalı e-posta! lütfen geçerli bir e-posta adresi girin");
    //generate password token
    const passwordToken = crypto.randomBytes(70).toString("hex");
    //Creating the necessary information to send an email
    const origin = 'http://localhost:3000/api/v1/auth';
    await sendResetPasswordEmail({
        name:user.name,
        email:user.email,
        token: passwordToken,
        origin : origin,
    });
    //set time to change password
    const tenMinutes = 1000*60*10;
    const passwordTokenExpirationDate = new Date(Date.now() + tenMinutes);
    //save information to database
    user.passwordToken = createHash(passwordToken);
    user.passwordTokenExpirationDate = passwordTokenExpirationDate;
    await user.save();
    //return successful message
    res.status(StatusCodes.OK).json({msg : "Şifrenizi sıfırlamak için lütfen e-posta adresinizi kontrol edin"});
}

const resetPassword = async (req,res) => {
    //Required information to change password
    const {token,email,password} = req.body;
    //null data check
    await nullControl([token,email,password]);
    //user check
    const user = await User.findOne({email});
    if (!user) throw new CustomError.BadRequestError("Geçersiz kimlik bilgileri");
    //present tense
    const currentDate = new Date();
    createHash(token);
    //Is the coin given to the user the same as the requested coin and is the coin expired?
    if (user.passwordToken !== token || !user.passwordTokenExpirationDate > currentDate) {
        throw new CustomError.BadRequestError("Geçersiz kimlik bilgileri");
    }
    //changing password from database
    user.password = password,
    user.passwordToken = null,
    user.passwordTokenExpirationDate = null,
    await user.save();
    //return successful message
    res.status(StatusCodes.OK).json({msg : "Şifre sıfırlama işlemi başarıyla sonuçlandı"});
}

module.exports = {
    register,
    login,
    logout,
    verifyEmail,
    forgotPassword,
    resetPassword,
}