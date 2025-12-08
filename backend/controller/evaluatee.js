const conn = require('../config/db')
const bcrypt = require('bcrypt')
const path =  require('path')



exports.profile = async (req,res,next) =>{
    try{
        console.log(req.user.id)
        const id = req.user.id
        const item  = await conn('users')
                            .leftJoin('departments' , 'users.department_id' ,'departments.id' )
                            .leftJoin('org_groups' , 'users.group_id' , 'org_groups.id' )
                            .select('users.*' , 'departments.name as deprmt_name' , 'org_groups.name as group_name' )
                            .where('users.id' , id)
                            .first()
            res.json({item})
    }catch(e){
        next(e)
    }
}


exports.uploadContract = async (req,res,next)=>{
    try{
            console.log( 'file upload' , req.file)

    const relativePath = req.file.path
      .split('uploads' + path.sep)[1] // ตัดส่วนก่อนหน้า 'uploads'
      .replace(/\\/g, '/'); // เปลี่ยน \ เป็น / สำหรับใช้ใน URL
      console.log(relativePath)
      console.log(req.file.originalname)
      console.log(req.file.mimetype)
      console.log(req.file.size)
      console.log(req.user.id)
      
    }catch(e){
        next(e)
    }
}



