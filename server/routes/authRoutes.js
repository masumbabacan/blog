const express = require("express");
const router = express();
const {authenticateUser} = require("../middleware/authentication")

const { register,login,logout,verifyEmail } = 
require("../controllers/authController");

router.post("/register",register);
router.post("/verify-email",verifyEmail);
router.post("/login",login);
router.delete("/logout",authenticateUser,logout);

module.exports = router;