const mongoose = require('mongoose')

const DB_CONNECT = async () => {
    try {

        await mongoose.connect(process.env.MONGO_URL)
        console.log("mongoodb Connected successfully")
    } catch (error) {
        console.error("Error connecting to database : ", error)
    }
}

module.exports = DB_CONNECT