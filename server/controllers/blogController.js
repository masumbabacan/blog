const Blog = require("../models/Blog");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { singleImageUpload, fileDelete, checkPermissions } = require('../utils');

const createBlog = async (req,res) => {
    const {name,content} = req.body;
    const image = await singleImageUpload(req);
    const user = req.user.userId;
    await Blog.create({name,content,image,user});
    res.status(StatusCodes.CREATED).json({msg : 'Kayıt başarıyla eklendi'});
};

const getAllBlogs = async (req,res) => {
    const blogs = await Blog.find({status : true});
    res.status(StatusCodes.OK).json({ blogs : blogs, msg : "İşlem başarılı", NumberOfBlogs : blogs.length });
}

const getBlog = async (req,res) => {
    const blog = await Blog.findOne({_id : req.params.id, status : true});
    if (!blog) {
        throw new CustomError.NotFoundError('Kayıt bulunamadı');
    }
    res.status(StatusCodes.OK).json({ blog : blog, msg : "İşlem başarılı" });
}

const updateBlog = async (req,res) => {
    const {name,content} = req.body;
    const blog = await Blog.findOne({_id : req.params.id});
    if (!blog) {
        throw new CustomError.NotFoundError('Kayıt bulunamadı');
    }
    checkPermissions(req.user,blog.user);
    if (req.files) {
        await fileDelete(blog.image);
        const image = await singleImageUpload(req);
        blog.image = image;
    }
    blog.name = name;
    blog.content = content;
    await blog.save();
    res.status(StatusCodes.OK).json({ msg : "Blog başarıyla güncellendi" });
}

const deleteBlog = async (req,res) => {
    const blog = await Blog.findOne({_id : req.params.id});
    if (!blog) {
        throw new CustomError.NotFoundError('Kayıt bulunamadı');
    }
    checkPermissions(req.user,blog.user);
    blog.status = false;
    blog.save();
    res.status(StatusCodes.OK).json({ msg : "Blog başarıyla silindi" });
}

module.exports = {
    createBlog,
    getAllBlogs,
    getBlog,
    updateBlog,
    deleteBlog
}