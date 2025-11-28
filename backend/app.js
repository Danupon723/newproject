const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()


app.use(cors())
app.use(morgan('dev'))
app.use(express.urlencoded({extended:true}))
app.use(express.json())


const authrouter = require('./router/auth')
const adminrouter = require('./router/admin')
app.use('/api/auth' , authrouter)
app.use('/api/admin' , adminrouter)
app.use((req,res)=>{
    res.status(404).json({message:"not found"})
})

module.exports = app
