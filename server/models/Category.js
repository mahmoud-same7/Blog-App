const mongoose = require('mongoose')



const Categoryschema = new mongoose.Schema({
    title:{
        type: String,
        required:true
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'user'
    }
},{timestamps:true})



const Category = mongoose.model('category', Categoryschema)



module.exports = {
    Category
}