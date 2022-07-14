const express = require('express');
const router = express();
const {authenticateUser,authorizePermissions} = require("../middleware/authentication");
const { createBlog, getAllBlogs, getBlog } = 
require("../controllers/blogController");

router.route('/').get(getAllBlogs);
router.route('/:id').get(getBlog);
router.route('/').post(authenticateUser,authorizePermissions('user','admin'),createBlog);
// router.route('/').patch();
// router.route('/').delete();

module.exports = router;