const express = require("express");
const router = express();
const {authenticateUser,authorizePermissions} = require("../middleware/authentication")
var cors = require("cors")
const { getAllUsers,getUser,showCurrentUser,updateUser,updateUserPassword } = 
require("../controllers/userController");



router.route("/").get(
    cors(),
    authenticateUser,
    authorizePermissions('admin','owner','developer'),
    getAllUsers,
);

router.route("/showMe").get(
    cors(),
    authenticateUser,
    authorizePermissions,
    showCurrentUser
);

router.route("/updateUser").patch(
    cors(),
    authenticateUser,
    authorizePermissions,
    updateUser
);

router.route("/updateUserPassword").patch(
    cors(),
    authenticateUser,
    authorizePermissions,
    updateUserPassword
);

router.route("/:id").get(
    cors(),
    authenticateUser,
    authorizePermissions,
    getUser
);

module.exports = router;