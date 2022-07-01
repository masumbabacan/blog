const express = require("express");
const router = express();
const {authenticateUser} = require("../middleware/authentication")

const { getAllUsers,getUser,showCurrentUser,updateUser,updateUserPassword } = 
require("../controllers/userController");

router.route("/").get(authenticateUser,getAllUsers);

router.route("/showMe").get(showCurrentUser);
router.route("/updateUser").patch(updateUser);
router.route("/updateUserPassword").patch(updateUserPassword);

router.route("/:id").get(getUser);

module.exports = router;