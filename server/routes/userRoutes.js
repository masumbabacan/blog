const express = require("express");
const router = express();
const {authenticateUser,authorizePermissions} = require("../middleware/authentication");
const { getAllUsers,getUser,showCurrentUser,updateUser,updateUserPassword } = 
require("../controllers/userController");

<<<<<<< HEAD
router.route("/").get(
    authenticateUser,
    authorizePermissions('admin'),
    getAllUsers,
);
=======
>>>>>>> 6683a778c0cb2e5e318da7b5ac8902b7be47ec0f

router.get("/",authenticateUser,authorizePermissions('admin'),getAllUsers); //get all data
router.get("/showMe",authenticateUser,showCurrentUser); //show current user data
router.get("/:id",authenticateUser,getUser); //get single data
router.patch("/updateUserPassword",authenticateUser,updateUserPassword); //update user password
router.patch("/updateUser",authenticateUser,updateUser); //update user


module.exports = router;