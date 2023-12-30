const mongoose = require('mongoose')

module.exports.ObjectID = (req,res,next)=> {
    if(mongoose.Types.ObjectId.isValid(req.params.id)) {
        next()
    }else {
        return res.status(400).json({msg:'This id incorrect'})
    }
}