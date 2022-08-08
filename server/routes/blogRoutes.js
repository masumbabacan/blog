const express = require('express');
const router = express();
const {authenticateUser,authorizePermissions} = require("../middleware/authentication");
const { 
    createBlog, 
    getAllBlogs, 
    getBlog, 
    updateBlog, 
    deleteBlog, 
    authenticateUserBlogs,
    like,
} = require("../controllers/blogController");


router.get("/",getAllBlogs);
router.get("/like/:id",authenticateUser,like);
router.get("/authenticateUserBlogs",authenticateUser,authenticateUserBlogs);
router.get("/:id",getBlog);
router.post("/",authenticateUser,createBlog);
router.patch("/:id",authenticateUser,updateBlog);
router.delete("/:id",authenticateUser,deleteBlog);

module.exports = router;