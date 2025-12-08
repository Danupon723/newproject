const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()


app.use(cors())
app.use(morgan('dev'))
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use("upload" , express.static("upload"))

const authrouter = require('./router/auth')
const adminrouter = require('./router/admin')
const evaluateerouter = require('./router/evaluatee')
const upload = require('./router/upload')


app.use('/api/auth' , authrouter)
app.use('/api/admin' , adminrouter)
app.use('/api/evaluatee' , evaluateerouter )
app.use('/api/upload' , upload)


app.use((req,res)=>{
    res.status(404).json({message:"not found"})
})

module.exports = app
