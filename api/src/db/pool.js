import pg from 'pg'

const pool = new pg.Pool({
    user: 'root',
    host: 'localhost',
    database: 'vocab_list',
    password: 'keyboardcat',
    port: 5432
})

export default pool
