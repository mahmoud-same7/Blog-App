const mongoose= require('mongoose')
const Joi = require('joi')


const PostSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
        minlength:2,
        maxlength:50,
        trim: true
    },
    description:{
        type: String,
        required: true,
        minlength: 20,
        trim: true
    },
    category:{
        type: String,
        required: true
    },
    image:{
        type: Object,
        default:{
            url:'https://www.istockphoto.com/photo/white-concrete-texture-polished-wall-background-grey-retro-plain-color-cement-crack-gm1412088995-461671007',
            public_id: null
        }
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    likes:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"user"
        }
    ]
},{timestamps:true})

const Post = mongoose.model('post',PostSchema)

// validtion

const ValidtionCreatePost = (obj)=> {
    const schema = Joi.object({
        title: Joi.string().trim().min(2).max(50).required(),
        description: Joi.string().trim().required(),
        image: Joi.string(),
        category : Joi.string().required()
    })
    return schema.validate(obj)
}

const ValidtionUpdatePost = (obj)=> {
    const schema = Joi.object({
        title: Joi.string().trim().min(2).max(50),
        description: Joi.string().trim(),
        image: Joi.string(),
        category : Joi.string()
    })
   return schema.validate(obj)
}

module.exports = {
    Post,
    ValidtionCreatePost,
    ValidtionUpdatePost
}
