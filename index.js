const express = require('express')
const mongoose = require('mongoose')
const authRouter = require('./authRouter')
const PORT = process.env.PORT || 5000

const app = express()
require('dotenv').config()

app.use(express.json())
app.use('/auth', authRouter)
const start = async () => {
    try {
        await mongoose.connect(`mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.8.0`)
        app.listen(PORT, () => { console.log(`Server started on port ${PORT}`) })
    } catch(e) {
        console.log(e)
    }
}

start()