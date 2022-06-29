const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");


const register = async (req,res) => {
    const user = await User.create(req.body);
    res.status(StatusCodes.CREATED).json({user});
}

const login = async (req,res) => {
    res.send("login user");
}

const logout = async (req,res) => {
    res.send("logout user");
}

module.exports = {
    register,login,logout,
}