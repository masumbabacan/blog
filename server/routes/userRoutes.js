const express = require("express");
const router = express();
const {authenticateUser,authorizePermissions} = require("../middleware/authentication");
const { getAllUsers,getUser,showCurrentUser,updateUser,updateUserPassword } = 
require("../controllers/userController");

router.route("/").get(
    authenticateUser,
    authorizePermissions('user','owner','developer'),
    getAllUsers,
);

router.route("/showMe").get(
    authenticateUser,
    showCurrentUser
);

router.route("/updateUserPassword").patch(
    authenticateUser,
    updateUserPassword
);

router.route("/updateUser").patch(
    authenticateUser,
    updateUser
);

router.route("/:id").get(
    authenticateUser,
    getUser
);

module.exports = router;