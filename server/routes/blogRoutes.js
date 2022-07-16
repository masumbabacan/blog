const express = require('express');
const router = express();
const {authenticateUser,authorizePermissions} = require("../middleware/authentication");
const { createBlog, getAllBlogs, getBlog, updateBlog, deleteBlog } = 
require("../controllers/blogController");

router.route('/').get(
    authenticateUser,
    authorizePermissions('admin','user'),
    getAllBlogs
);

router.route('/:id').get(
    getBlog
);

router.route('/').post(
    authenticateUser,
    authorizePermissions('user','admin'),
    createBlog
);

router.route('/:id').patch(
    authenticateUser,
    authorizePermissions('user','admin'),
    updateBlog
);

router.route('/:id').delete(
    authenticateUser,
    authorizePermissions('user','admin'),
    deleteBlog
);

module.exports = router;