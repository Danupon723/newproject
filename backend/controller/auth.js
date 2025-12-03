const conn = require('../config/db')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
//เเสดงข้อมูลเเผนกทั้งหมด
exports.department = async (req , res  , next) =>{
    try{
        const dept = await conn('departments').select('*')
        res.json(dept)
        
    }catch(e){
        next(e)
    }
}
//เเสดงข้อมูลฝ่ายทั้งหมด
exports.group = async (req,res,next)=>{
    try{
        const group = await conn('org_groups').select("*")
        res.json(group)
    }catch(e){
        next(e)
    }
}
//ระบบ login ด้วย email password 
exports.login = async (req,res,next) =>{
    try{
        console.log(req.body)
        const {email , password} = req.body
        const user = await conn('users').where({email}).first()
        if(!user){return res.status(400).json({success:false , message:"ไม่พบบัญชี"})}

        const voity = await bcrypt.compare(password,  user.password)
        if(!voity){return res.status(401).json({success:false,message:'รหัสผ่านไม่ถุก'})}

        const token =  jwt.sign({id: user.id , role: user.role} , process.env.SECRETKEY , {expiresIn: process.env.EXPIRES || '2h'})
        res.json({success:true , token , role:user.role})

    }catch(e){
        next(e)
    }
}
//สมัครผู้ใช้งานบัญขีมีการตรวดผู้ใช้้ก่อน
exports.register = async (req,res,next) =>{
    try{
        console.log(req.body)
        const  {email , password , name , department_id , group_id , role = 'evaluatee'} = req.body
                       const user = await conn("users").where({email}).first()
                       if(user) {return res.status(403).json({success:false , message:'มีบัญชีผู้ใช้อยู่เเล้ว'})}

                       const password_hash = await  bcrypt.hash(password , 10)
                       
                       const adduser = await conn('users').insert({email , password : password_hash , name , department_id , group_id, role})
                       res.json({success:true , message : "สมัครสำเร็จ"})
    }catch(e){
        next(e)
    }
}

