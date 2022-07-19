const Blog = require("../models/Blog");
const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { singleImageUpload, fileDelete, checkPermissions } = require('../utils');

const createBlog = async (req,res) => {
    const {name,content} = req.body;
    const image = await singleImageUpload(req);
    const user = await User.findOne({_id : req.user.userId});
    if (!user) throw new CustomError.NotFoundError('Kayıt sırasına hata oluştu');
    const blog = await Blog.create({name,content,image,user : user._id});
    user.blogs.push(blog);
    await user.save();
    res.status(StatusCodes.CREATED).json({msg : 'Kayıt başarıyla eklendi'});
};

const getAllBlogs = async (req,res) => {
    const skip = req.query.page * req.query.limit;
    const limit = req.query.limit;
    if (limit > 100) throw new CustomError.BadRequestError("Bir sayfada en fazla 100 kayıt görüntülenebilir");
    //pull data with active status
    const blogs = await Blog.find({},{},{skip : skip - limit, limit : limit}).populate({'path' : 'user', select : '_id name surname email role verified'});
    //return successful message and data
    res.status(StatusCodes.OK).json({ data : blogs, msg : "İşlem başarılı", NumberOfData : blogs.length });
}

const getBlog = async (req,res) => {
    //retrieve the requested data
    const blog = await Blog.findOne({_id : req.params.id, status : true}).populate({'path' : 'user', select : '_id name surname email role verified'});
    //check data
    if (!blog) throw new CustomError.NotFoundError('Kayıt bulunamadı');
    //return successful message and data
    res.status(StatusCodes.OK).json({ data : blog, msg : "İşlem başarılı" });
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
    const skip = req.query.page * req.query.limit;
    const limit = req.query.limit;
    if (limit > 100) throw new CustomError.BadRequestError("Bir sayfada en fazla 100 kayıt görüntülenebilir");
    const blogs = await Blog.find({user : req.user.userId},{},{skip : skip - limit, limit : limit}).select('-user');
    res.status(StatusCodes.OK).json({ data : blogs, msg : "İşlem başarılı", NumberOfData : blogs.length });
}

module.exports = {
    createBlog,
    getAllBlogs,
    getBlog,
    updateBlog,
    deleteBlog,
    authenticateUserBlogs
}



//populate
//await Blog.find().populate({'path' : 'user', match : {'_id' : req.user.userId}, select : '-password -isVerified -verificationToken -__v'});