import express from 'express'
import mongoose from 'mongoose'
import jlptSchema from '../schema/jlptSchema.js'

const router = express.Router()

router.get('/vocablist', (req, res) => {
    const { level, part } = req.query
    const VocabList = mongoose.model(`level${level}part${part}`, jlptSchema)
    VocabList.find({}, (err, data) => {
        console.log(data)
    })
})

export default router
