import express from 'express'
import pool from '../db/pool.js'

const router = express.Router()

router.get('/vocablist', (req, res) => {
    const { level, part } = req.query

    pool.query(`SELECT * FROM level${level} WHERE part='${part}'`, (error, results) => {
        if (error)
            throw error

        res.status(200).json(results.rows)
    })
})

export default router
