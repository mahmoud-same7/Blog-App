const Jwt = require('jsonwebtoken')


// verfiy Token
const verfiyToken = (req,res,next)=> {
    const token = req.headers.authorization
    if(token) {
        try {
            const decode = Jwt.verify(token,process.env.SECRETKEY)
            req.user = decode
            next()
        } catch (error) {
            return res.status(401).json({msg:'this token Incorrect'})
        }
    }else {
        return res.status(401).json({msg:'This Token not provided'})
    }
}


// verfiyToken and authorization
const verfiyToken_himself = (req,res ,next)=> {
    verfiyToken(req,res,()=> {
        console.log(req.params.id , req.user.id)
        if(req.params.id === req.user.id) {
            next()
        }else {
            return res.status(403).json({msg:'access denied !'})
        }
    })
}

// verfiyToken and authorization
const verfiyToken_isAdmin = (req,res ,next)=> {
    verfiyToken(req,res,()=> {
        if(req.user.isAdmin) {
            next()
        }else {
            return res.status(403).json({msg:'access denied !'})
        }
    })
}



module.exports = {
    verfiyToken,
    verfiyToken_himself,
    verfiyToken_isAdmin
}