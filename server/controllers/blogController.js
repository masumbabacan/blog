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
    const blogs = await Blog.find({deleteCompletely : false},{},{skip : skip - limit, limit : limit})
    .populate({
        'path' : 'user',
        select : '-password -followers -followed -blogs -__v -verificationToken -passwordToken -passwordTokenExpirationDate'
    });
    res.status(StatusCodes.OK).json({ data : blogs, msg : "İşlem başarılı", NumberOfData : blogs.length });
}

const getBlog = async (req,res) => {
    const blog = await Blog.findOne({_id : req.params.id, deleteCompletely : false})
    .populate({
        'path' : 'user', 
        select : '-password -followers -followed -blogs -__v -verificationToken -passwordToken -passwordTokenExpirationDate'
    });
    if (!blog) throw new CustomError.NotFoundError('Kayıt bulunamadı');
    res.status(StatusCodes.OK).json({ data : blog, msg : "İşlem başarılı" });
}

const updateBlog = async (req,res) => {
    const {name,content} = req.body;
    const blog = await Blog.findOne({_id : req.params.id});
    if (!blog) throw new CustomError.NotFoundError('Kayıt bulunamadı');
    checkPermissions(req.user,blog.user);
    blog.name = name;
    blog.content = content;
    await blog.save();
    if (req.files) {
        await fileDelete(blog.image);
        const image = await singleImageUpload(req);
        blog.image = image;
        await blog.save();
    }
    res.status(StatusCodes.OK).json({ msg : "Blog başarıyla güncellendi" });
}

const deleteBlog = async (req,res) => {
    const blog = await Blog.findOne({_id : req.params.id});
    if (!blog) throw new CustomError.NotFoundError('Kayıt bulunamadı');
    checkPermissions(req.user,blog.user);
    blog.deleteCompletely = true;
    blog.save();
    const user = await User.findOne({_id : req.user.userId});
    const blogIndex = user.blogs.indexOf(blog._id);
    user.blogs.splice(blogIndex,1);
    await user.save();
    res.status(StatusCodes.OK).json({ msg : "Blog başarıyla silindi" });
}

const authenticateUserBlogs = async (req,res) => {
    const skip = req.query.page * req.query.limit;
    const limit = req.query.limit;
    if (limit > 100) throw new CustomError.BadRequestError("Bir sayfada en fazla 100 kayıt görüntülenebilir");
    const blogs = await Blog.find({user : req.user.userId, deleteCompletely : false},{},{skip : skip - limit, limit : limit}).select('-user');
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