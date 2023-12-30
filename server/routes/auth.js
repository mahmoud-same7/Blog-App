const { Register, Login, Update, Update_Image } = require('../controller/auth')
const { ObjectID } = require('../middlewares/objectID')
const { Upload } = require('../middlewares/uploadImage')
const { verfiyToken_himself } = require('../middlewares/verfiyToken')

const router = require('express').Router()

router.route('/register').post(Register)

router.route('/login').post(Login)

router.route('/update/:id').put(ObjectID,verfiyToken_himself,Update)

router.route('/update-image/:id').post(ObjectID,verfiyToken_himself,Upload.single('image'),Update_Image)




module.exports =router