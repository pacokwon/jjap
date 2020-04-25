import pg from 'pg'

const pool = new pg.Pool({
    user: 'root',
    host: 'postgres',
    database: 'vocab_list',
    password: 'keyboardcat',
    port: 5432
})

export default pool
