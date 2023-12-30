const mongoose = require('mongoose')



const Commentschema = new mongoose.Schema({
    title:{
        type: String,
        required:true
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    post:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'post'
    },
},{timestamps:true})



const Comment = mongoose.model('comment', Commentschema)



module.exports = {
    Comment
}