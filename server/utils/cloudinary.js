const cloudinary = require('cloudinary')


cloudinary.config({
    cloud_name : process.env.CLOUD_NAME,
    api_key : process.env.API_KEY,
    api_secret : process.env.API_SECRET,
})



// upload image to cloudinary

const UploadCloudinary = async (imagePath)=> {
    try {
        const data  = await cloudinary.uploader.upload(imagePath ,{
            resource_type :'auto'
        })
        return data
    } catch (error) {
        return error
    }
}


// remove image to cloudinary

const removeCloudinary = async (public_id)=> {
    try {
        const resualt  = cloudinary.uploader.destory(public_id)
        return resualt
    } catch (error) {
        return error
    }
}


module.exports = {
    UploadCloudinary,
    removeCloudinary
}