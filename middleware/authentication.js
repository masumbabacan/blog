const CustomError = require("../errors");
const { isTokenValid } = require("../utils");

const authenticateUser = async (req,res,next) => {
    const token = req.signedCookies.token;
    if (!token) {
        throw new CustomError.UnauthenticatedError("Geçersiz kimlik");
    }

    try {
        const payload = isTokenValid({ token });
        
        console.log(payload);
        next();
    } catch (error) {
        throw new CustomError.UnauthenticatedError("Geçersiz kimlik");
    }
};

module.exports = {
    authenticateUser,
}