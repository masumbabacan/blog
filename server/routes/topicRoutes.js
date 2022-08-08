const express = require('express');
const router = express();
const {authenticateUser,authorizePermissions} = require("../middleware/authentication");
const { 
    createTopic, 
    getAllTopic, 
    updateTopic,
    deleteTopic,
    getTopic,
} = require("../controllers/topicController");

router.get("/",authenticateUser,authorizePermissions('admin'),getAllTopic);
router.get("/:id",authenticateUser,authorizePermissions('admin'),getTopic);
router.post("/",authenticateUser,authorizePermissions('admin'),createTopic);
router.patch("/:id",authenticateUser,authorizePermissions('admin'),updateTopic);
router.delete("/:id",authenticateUser,authorizePermissions('admin'),deleteTopic);

module.exports = router;