const express = require("express");
const router = express();
const {authenticateUser} = require("../middleware/authentication")

const { register,login,logout,verifyEmail,forgotPassword,resetPassword } = 
require("../controllers/authController");

router.post("/register",register); //register
router.post("/login",login); //login
router.post("/verify-email",verifyEmail); //email verify
router.post("/forgot-password",forgotPassword); //forgot password
router.post("/reset-password",resetPassword); //reset password
router.delete("/logout",authenticateUser,logout); //log out

module.exports = router;