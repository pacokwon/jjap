import express from "express"
import mongoose from "mongoose"
import bodyParser from "body-parser"

const app = express()
const db = mongoose.connection
db.once('open', () => console.log('connected to mongodb'))
mongoose.connect('mongodb://localhost/JLPT', { useNewUrlParser: true, useFindAndModify: false });

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(5000, () => {
    console.log('Listening on localhost:5000')
})
