const multer = require('multer')
const path = require('path')


const storage = multer.diskStorage({
    destination: function(req,file,cb) {
        cb(null , path.join(__dirname , '../images') )
    },
    filename: function(req,file,cb) {
        if(file) {
            cb(null , new Date().toISOString().replace(/:/g,'-') + file.originalname)
        }else{
            cb(null , false)
        }
    }
})

const Upload = multer({
    storage,
    fileFilter: function(req,file,cb) {
        if(file.mimetype.startsWith('image')) {
                cb(null , true)
        }else {
            cb({msg:'Unspported File'})
        }
    },
    limits:{fileSize: 1024 * 1024 * 2}
})

module.exports = {
    Upload
}
