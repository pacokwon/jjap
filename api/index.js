import express from 'express'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import api from './src/routes/api.js'

const app = express()
const db = mongoose.connection
db.once('open', () => console.log('connected to mongodb'))
mongoose.connect('mongodb://localhost/JLPT', { useNewUrlParser: true, useFindAndModify: false });

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', api)

app.listen(8080, () => {
    console.log('Listening on localhost:5000')
})
