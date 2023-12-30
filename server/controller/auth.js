const async_handler = require("express-async-handler")
const { ValidtionRegister, User, ValidtionLogin, ValidtionUpdate } = require("../models/User")
const bcrypt =  require('bcrypt')
const path = require('path')
const fs = require('fs')
const { UploadCloudinary, removeCloudinary } = require("../utils/cloudinary")
// test git 

/**
 * @method post
 * @desc   create new User
 * @access  public
 * @route /api/user/register
 */

module.exports.Register = async_handler(async(req,res)=> {
    // validtion
    const {error} = ValidtionRegister(req.body)
    if(error){
        return res.status(400).json({msg:error.details[0].message})
    }
    // check user Already register 
    let user = await User.findOne({email:req.body.email})
    if(user) {
        return res.status(400).json({msg:'This user Already register'})
    }
    // hashPassword
    const salt = await bcrypt.genSalt(10)
    req.body.password = await bcrypt.hash(req.body.password , salt)
    // create user
    user = await User.create({
        username:req.body.username,
        email:req.body.email,
        password:req.body.password
    })
    res.status(201).json({msg:'This User created , please login'})
})


/**
 * @method post
 * @desc   login User
 * @access  public
 * @route /api/user/login
 */

module.exports.Login = async_handler(async(req,res)=> {
    // validtion
    const {error} = ValidtionLogin(req.body)
    if(error){
        return res.status(400).json({msg:error.details[0].message})
    }
    // check user Already register 
    let user = await User.findOne({email:req.body.email})
    if(!user) {
        return res.status(400).json({msg:'please register'})
    }
    // checkPassword
        const checkPass = await bcrypt.compare(req.body.password , user.password)
        if(!checkPass) {
            res.status(400).json({msg:'This email or Password Incorrect'})
        }
    // create token
    const token = user.Token()
    const {password , ...other} = user._doc
    res.status(201).json({user:{...other},token})
})

/**
 * @method post
 * @desc   Update User
 * @access  private (only himself)
 * @route /api/user/Update/:id
 */

module.exports.Update = async_handler(async(req,res)=> {
    // validtion
    const {error} = ValidtionUpdate(req.body)
    if(error){
        return res.status(400).json({msg:error.details[0].message})
    }
    // check user Already find or not 
    let user = await User.findById(req.params.id).select('-password')
    if(!user) {
        return res.status(404).json({msg:'This user is not found'})
    }
    // update password
    if(req.body.password) {
        const salt = await bcrypt.genSalt(10)
        req.body.password = await bcrypt.hash(req.body.password , salt)
    }
    //update user
    user = await User.findByIdAndUpdate(req.params.id,{
        $set:{
            username: req.body.username,
            bio: req.body.bio,
            password: req.body.password
        }
    },{new:true}).select('-password')
    res.status(200).json(user)
})


/**
 * @method post
 * @desc   Update image
 * @access  private (only himself)
 * @route /api/user/Update-image/:id
 */

module.exports.Update_Image = async_handler(async(req,res)=> {
    // validtion
    if(!req.file) {
        return res.status(400).json({msg:'This filed is required!'})
    }
    // cloudinary
    const pathImage = path.join(__dirname , `../images/${req.file.filename}`)
    // upload Image to cloudinary
    const data = await UploadCloudinary(pathImage)
    // get user from DB Dy Id
    const user = await User.findById(req.params.id)
    if(user.image.public_id) {
        removeCloudinary(user.image.public_id)
    }
    user.image = {
        url: data.secure_url,
        public_id : data.public_id
    }
    await user.save()

    res.status(200).json({msg:"Uploaded Image"})
    fs.unlinkSync(pathImage)
})
