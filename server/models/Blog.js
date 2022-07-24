const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true,"Lütfen isim giriniz"],
        minLength : [5,"isim en az 5 karakter olmalıdır"],
        maxLength : [100,"isim en fazla 100 karakter olmalıdır"]
    },
    content : {
        type : String,
        required : [true,"Lütfen içerik giriniz"],
        minLength : [150,"içerik en az 150 karakter olmalıdır"],
    },
    image : {
        type : String,
    },
    user: { type: mongoose.Types.ObjectId, ref: 'User', required : true },
    status : {
        type : Boolean,
        default : true, 
    },
    deleteCompletely : {
        type : Boolean,
        default : false,
    },
    likes: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
},{timestamps : true});

//blogu silerken beğenen kullanıcıların beğenilerinden de silme
BlogSchema.pre('save', async function(next){
    if (!this.isModified('deleteCompletely')) return;
    this.model('User').updateMany(
        { },
        { $pullAll: { likedBlogs: [this._id] } },
        next
    );
});
//blogu silerken blog yazarının blog listesinden de silme
BlogSchema.pre('save', async function(next){
    if (!this.isModified('deleteCompletely')) return;
    this.model('User').updateOne(
        { },
        { $pullAll: { blogs: [this._id] } },
        next
    );
});

module.exports = mongoose.model('Blog',BlogSchema);