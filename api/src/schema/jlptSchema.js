import mongoose from 'mongoose'

const Schema = new mongoose.Schema({
    furigana: {
        type: String,
        required: true
    },
    kanji: String,
    meaning: {
        type: String,
        required: true
    }
})

export default Schema
