const async_handler = require('express-async-handler')
const { Comment } = require('../models/comment')





/**
 * @method post
 * @route   /api/comment
 * @desc     create comment
 * @access private (only login)
 */

module.exports.Create_Comment = async_handler(async(req,res)=> {
    const comment = await Comment.create({
        title: req.body.title,
        user: req.body.user,
        post: req.body.post,
    })
    res.status(201).json(comment)
})
