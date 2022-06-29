const mongoose = require("mongoose");
const validator = require('validator');
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true,"Lütfen isim giriniz"],
        minLength : 3,
        maxLength : 50
    },
    email : {
        type : String,
        unique : true,
        required : [true,"Lütfen email giriniz"],
        validate : {
            validator: validator.isEmail,
            message : "Email doğru bir formatta değil"
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

UserSchema.pre('save', async function(){
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
});

UserSchema.methods.comparePassword = async function(canditatePassword){
    const isMatch = await bcrypt.compare(canditatePassword,this.password);
    return isMatch;
}
module.exports = mongoose.model("User",UserSchema);