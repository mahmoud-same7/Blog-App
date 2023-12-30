const async_handler = require('express-async-handler')
const { Category } = require('../models/Category')





/**
 * @method post
 * @route   /api/admin/category
 * @desc     create category
 * @access private (only admin)
 */

module.exports.Create_Category = async_handler(async(req,res)=> {
    const category = await Category.create({
        title: req.body.title,
        user: req.body.user,
    })
    res.status(201).json(category)
})


/**
 * @method get
 * @route   /api/admin/category
 * @desc     get category
 * @access public 
 */

module.exports.get_Category = async_handler(async(req,res)=> {
    const category = await Category.find().select('-user')
    res.status(201).json(category)
})
