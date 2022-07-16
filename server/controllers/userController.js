const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const {createTokenUser,attachCookiesToResponse,checkPermissions, nullControl} = require("../utils");

const getAllUsers = async (req,res) => {
    //get the requested data
    const users = await User.find({role:"user"}).select('-password');
    //return successful message and data
    res.status(StatusCodes.OK).json({ users : users, msg : "İşlem başarılı", NumberOfUsers : users.length });
}

const getUser = async (req,res) => {
    //get the requested data
    const user = await User.findOne({_id:req.params.id}).select('-password');
    //check data
    if (!user) throw new CustomError.NotFoundError("Kullanıcı Bulunamadı");
    //authorization check of the person who wants to update
    checkPermissions(req.user,user._id);
    //return successful message and data
    res.status(StatusCodes.OK).json({ user : user, msg : "İşlem başarılı" });
}

const showCurrentUser = async (req,res) => {
    //return successful message and data
    res.status(StatusCodes.OK).json({user : req.user});
}

const updateUser = async (req,res) => {
    //retrieve the requested data
    const {name,surname} = req.body;
    //update data
    const user = await User.findOneAndUpdate({_id : req.user.userId},{surname,name},{new:true,runValidators:true});
    //generate new token
    const tokenUser = createTokenUser(user);
    //attach cookies to response
    attachCookiesToResponse({res,user:tokenUser});
    //return successful message and data
    res.status(StatusCodes.OK).json({user : tokenUser, msg : "İşlem başarılı"});
}

const updateUserPassword = async (req,res) => {
    //retrieve the requested data
    const { oldPassword, newPassword } = req.body;
    //null data check
    await nullControl([oldPassword,newPassword]);
    //user password change
    const user = await User.findOne({_id : req.user.userId});
    const isPasswordCorrect = await user.comparePassword(oldPassword);
    if (!isPasswordCorrect) throw new CustomError.UnauthenticatedError("Geçersiz kimlik bilgileri");
    //save data
    user.password = newPassword;
    await user.save();
    //return successful message
    res.status(StatusCodes.OK).json({msg : "Şifre başarıyla güncellendi"});
}

module.exports = {
    getAllUsers,
    getUser,
    showCurrentUser,
    updateUser,
    updateUserPassword
}