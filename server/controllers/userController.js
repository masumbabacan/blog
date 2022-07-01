const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

const getAllUsers = async (req,res) => {
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
    res.send(req.params);
}

const updateUser = async (req,res) => {
    res.send("update user");
}

const updateUserPassword = async (req,res) => {
    res.send("update user password");
}

module.exports = {
    getAllUsers,
    getUser,
    showCurrentUser,
    updateUser,
    updateUserPassword
}