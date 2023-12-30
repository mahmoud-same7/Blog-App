const mongoose = require('mongoose')


module.exports.ConnectDB = async()=>{
    try {
        await mongoose.connect(process.env.DB_URL)
        console.log('Connection DB ^-^')
    } catch (error) {
        console.log('Connection DB faild',error)
    }
}