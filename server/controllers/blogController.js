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
    const skip = req.query.page * 30;
    const limit = 30;
    const blogs = await Blog.find({status:true,deleteCompletely : false},{},{skip : skip - limit, limit : limit}).select('-deleteCompletely -status').sort({createdAt : 'desc'})
    .populate({
        path : 'user',
        select : '-password -followers -followed -blogs -likedBlogs -__v -verificationToken -passwordToken -passwordTokenExpirationDate'
    })
    .populate({
        path : 'likes',
        select : '-password -followers -followed -blogs -likedBlogs -__v -verificationToken -passwordToken -passwordTokenExpirationDate'
    });
    res.status(StatusCodes.OK).json({ data : blogs, NumberOfData : blogs.length, msg : "İşlem başarılı"});
}

const getBlog = async (req,res) => {
    const blog = await Blog.findOne({_id : req.params.id, deleteCompletely : false, status : true}).select('-deleteCompletely -status')
    .populate({
        path : 'user',
        select : '-password -followers -followed -blogs -likedBlogs -__v -verificationToken -passwordToken -passwordTokenExpirationDate'
    })
    .populate({
        path : 'likes',
        select : '-password -followers -followed -blogs -likedBlogs -__v -verificationToken -passwordToken -passwordTokenExpirationDate'
    });
    if (!blog) throw new CustomError.NotFoundError('Kayıt bulunamadı');
    res.status(StatusCodes.OK).json({ 
        data : blog, 
        likeLength : blog.likes.length,
        msg : "İşlem başarılı" 
    });
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
    const blog = await Blog.findOne({_id : req.params.id,deleteCompletely : false});
    if (!blog) throw new CustomError.NotFoundError('Kayıt bulunamadı');
    checkPermissions(req.user,blog.user);
    blog.deleteCompletely = true;
    blog.save();
    res.status(StatusCodes.OK).json({ msg : "Blog başarıyla silindi" });
}

const authenticateUserBlogs = async (req,res) => {
    const skip = req.query.page * req.query.limit;
    const limit = req.query.limit;
    if (limit > 100) throw new CustomError.BadRequestError("Bir sayfada en fazla 100 kayıt görüntülenebilir");
    const blogs = await Blog.find({user : req.user.userId, deleteCompletely : false},{},{skip : skip - limit, limit : limit}).select('-user').populate({
        path : 'likes',
        select : '-password -followers -followed -blogs -likedBlogs -__v -verificationToken -passwordToken -passwordTokenExpirationDate'
    });
    res.status(StatusCodes.OK).json({ data : blogs, msg : "İşlem başarılı", NumberOfData : blogs.length });
}

const like = async (req,res) => {
    const userLiked = await User.findOne({_id : req.user.userId});
    const likedBlog = await Blog.findOne({_id : req.params.id});;

    if (!userLiked.likedBlogs.includes(likedBlog._id)) {
        userLiked.likedBlogs.push(likedBlog);
        await userLiked.save()
        likedBlog.likes.push(userLiked);
        await likedBlog.save();
        res.status(StatusCodes.OK).json({msg : `${likedBlog.name} isimli yazıyı beğendin`});
    }else{
        //takip ediyorsa çıkart
        const userLikedIndex = likedBlog.likes.indexOf(userLiked._id);
        likedBlog.likes.splice(userLikedIndex,1);
        await likedBlog.save();
        const likedBlogIndex = userLiked.likedBlogs.indexOf(likedBlog._id);
        userLiked.likedBlogs.splice(likedBlogIndex,1);
        await userLiked.save();
        res.status(StatusCodes.OK).json({msg : `${likedBlog.name} isimli yazıdaki beğeniyi geri çektin`});
    }

}

module.exports = {
    createBlog,
    getAllBlogs,
    getBlog,
    updateBlog,
    deleteBlog,
    authenticateUserBlogs,
    like
}



//populate
//await Blog.find().populate({'path' : 'user', match : {'_id' : req.user.userId}, select : '-password -isVerified -verificationToken -__v'});