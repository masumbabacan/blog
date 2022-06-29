const mongoose = require("mongoose");
const validator = require('validator');

const UserSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true,"Lütfen isim giriniz"],
        minLength : 3,
        maxLength : 50
    },
    email : {
        type : String,
        unique : [true,"Bu email zaten kayıtlı"],
        required : [true,"Lütfen email giriniz"],
        validate : {
            validator: validator.isEmail,
            message : "Lütfen doğru bir email giriniz"
        }
    },
    password : {
        type : String,
        required : [true,"Lütfen şifre giriniz"],
        minLength : [6,"Şifre en az 6 karakter olmalıdır"]
    },
    role : {
        type : String,
        enum : ["admin","user"],
        default : "user",
    }
});

module.exports = mongoose.model("User",UserSchema);