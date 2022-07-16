const uuid = require("uuid").v4;
const path = require('path');
const CustomError = require("../errors");

const singleImageUpload = async (req) => {
    if (!req.files) return;
    const image = req.files.image;
    const maxSize = 1024 * 1024;
    if (!image.mimetype.startsWith('image')) throw new CustomError.BadRequestError('Lütfen bir resim yükleyiniz');
    if (image.size > maxSize) throw new CustomError.BadRequestError('Resim boyutu 1MB boyutundan fazla olmamalıdır');
    image.name = uuid() +'-'+ image.name.trim().replace(' ', '-');
    const imagePath = path.join(__dirname,'../public/uploads/' + `${image.name}`);
    await image.mv(imagePath);
    return `/uploads/${image.name}`
}

module.exports = singleImageUpload;