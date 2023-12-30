const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const { ConnectDB } = require('./db/DB')

const app = express()

app.use(cors())
app.use(helmet())
app.use(express.json())
require('dotenv').config()

ConnectDB()

// Routes
app.use('/api/user',require('./routes/auth'))
app.use('/api/post',require('./routes/post'))
app.use('/api/comment',require('./routes/comment'))
app.use('/api/category',require('./routes/category'))



const PORT = process.env.PORT || 8000
app.listen(PORT , ()=> {console.log(`Server is Running on port ${PORT}`)})