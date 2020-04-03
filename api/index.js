import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import api from './src/routes/api.js'
import auth from './src/routes/auth.js'


const app = express()
app.use(cors({
    origin: 'http://0.0.0.0:8081',
    optionsSuccessStatus: 200
}))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', api)
app.use('/auth', auth)

app.listen(8000, () => {
    console.log('Listening on localhost:8000')
})
