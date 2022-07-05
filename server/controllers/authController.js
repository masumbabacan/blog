const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { attachCookiesToResponse, createTokenUser } = require("../utils/index");
const crypto = require('crypto');

const register = async (req,res) => {
    const { email, name, surname, password } = req.body;
    const emailAllreadyExist = await User.findOne({email});
    if (emailAllreadyExist) {
        throw new CustomError.BadRequestError("Bu email zaten kayıtlı");
    }
    const verificationToken = crypto.randomBytes(40).toString('hex');
    const user = await User.create({name,surname,email,password,verificationToken});
    res.status(StatusCodes.CREATED).json({msg : "İşlem başarılı! Lütfen hesabınızı doğrulamak için e-postanızı kontrol edin"});
}

const verifyEmail = async (req,res) => {
    const {verificationToken,email} = req.body;
    const user = await User.findOne({email});
    if (!user || user.verificationToken !== verificationToken) {
        throw new CustomError.UnauthenticatedError("Doğrulama başarısız oldu");
    }
    await User.findOneAndUpdate({_id : user._id},{isVerified : true, verified : Date.now(),verificationToken : ''});
    res.status(StatusCodes.OK).json({msg : 'Email doğrulaması başarılı!'});
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
    attachCookiesToResponse({res,user:tokenUser});
    res.status(StatusCodes.OK).json({user:tokenUser});
}

const logout = async (req,res) => {
    res.cookie("token","logout",{
        httpOnly : true,
        expires : new Date(Date.now()),
    });
    res.status(StatusCodes.OK).json({msg : 'Kullanıcı çıkış yaptı'});
}

module.exports = {
    register,login,logout,verifyEmail
}