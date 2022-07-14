const Blog = require("../models/Blog");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

const createBlog = async (req,res) => {
    const {name,content} = req.body;
    if (!name || !content) {
        throw new CustomError.BadRequestError('Lütfen alanları boş bırakmayın');
    }
    await Blog.create({name,content});
    res.status(StatusCodes.CREATED).json({msg : 'İşlem başarılı'});
};

const getAllBlogs = async (req,res) => {
    const blogs = await Blog.find({});
    res.status(StatusCodes.OK).json({
        blogs : blogs, 
        msg : "İşlem başarılı",
        NumberOfBlogs : blogs.length
    });
}

const getBlog = async (req,res) => {
    const blog = await Blog.findOne({_id : req.params.id});
    res.status(StatusCodes.OK).json({
        blog : blog, 
        msg : "İşlem başarılı"
    });
}

module.exports = {
    createBlog,
    getAllBlogs,
    getBlog,
}