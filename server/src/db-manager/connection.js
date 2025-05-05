const mongoose = require('mongoose')

const connectToDb = async () => {
    try {
        const connection = await mongoose.connect(process.env.DB_URI)
        if(!connection) {
            console.error(`FATAL :: Unable to connect to Database`)
            process.exit(1);
        }
        console.log(`connected to database successfully :: ${connection}`)
    } catch (error) {
        console.error(`FATAL :: Unable to connect to Database`)
        process.exit(1);
    }
}

module.exports = connectToDb;