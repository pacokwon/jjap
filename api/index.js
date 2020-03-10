import express from 'express'
import bodyParser from 'body-parser'
import api from './src/routes/api.js'

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', api)

app.listen(8000, () => {
    console.log('Listening on localhost:8000')
})
