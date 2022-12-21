// required packages
require('dotenv').config()
const express = require('express')

// app config
const app = express()
const PORT = process.env.PORT || 8000
app.set('view engine', 'ejs')
// parse request bodies from html forms
// makes that req.body work returns content, if not here req.body returns blank
app.use(express.urlencoded({ extended: false }))

// routes and controllers
app.get('/', (req, res) => {
    // res.send('<h1>just getting started!</h1>')
    // res.send('lets get started')
    res.render('home.ejs')
})

app.use('/users', require('./controllers/users'))

// listen on a port
app.listen(PORT, () => {
    console.log(`authenticating users on PORT ${PORT} 🔏`)
})