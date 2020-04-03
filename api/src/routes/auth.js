import express from 'express'
import pool from '../db/pool.js'

const router = express.Router()

router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        await pool.query(`CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(20) NOT NULL,
            password VARCHAR(100) NOT NULL
        )`)
    } catch (e) {
        console.error(e)
        res.json({ success: false })
    }

    try {
        await pool.query(`INSERT INTO users (username, password) VALUES ('${username}', '${password}')`)
        res.json({ success: true })
    } catch (e) {
        console.error(e)
        res.json({ success: false })
    }
})

export default router
