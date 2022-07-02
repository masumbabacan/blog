const CustomError = require("../errors");
const { isTokenValid } = require("../utils");

const authenticateUser = async (req,res,next) => {
    const token = req.signedCookies.token;
    if (!token) {
        throw new CustomError.UnauthenticatedError("Geçersiz kimlik");
    }

    try {
        const {name,userId,role} = isTokenValid({ token });
        req.user = { name, userId, role };
        next();
    } catch (error) {
        throw new CustomError.UnauthenticatedError("Geçersiz kimlik");
    }
};

const authorizePermissions = async (req,res,next) => {
    if (req.user.role != "admin") {
        throw new CustomError.UnAuthorizationError("Bu rotaya erişim izni yok");
    }else{
        next();
    }
}

module.exports = {
    authenticateUser,
    authorizePermissions,
}