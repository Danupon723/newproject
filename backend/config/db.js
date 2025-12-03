const knex = require('knex')
require('dotenv').config()

const conn = knex({
    client:'mysql2',
    connection:{
        host  : process.env.DB_HOST || '127.0.0.1' , 
        user :process.env.DB_USER || 'root' , 
        password:process.env.DB_PASS || '' , 
        database:process.env.DB_NAME || 'newcreateskill_db' , 
        port:process.env.DB_PORT || 3306 , 
        connectTimeout:1500
    },
    pool:{min:0 , max:10 , acquireTimeoutMillis:20000}
})
module.exports = conn

//     const headers =  { Authorization: `Bearer ${token}`} 


// //   const res = await axios.post('http://localhost:3000/api/profile',payload ,  {headers} )
//   const res = await axios.get(`http://localhost:3000/api/profile/${userid}` ,  {headers} )
//   const res = await axios.get(`http://localhost:3000/api/profile/${userid}` ,  
//     {
//       headers: { Authorization: "Bearer <token>"
   
//   }} )
  
       
    