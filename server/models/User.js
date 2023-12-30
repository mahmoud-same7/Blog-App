const mongoose= require('mongoose')
const Joi = require('joi')
const Jwt = require('jsonwebtoken')


const UserSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        minlength:2,
        maxlength:20,
        trim: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password:{
        type: String,
        required: true,
        minlength:8,
        trim: true
    },
    bio:{
        type: String,
        trim: true
    },
    image:{
        type: Object,
        default:{
            url:'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
            public_id: null
        },
    isAdmin: {
        type:Boolean,
        default:false
    }
    },
},{timestamps:true})

// create token
UserSchema.methods.Token = function(){
    return Jwt.sign({id:this._id , email:this.email , isAdmin: this.isAdmin},process.env.SECRETKEY)
}


const User = mongoose.model('user',UserSchema)

const ValidtionRegister = (obj)=> {
    const schema = Joi.object({
        username: Joi.string().trim().min(2).max(20).required(),
        email: Joi.string().trim().required(),
        password: Joi.string().trim().min(8).required(),
    })
    return schema.validate(obj)
}

const ValidtionLogin = (obj)=> {
    const schema = Joi.object({
        email: Joi.string().trim().required(),
        password: Joi.string().trim().min(8).required(),
    })
   return schema.validate(obj)
}

const ValidtionUpdate = (obj)=> {
    const schema = Joi.object({
        username: Joi.string().trim().min(2).max(20),
        bio: Joi.string().trim(),
        password: Joi.string().trim().min(8),
    })
    return schema.validate(obj)
}

module.exports = {
    User,
    ValidtionRegister,
    ValidtionLogin,
    ValidtionUpdate
}