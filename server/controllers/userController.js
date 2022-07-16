const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const {createTokenUser,attachCookiesToResponse,checkPermissions, nullControl} = require("../utils");

const getAllUsers = async (req,res) => {
    const users = await User.find({role:"user"}).select('-password');
    res.status(StatusCodes.OK).json({ users : users, msg : "İşlem başarılı", NumberOfUsers : users.length });
}

const getUser = async (req,res) => {
    const user = await User.findOne({_id:req.params.id}).select('-password');
    if (!user) throw new CustomError.NotFoundError("Kullanıcı Bulunamadı");
    checkPermissions(req.user,user._id);
    res.status(StatusCodes.OK).json({ user : user, msg : "İşlem başarılı" });
}

const showCurrentUser = async (req,res) => {
    res.status(StatusCodes.OK).json({user : req.user});
}

const updateUser = async (req,res) => {
    const {name,surname} = req.body;
    await nullControl([name,surname]);
    const user = await User.findOneAndUpdate({_id : req.user.userId},{surname,name},{new:true,runValidators:true});
    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({res,user:tokenUser});
    res.status(StatusCodes.OK).json({user : tokenUser, msg : "İşlem başarılı"});
}

const updateUserPassword = async (req,res) => {
    const { oldPassword, newPassword } = req.body;
    await nullControl([oldPassword,newPassword]);
    const user = await User.findOne({_id : req.user.userId});
    const isPasswordCorrect = await user.comparePassword(oldPassword);
    if (!isPasswordCorrect) throw new CustomError.UnauthenticatedError("Geçersiz kimlik bilgileri");
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