const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { findOneAndUpdate, create } = require("../models/User");
const {createTokenUser,attachCookiesToResponse} = require("../utils");

const getAllUsers = async (req,res) => {
    console.log(req.user);
    const users = await User.find({role:"user"}).select('-password');
    res.status(StatusCodes.OK).json({
        users : users, 
        msg : "İşlem başarılı",
        NumberOfUsers : users.length
    });
}

const getUser = async (req,res) => {
    const user = await User.findOne({_id:req.params.id}).select('-password');
    if (!user) {
        throw new CustomError.NotFoundError("Kullanıcı Bulunamadı");
    }
    res.status(StatusCodes.OK).json({
        user : user, 
        msg : "İşlem başarılı",
    });
}

const showCurrentUser = async (req,res) => {
    res.status(StatusCodes.OK).json({user : req.user});
}

const updateUser = async (req,res) => {
    const {email, name} = req.body;
    if (!email || !name) {
        throw new CustomError.BadRequestError("Lütfen tüm alanları doldurunuz");
    }
    const user = await User.findOneAndUpdate({_id : req.user.userId},{email,name},{new:true,runValidators:true});
    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({res,user:tokenUser});
    res.status(StatusCodes.OK).json({user : tokenUser});


}

const updateUserPassword = async (req,res) => {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
        throw new CustomError.BadRequestError("Lütfen alanları doldurunuz");
    }
    const user = await User.findOne({_id : req.user.userId});
    const isPasswordCorrect = await user.comparePassword(oldPassword);
    if (!isPasswordCorrect) {
        throw new CustomError.UnauthenticatedError("Geçersiz kimlik bilgileri");
    }
    user.password = newPassword;
    await user.save();
    res.status(StatusCodes.OK).json({msg : "Şifre başarıyla güncellendi"});
}

module.exports = {
    getAllUsers,
    getUser,
    showCurrentUser,
    updateUser,
    updateUserPassword
}