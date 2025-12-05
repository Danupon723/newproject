const conn = require('../config/db')
const bcrypt = require('bcrypt')
// เเสดงข้อมูล ผู้ใช้บัญชีทั้งหมด
exports.userlist = async (req, res, next) => {
  try {
    const user = await conn('users').select("*").orderBy("id" , "desc")
    res.json(user)
  } catch (e) {
    next(e)
  }
}

// admin สร้างบัญชีผู้ใช้งาน
exports.createuser = async (req, res, next) => {
  try {

    const { email, password, name, department_id, group_id, role } = req.body
    const user = await conn('users').where({ email }).first()
    if (user) { return res.status(400).json({ success: false, message: 'มีผู้ใช้บัญชีนี้เเล้ว' }) }

    const password_hash = await bcrypt.hash(password, 10)


    const adduser = await conn('users').insert({ email, password: password_hash, name, department_id, group_id, role })
    res.json({ success: true, message: "สร้างสำเร็จ" })
  } catch (e) {
    next(e)
  }
}
// เเก้ไช้ข้อมูลผู้ใช้งาน
exports.edituser = async (req, res, next) => {
  try {
    console.log(req.params.id)
    const id = req.params.id
    console.log(req.body)
    const { email, password, name, department_id, group_id, role } = req.body

    // Check for duplicate email excluding current user
    const user = await conn('users').where({ email }).whereNot({ id }).first()
    if (user) { return res.status(400).json({ success: false, message: 'มีผู้ใช้บัญชีนี้เเล้ว' }) }

    let updateData = { email, name, department_id, group_id, role }

    if (password) {
      const password_hash = await bcrypt.hash(password, 10)
      updateData.password = password_hash
    }

    const adduser = await conn('users').where({ id }).update(updateData)
    res.json({ success: true, message: "เเก่ไช้สำเร็จ" })
  } catch (e) {
    next(e)
  }
}

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


exports.periodslist = async (req,res,next)=>{
  try{
       const preiod = await conn('evaluation_periods').select("*")
    res.json(preiod)
  }catch(e){
    next(e)
  }
}
exports.createperiod = async (req,res,next)=>{    
  try{
    console.log(req.body)
       const {main , yeas , start , end } = req.body
       const periods = await conn('evaluation_periods').where({name : main}).first()
       if(periods) {return res.status(401).json({success:false , message : 'มีหัวข้อนี้เเล้ว'})}


       const addperiods = await conn('evaluation_periods').insert({name : main ,buddhist_year:  yeas , start_date : start , end_date : end})
       res.json({success:true , message: 'successfully'})
  }catch(e){
    next(e)
  }
}


exports.createindicator = async (req,res,next)=>{
  try{
      const {} = req.body
  }catch(e){
    next(e)
  }
}

exports.indicatorslist = async (req,res,next)=>{
  try{
     const indicators = await conn('indicators').select("*")
     res.json(indicators)            
  }catch(e){
    next(e)
  }
}


exports.assignments = async (req,res,next)=>{
  try{
    const assignments = await conn('assignments')
                              .leftJoin('evaluation_periods' , 'assignments.period_id' ,  'evaluation_periods.id')
                              .leftJoin({evaluator : 'users'}, 'assignments.evaluator_id' , 'evaluator.id')
                              .leftJoin({evaluatee : 'users'}, 'assignments.evaluatee_id' , 'evaluatee.id')
                              .leftJoin('departments' , 'assignments.depi_id' , 'departments.id')
                              .select('assignments.*' ,
                                      'evaluation_periods.name as period_name' , 
                                      'evaluator.name as evaluator_name',
                                      'evaluatee.name as evaluatee_name' , 
                                      'departments.name as deprmt_name'
                                      
                                      )

                    res.json({assignments})
                              
  }catch(e){
    next(e)
  }
}


exports.itemassignments = async ()
