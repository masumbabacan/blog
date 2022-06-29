const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { createJWT } = require("../utils/index");

const register = async (req,res) => {
    const { email } = req.body;
    const emailAllreadyExist = await User.findOne({email});
    if (emailAllreadyExist) {
        throw new CustomError.BadRequestError("Bu email zaten kayıtlı");
    }

    const user = await User.create(req.body);
    const tokenUser = { name:user.name, userId:user._id, role:user.role };
    const token = createJWT({payload : tokenUser});

    const oneDay = 1000*60*60*24;

    res.cookie("token",token,{
        httpOnly:true,
        expires:new Date(Date.now() + oneDay),
    })

    res.status(StatusCodes.CREATED).json({user:tokenUser});
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