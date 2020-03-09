import mongoose from 'mongoose'

export default new mongoose.Schema({
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
