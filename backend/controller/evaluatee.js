const conn = require('../config/db')
const bcrypt = require('bcrypt')



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



