const express = require("express");
const router = express();
const {authenticateUser,authorizePermissions} = require("../middleware/authentication");
const { 
    getAllUsers,
    getUser,
    showCurrentUser,
    updateUser,
    updateUserPassword,
    subscribe,
    createRelatedTopic,
} = 
require("../controllers/userController");

router.get("/",authenticateUser,authorizePermissions('admin'),getAllUsers);
router.get("/subscribe/:id",authenticateUser,subscribe);
router.get("/showMe",authenticateUser,showCurrentUser);
router.get("/:id",getUser);
router.patch("/updateUserPassword",authenticateUser,updateUserPassword);
router.patch("/updateUser",authenticateUser,updateUser);
router.post("/createRelatedTopic",authenticateUser,createRelatedTopic);


module.exports = router; 