import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import api from './src/routes/api.js'


const app = express()
app.use(cors({
    origin: 'http://localhost:8081',
    optionsSuccessStatus: 200
}))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', api)

app.listen(8000, () => {
    console.log('Listening on localhost:8000')
})
