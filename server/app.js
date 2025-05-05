const express = require('express')
const app = express();
const cors = require('cors')


const dotenv = require('dotenv')

dotenv.config()


const connectToDb = require('./src/db-manager/connection.js');
const corsConfig = require('./src/config/cors-config.js');
const authRouter = require('./src/routes/authRoutes.js')
const bookmarkRouter = require('./src/routes/bookMarkRoutes.js')

app.use(express.json())
app.use(cors(corsConfig))

const PORT = process.env.PORT || 8080


connectToDb()

app.use('/api/auth', authRouter)
app.use('/api/bookmarks', bookmarkRouter)

app.listen(PORT, ()=>{
    console.log(`LOG :: Server started listening at PORT ${PORT}`)
})