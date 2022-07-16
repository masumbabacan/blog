const express = require('express');
const router = express();
const {authenticateUser,authorizePermissions} = require("../middleware/authentication");
const { createBlog, getAllBlogs, getBlog, updateBlog, deleteBlog } = 
require("../controllers/blogController");


router.get("/",getAllBlogs); //get all data
router.get("/:id",getBlog); //get single data
router.post("/",authenticateUser,createBlog); //create data
router.patch("/:id",authenticateUser,updateBlog); //update data
router.delete("/:id",authenticateUser,deleteBlog); //delete data

module.exports = router;