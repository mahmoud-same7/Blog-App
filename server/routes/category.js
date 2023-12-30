
const { Create_Category, get_Category } = require('../controller/category')
const {verfiyToken_isAdmin, verfiyToken } = require('../middlewares/verfiyToken')

const router = require('express').Router()

router.route('/').post(verfiyToken_isAdmin,Create_Category)
router.route('/').get(get_Category)


module.exports = router