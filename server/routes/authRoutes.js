const express = require("express");
const router = express();

const { register,login,logout,verifyEmail } = 
require("../controllers/authController");

router.post("/register",register);
router.post("/verify-email",verifyEmail);
router.post("/login",login);
router.get("/logout",logout);

module.exports = router;