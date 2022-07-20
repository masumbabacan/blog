const express = require("express");
const router = express();
const {authenticateUser,authorizePermissions} = require("../middleware/authentication");
const { getAllUsers,getUser,showCurrentUser,updateUser,updateUserPassword,subscribe } = 
require("../controllers/userController");

router.get("/",authenticateUser,authorizePermissions('admin'),getAllUsers); //get all data
router.get("/subscribe/:id",authenticateUser,subscribe); //get all data
router.get("/showMe",authenticateUser,showCurrentUser); //show current user data
router.get("/:id",getUser); //get single data
router.patch("/updateUserPassword",authenticateUser,updateUserPassword); //update user password
router.patch("/updateUser",authenticateUser,updateUser); //update user


module.exports = router; 