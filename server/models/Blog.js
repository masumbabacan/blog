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
},{timestamps : true});

module.exports = mongoose.model('Blog',BlogSchema);