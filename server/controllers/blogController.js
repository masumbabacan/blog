const Blog = require("../models/Blog");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { singleImageUpload, fileDelete, checkPermissions } = require('../utils');

const createBlog = async (req,res) => {
    //information from the request
    const {name,content} = req.body;
    //image control and upload process
    const image = await singleImageUpload(req);
    //user information that made the request
    const user = req.user.userId;
    //creating and saving data
    await Blog.create({name,content,image,user});
    //return successful message
    res.status(StatusCodes.CREATED).json({msg : 'Kayıt başarıyla eklendi'});
};

const getAllBlogs = async (req,res) => {
    //pull data with active status
    const blogs = await Blog.find({status : true});
    //return successful message and data
    res.status(StatusCodes.OK).json({ blogs : blogs, msg : "İşlem başarılı", NumberOfBlogs : blogs.length });
}

const getBlog = async (req,res) => {
    //retrieve the requested data
    const blog = await Blog.findOne({_id : req.params.id, status : true});
    //check data
    if (!blog) throw new CustomError.NotFoundError('Kayıt bulunamadı');
    //return successful message and data
    res.status(StatusCodes.OK).json({ blog : blog, msg : "İşlem başarılı" });
}

const updateBlog = async (req,res) => {
    //retrieve the requested data
    const {name,content} = req.body;
    //check data
    const blog = await Blog.findOne({_id : req.params.id});
    if (!blog) throw new CustomError.NotFoundError('Kayıt bulunamadı');
    //authorization check of the person who wants to update
    checkPermissions(req.user,blog.user);
    //If there is a picture in the request
    if (req.files) {
        //delete the old image of the data you want to update
        await fileDelete(blog.image);
        //upload new image
        const image = await singleImageUpload(req);
        //assign new image
        blog.image = image;
    }
    //save information
    blog.name = name;
    blog.content = content;
    await blog.save();
    //return successful message
    res.status(StatusCodes.OK).json({ msg : "Blog başarıyla güncellendi" });
}

const deleteBlog = async (req,res) => {
    //check data
    const blog = await Blog.findOne({_id : req.params.id});
    if (!blog) throw new CustomError.NotFoundError('Kayıt bulunamadı');
    //authorization check of the person who wants to delete
    checkPermissions(req.user,blog.user);
    //save information
    blog.status = false;
    blog.save();
    //return successful message
    res.status(StatusCodes.OK).json({ msg : "Blog başarıyla silindi" });
}

const authenticateUserBlogs = async (req,res) => {
    console.log(req.query.page);
    const skip = req.query.page * req.query.limit;
    const limit = req.query.limit;
    if (limit > 500) throw new CustomError.BadRequestError("Bir sayfada en fazla 500 kayıt görüntülenebilir");
    const blogs = await Blog.find({user : req.user.userId},{},{skip : skip - limit, limit : limit}).select('-user');
    res.status(StatusCodes.OK).json({ blogs : blogs, msg : "İşlem başarılı", NumberOfBlogs : blogs.length });
}

module.exports = {
    createBlog,
    getAllBlogs,
    getBlog,
    updateBlog,
    deleteBlog,
    authenticateUserBlogs
}