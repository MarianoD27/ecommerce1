require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const { logger } = require('./middleware/logEvents')
const errorHandler = require('./middleware/errorHandler')
const verifyJWT = require('./middleware/verifyJWT')
const cookieParser = require('cookie-parser')
const credentials = require('./middleware/credentials')
const PORT = process.env.PORT || 3500


app.use(logger)
app.use(credentials)
app.use(cors(corsOptions))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(express.static(path.join(__dirname, '/public')))
app.use(cookieParser())


app.use('/', require('./routes/root'))
app.use('/api/register', require('./routes/api/register'))
app.use('/api/auth', require('./routes/api/auth'))
app.use('/api/refresh', require('./routes/api/refresh'))
app.use('/api/logout', require('./routes/api/logout'))
app.use(verifyJWT)
app.use('/api/customers', require('./routes/api/customers'))
app.use('/api/store/products', require('./routes/api/store/products'))
app.use('/api/store/orders', require('./routes/api/store/orders'))




app.all('*', require('./routes/404'))

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})