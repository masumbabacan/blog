const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { attachCookiesToResponse, createTokenUser } = require("../utils/index");

const register = async (req,res) => {
    const { email } = req.body;
    const emailAllreadyExist = await User.findOne({email});
    if (emailAllreadyExist) {
        throw new CustomError.BadRequestError("Bu email zaten kayıtlı");
    }
    const user = await User.create(req.body);
    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({res,user:tokenUser});
    res.status(StatusCodes.OK).json({user:tokenUser});
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
    register,login,logout,
}