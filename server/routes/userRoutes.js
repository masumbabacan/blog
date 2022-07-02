const express = require("express");
const router = express();
const {authenticateUser,authorizePermissions} = require("../middleware/authentication")
var cors = require("cors")

const { getAllUsers,getUser,showCurrentUser,updateUser,updateUserPassword } = 
require("../controllers/userController");

router.route("/").get(cors(),authenticateUser,authorizePermissions,getAllUsers);

router.route("/showMe").get(showCurrentUser);
router.route("/updateUser").patch(updateUser);
router.route("/updateUserPassword").patch(updateUserPassword);

router.route("/:id").get(getUser);

module.exports = router;