const { Create_Comment } = require('../controller/comment')
const { verfiyToken } = require('../middlewares/verfiyToken')

const router = require('express').Router()

router.route('/').post(verfiyToken,Create_Comment)


module.exports = router