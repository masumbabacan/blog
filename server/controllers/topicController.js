const Topic = require("../models/Topic");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { nullControl } = require("../utils/index");

const createTopic = async (req,res) => {
    const {name, icon} = req.body;
    await nullControl([name,icon]);
    const topic = await Topic.create({name,icon});
    res.status(StatusCodes.CREATED).json({msg : "İşlem başarılı"});
};

const getAllTopic = async (req,res) => {
    const topics = await Topic.find({}).select('-__v');
    res.status(StatusCodes.OK).json({data : topics,msg : "İşlem başarılı"});
};

const getTopic = async (req,res) => {
    const topic = await Topic.findOne({_id : req.params.id}).select('-__v');
    if (!topic) {
        throw new CustomError.NotFoundError('Kayıt bulunamadı');
    }
    res.status(StatusCodes.OK).json({data : topic,msg : "İşlem başarılı"});
};

const updateTopic = async (req,res) => {
    const {name, icon} = req.body;
    const topic = await Topic.findOne({_id : req.params.id});
    if (!topic) {
        throw new CustomError.NotFoundError('Kayıt bulunamadı');
    }
    topic.name = name;
    topic.icon = icon;
    await topic.save();
    res.status(StatusCodes.OK).json({msg : "Güncelleme başarılı"});
};

const deleteTopic = async (req,res) => {
    const topic = await Topic.findOneAndDelete({_id : req.params.id});
    if (!topic) {
        throw new CustomError.NotFoundError('Kayıt bulunamadı');
    }
    res.status(StatusCodes.OK).json({msg : "İşlem başarılı"});
};

module.exports = {
    getAllTopic,
    getTopic,
    createTopic,
    updateTopic,
    deleteTopic,
};