// required packages
require('dotenv').config()
const express = require('express')
// middelware like urluncoded
const cookieParser = require('cookie-parser')
const db = require('./models')

// app config
const app = express()
const PORT = process.env.PORT || 8000
app.set('view engine', 'ejs')
// parse request bodies from html forms
// makes that req.body work returns content, if not here req.body returns blank
app.use(express.urlencoded({ extended: false }))    // returns a function
// tell express to parse incoming cookies 
app.use(cookieParser()) // returns a function 

// custom auth middleware that checks the cookies for a user id
// if found, look up the user in db
//tell all downstream routes about this user
app.use( async (req, res, next) => {
    try {
        if (req.cookies.userId) {
            // user is logged in, lets find them in the db
            const user = await db.user.findByPk(req.cookies.userId)
            //mount the logged in user on the res.locals
            res.locals.user = user // have to do it on top, allows everthing after to have access to user
        } else {
            // set the logged in user to be null for conditional rendering
            res.locals.user = null
        }

        // move on the next middleware
        next()

    } catch (err) {
        console.log('error in auth middleware: 🔥🔥🔥', err)
        next() // goes to the next things, continues running from my understanding

    }
})

// example custom middleware (incoming request logger)
app.use((req, res, next) => {
    // our code goes here
    // console.log('hello from the inside of the middleware!')
    console.log(`incoming request: ${req.method} - ${req.url}`)
    // res.locals are a place that we can put data to share with 'downstream routes'
    // res.locals.myData = 'hello I am data'
    //invoke next to express to go to the next route or middle
    next()
})

// routes and controllers
app.get('/', (req, res) => {
    // res.send('<h1>just getting started!</h1>')
    // res.send('lets get started')
    console.log(res.locals.user)
    res.render('home.ejs', {
        user: res.locals.user
    })
})

app.use('/users', require('./controllers/users'))

// listen on a port
app.listen(PORT, () => {
    console.log(`authenticating users on PORT ${PORT} 🔏`)
})