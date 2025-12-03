const jwt = require('jsonwebtoken')


module.exports = (...role)=>{
    return (req,res,next)=>{
        try{
          
        const headers = req.headers.authorization || ''
        const token  = headers.startsWith('Bearer ') ? headers.slice(7) : null
        if(!token){return res.status(401).json({success:false , message:"ไม่มี token"})}

        const payload = jwt.verify(token , process.env.SECRETKEY);


        if(role.length && !role.includes(payload.role)){
            return res.status(403).json({success:false,message:'คุณไม่มีสิทธ์เข้า'  })
        }

        req.user = payload
        next()
        }catch(e){
            next(e)
        }

    }
}