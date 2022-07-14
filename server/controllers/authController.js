const User = require("../models/User");
const Token = require("../models/Token");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { 
    attachCookiesToResponse, 
    createTokenUser, 
    sendVerificationEmail, 
    sendResetPasswordEmail,
    createHash 
} = require("../utils/index");
const crypto = require('crypto');

const register = async (req,res) => {
    const { email, name, surname, password } = req.body;
    const emailAllreadyExist = await User.findOne({email});
    if (emailAllreadyExist) {
        throw new CustomError.BadRequestError("Bu email zaten kayıtlı");
    }
    const verificationToken = crypto.randomBytes(40).toString('hex');
    const user = await User.create({name,surname,email,password,verificationToken});

    const origin = 'http://localhost:3000/api/v1/auth';

    await sendVerificationEmail({
        name : user.name,
        email : user.email,
        verificationToken : user.verificationToken,
        origin : origin,
    });
    res.status(StatusCodes.CREATED).json({msg : "İşlem başarılı! Lütfen hesabınızı doğrulamak için e-postanızı kontrol edin"});
}
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
const verifyEmail = async (req,res) => {
    const {verificationToken,email} = req.body;
    const user = await User.findOne({email});
    if (!user || user.verificationToken !== verificationToken) {
        throw new CustomError.UnauthenticatedError("Doğrulama esnasında hata oluştu!");
    }
    await User.findOneAndUpdate(
        {_id : user._id},
        {isVerified : true, verified : Date.now(),verificationToken : ''}
    );
    res.status(StatusCodes.OK).json({msg : 'E-posta başarıyla doğrulandı'});
}

const login = async (req,res) => {
    const {email,password} = req.body;
    if (!email || !password) {
        throw new CustomError.BadRequestError("Lütfen email ve şifrenizi girin");
    }

    const user = await User.findOne({email});
    if (!user) {
        throw new CustomError.UnauthenticatedError("Geçersiz kimlik bilgileri");
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
        throw new CustomError.BadRequestError("Geçersiz kimlik bilgileri");
    }

    if (!user.isVerified) {
        throw new CustomError.UnauthenticatedError("Lütfen email adresinizi doğrulayın");
    }
    const tokenUser = createTokenUser(user);
    let refreshToken = '';

    const existingToken = await Token.findOne({ user : user._id });
    if (existingToken) {
        const {isValid} = existingToken;
        if (!isValid) {
            throw new CustomError.UnauthenticatedError("geçersiz kimlik bilgileri");
        }
        refreshToken = existingToken.refreshToken;
        attachCookiesToResponse({res,user:tokenUser,refreshToken});
        res.status(StatusCodes.OK).json({user:tokenUser});
        return;
    }

    refreshToken = crypto.randomBytes(40).toString('hex');
    const userAgent = req.headers['user-agent'];
    const ip = req.ip;
    const userToken = {refreshToken,ip,userAgent,user:user._id};
    await Token.create(userToken);
    attachCookiesToResponse({res,user:tokenUser,refreshToken});
    res.status(StatusCodes.OK).json({user:tokenUser});
}

const logout = async (req,res) => {
    await Token.findOneAndDelete({user:req.user.userId});
    res.cookie("accessToken","logout",{
        httpOnly : true,
        expires : new Date(Date.now()),
    });
    res.cookie("refreshToken","logout",{
        httpOnly : true,
        expires : new Date(Date.now()),
    });
    res.status(StatusCodes.OK).json({msg : 'Kullanıcı çıkış yaptı'});
}

const forgotPassword = async (req,res) => {
    const {email} = req.body;
    if (!email) {
        throw new CustomError.BadRequestError("Lütfen e-posta adresini girin");
    }
    const user = await User.findOne({email});
    if (user) {
        const passwordToken = crypto.randomBytes(70).toString("hex");
        const origin = 'http://localhost:3000/api/v1/auth';
        console.log(passwordToken)
        //send email
        await sendResetPasswordEmail({
            name:user.name,
            email:user.email,
            token: passwordToken,
            origin : origin,
        });
        const tenMinutes = 1000*60*10;
        const passwordTokenExpirationDate = new Date(Date.now() + tenMinutes);

        user.passwordToken = createHash(passwordToken);
        user.passwordTokenExpirationDate = passwordTokenExpirationDate;
        await user.save();
        res.status(StatusCodes.OK).json({msg : "Şifrenizi sıfırlamak için lütfen e-posta adresinizi kontrol edin"});
    }else{
        throw new CustomError.BadRequestError("Hatalı e-posta! lütfen geçerli bir e-posta adresi girin");
    }
}

const resetPassword = async (req,res) => {
    const {token,email,password} = req.body;
    if (!token || !email || !password) {
        throw new CustomError.BadRequestError("Lütfen tüm alanları eksiksiz doldurun");
    }
    const user = await User.findOne({email});
    if (user) {
        const currentDate = new Date();
        createHash(token);
        if (user.passwordToken === token && user.passwordTokenExpirationDate > currentDate) {
            user.password = password,
            user.passwordToken = null,
            user.passwordTokenExpirationDate = null,
            await user.save();
            res.status(StatusCodes.OK).json({msg : "Şifre sıfırlama işlemi başarıyla sonuçlandı"});
        }else{
            throw new CustomError.BadRequestError("Geçersiz kimlik bilgileri");
        }
    }else{
        throw new CustomError.BadRequestError("Geçersiz kimlik bilgileri");
    }
}

module.exports = {
    register,
    login,
    logout,
    verifyEmail,
    forgotPassword,
    resetPassword,
}