const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const {
    createTokenUser,
    attachCookiesToResponse,
    checkPermissions, 
    nullControl,
    singleImageUpload, 
    fileDelete
} = require("../utils");

const getAllUsers = async (req,res) => {
    //get the requested data
    const users = await User.find({role:"user"}).select('-password -__v -verificationToken -passwordToken -passwordTokenExpirationDate');
    //return successful message and data
    res.status(StatusCodes.OK).json({ data : users, msg : "İşlem başarılı", NumberOfData : users.length });
}

const getUser = async (req,res) => {
    const user = await User.findOne({username:req.params.id}).select('-password -verificationToken -__v')
    .populate('blogs').populate('followers').populate('followed');
    if (!user) throw new CustomError.NotFoundError("Kullanıcı Bulunamadı");
    //return successful message and data
    res.status(StatusCodes.OK).json({ user : user, msg : "İşlem başarılı" });
}

const showCurrentUser = async (req,res) => {
    //get the requested data
    const user = await User.findOne({_id : req.user.userId}).select('-password -__v -verificationToken');
    //return successful message and data
    res.status(StatusCodes.OK).json({data : user});
}

const updateUser = async (req,res) => {
    //retrieve the requested data
    const {name,surname} = req.body;
    const user = await User.findOne({_id : req.user.userId});
    if (!user) throw new CustomError.NotFoundError('Kayıt bulunamadı');
    checkPermissions(req.user,user._id);
    if (req.files) {
        await fileDelete(user.image);
        const image = await singleImageUpload(req);
        user.image = image;
    }
    user.name = name;
    user.surname = surname;
    await user.save();
    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({res,user:tokenUser});
    res.status(StatusCodes.OK).json({user : tokenUser, msg : "İşlem başarılı"});
}

const updateUserPassword = async (req,res) => {
    //retrieve the requested data
    const { oldPassword, newPassword } = req.body;
    //null data check
    await nullControl([oldPassword,newPassword]);
    //user password change
    const user = await User.findOne({_id : req.user.userId});
    const isPasswordCorrect = await user.comparePassword(oldPassword);
    if (!isPasswordCorrect) throw new CustomError.UnauthenticatedError("Geçersiz kimlik bilgileri");
    //save data
    user.password = newPassword;
    await user.save();
    //return successful message
    res.status(StatusCodes.OK).json({msg : "Şifre başarıyla güncellendi"});
}

const subscribe = async (req,res) => {
    //takip eden kullanıcı
    const followingUser = await User.findOne({_id : req.user.userId});
    //takip edilen kullanıcı
    const followedUser = await User.findOne({_id : req.params.id});
    //kullanıcı kendini takip etmek isterse
    if (followingUser.username === followedUser.username) throw new CustomError.BadRequestError("Geçersiz istek");
    //takip etmiyorsa ekle
    if (!followedUser.followers.includes(followingUser._id)) {
        followedUser.followers.push(followingUser);
        await followedUser.save()
        followingUser.followed.push(followedUser);
        await followingUser.save();
        res.status(StatusCodes.OK).json({msg : `Tebrikler ${followedUser.name} isimli kullanıcıyı takip etmeye başladın`});
    }else{
        //takip ediyorsa çıkart
        const followedUserIndex = followedUser.followers.indexOf(followingUser._id);
        followedUser.followers.splice(followedUserIndex,1);
        await followedUser.save();
        const followingUserIndex = followingUser.followed.indexOf(followedUser._id);
        followingUser.followed.splice(followingUserIndex,1);
        await followingUser.save();
        res.status(StatusCodes.OK).json({msg : `${followedUser.name} isimli kullanıcıyı takip etmeyi bıraktın`});
    }
}

module.exports = {
    getAllUsers,
    getUser,
    showCurrentUser,
    updateUser,
    updateUserPassword,
    subscribe
}