const express = require("express");
const router = express();
const {authenticateUser} = require("../middleware/authentication")
const cors = require('cors');

const { register,login,logout,verifyEmail,forgotPassword,resetPassword } = 
require("../controllers/authController");

router.post("/register",cors(),register);
router.post("/login",cors(),login);
router.delete("/logout",authenticateUser,logout);

router.post("/verify-email",verifyEmail);
router.post("/forgot-password",forgotPassword);
router.post("/reset-password",resetPassword);

module.exports = router;