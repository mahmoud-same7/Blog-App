const { ValidtionCreatePost, Post, ValidtionUpdatePost } = require("../models/Post")
const { UploadCloudinary, removeCloudinary } = require("../utils/cloudinary")

const async_handler = require("express-async-handler")
const path = require('path')
const fs = require('fs')
const { Comment } = require("../models/comment")



/**
 * @method post
 * @desc   create new post
 * @access  private (only login & Admin)
 * @route /api/post/
 */

module.exports.CreatePost = async_handler(async(req,res)=> {
    let post
    //validtion
    const {error}  = ValidtionCreatePost(req.body)
    if(error) {
        return res.status(400).json({msg: error.details[0].message})
    }
    post = await Post.create({
        title: req.body.title,
        description: req.body.description,
        user: req.user.id,
        category : req.body.category,
        image: {
            url: req.file.filename,
            public_id: null
        }
    })
    res.status(201).json({msg:'Post is Created'})
})


/**
 * @method put
 * @desc   Update new post
 * @access  private (only login & Admin)
 * @route /api/post/update/:id
 */

module.exports.UpdatePost = async_handler(async(req,res)=> {
    //validtion
    const {error}  = ValidtionUpdatePost(req.body)
    if(error) {
        return res.status(400).json({msg: error.details[0].message})
    }

    //post already find or not
    let post = await Post.findById(req.params.id)
    if(!post) {
        return res.status(404).json({msg:'This Post is Not Found'})
    }
        const PathImage = path.join(__dirname , `../images/${req.file.filename}`)
        // upload image to cloudinary
        if(PathImage) {
            const data = await UploadCloudinary(PathImage)
            console.log(data)
            if(post.image.public_id !== null) {
                removeCloudinary(post.image.public_id)
            }
            post.image = {
                url: data.secure_url,
                public_id : data.public_id
            }
            await post.save()
            fs.unlinkSync(PathImage)
        }
     post = await Post.findByIdAndUpdate(req.params.id,{
        $set : {
            title : req.body.title,
            description : req.body.description,
            category: req.body.category
        }
     },{new: true})
     res.status(200).json(post)
})


/**
 * @method get
 * @desc   get all posts
 * @access  public 
 * @route /api/post/
 */

module.exports.Get_All_Posts = async_handler(async(req,res)=> {
    const {category,page_num} = req.query
    const post_per_page = 8
    let post
    if(page_num) {
        post = await Post.find().skip( (page_num - 1) * post_per_page).limit(post_per_page).populate('user',['-password'])
    }else if (category) {
        post = await Post.find({category}).populate('user',['-password'])
    }else {
        post = await Post.find().populate('user',['-password'])
    }
    res.status(200).json(post)
})


/**
 * @method get
 * @desc   get post with id
 * @access  public 
 * @route /api/post/:id
 */

module.exports.Get_Post_withID = async_handler(async(req,res)=> {
    const {id} = req.params
    const post = await Post.findById(id).populate('user' , ['-password'])
    if(!post) {
        return res.status(404).json({msg:"This Post Is not Found"})
    }
    const comment = await Comment.find({post:id})
    res.status(200).json({post,comment})
})


/**
 * @method delete
 * @desc   delete post with id
 * @access  private 
 * @route /api/post/:id
 */

module.exports.Delete_Post_withID = async_handler(async(req,res)=> {
    const {id} = req.params
    const post = await Post.findByIdAndDelete(id)
    res.status(200).json({msg:'This Post Is Deleted'})
})



/**
 * @method post
 * @desc   Toggle like  post
 * @access  private (only login)
 * @route /api/post/like/
 */

module.exports.Toggle_Like = async_handler(async(req,res)=> {
    const loggedInUser = req.user.id
    const {id} = req.body
    let post  = await Post.findById(id)
    if(!post) {
        return res.status(404).json({msg:'this post not found'})
    }

    const Post_Already_Liked = post?.likes.find((user)=> {
       return (user).toString() === req.user.id
    })
    console.log(Post_Already_Liked)
    if(Post_Already_Liked){
        post = await Post.findByIdAndUpdate(id , {
            $pull : {
                likes : loggedInUser
            }
        },{new:true})
    }else {
        post = await Post.findByIdAndUpdate(id , {
            $push : {
                likes : loggedInUser
            }
        },{new:true})
    }
    res.status(200).json(post)
})
