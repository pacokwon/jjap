import express from 'express'
import pool from '../db/pool.js'

const router = express.Router()

router.get('/vocablist', (req, res) => {
    const { level } = req.query

    const query = `SELECT id, part, furigana, kanji, meaning FROM level${level}`

    pool.query(query, (error, results) => {
        if (error)
            throw error

        res.status(200).json(results.rows)
    })
})

export default router
