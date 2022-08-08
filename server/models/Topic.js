const mongoose = require('mongoose');

const TopicSchema = new mongoose.Schema({
    name: {
        type : String, 
        required : true
    },
    icon:{
        type : String, 
        required : true
    }
});

module.exports = mongoose.model('Topic',TopicSchema);