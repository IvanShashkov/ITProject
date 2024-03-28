const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')
const routes = require('../routes')
const apiRoutes = require('../routes/api')

require('dotenv').config()

const app = express()

const corsOptions = {
    origin: process.env.ORIGIN_URL,
    credentials: true,
    optionSuccessStatus: 200,
};


app.use(cors(corsOptions))
app.use(bodyParser.json())
app.use('/', routes)
app.use('/api', apiRoutes)

mongoose.connect('mongodb+srv://ivansshashkovv:Nesomnennoluchshiyparol1@cluster0.rgxmnl7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0').then(() => app.listen(process.env.PORT))

