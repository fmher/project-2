// required packages
require('dotenv').config()
const express = require('express')
// middelware like urluncoded
const cookieParser = require('cookie-parser')
const db = require('./models')
const crypto = require('crypto-js')

//for api
const axios = require('axios')
const userpokemons = require('./models/userpokemons')

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
app.use(async (req, res, next) => {
    try {
        if (req.cookies.userId) {
            // decrypt the user id and turn it into a string
            const decryptedId = crypto.AES.decrypt(req.cookies.userId, process.env.SECRET)
            const decryptedString = decryptedId.toString(crypto.enc.Utf8)
            // the user is logged in, lets find them in the db
            const user = await db.user.findByPk(decryptedString)
            // mount the logged in user on the res.locals
            res.locals.user = user
        } else {
            // set the logged in user to be null for conditional rendering
            res.locals.user = null
        }

        // move on the the next middleware/route
        next()
    } catch (err) {
        console.log('error in auth middleware: 🔥🔥🔥🔥', err)
        // explicity set user to null if there is an error
        res.locals.user = null
        next() // go to the next thing
    }
})

// example custom middleware (incoming request logger)
app.use((req, res, next) => {
    // our code goes here
    // console.log('hello from inside of the middleware!')
    console.log(`incoming request: ${req.method} - ${req.url}`)
    // res.locals are a place that we can put data to share with 'downstream routes'
    // res.locals.myData = 'hello I am data'
    // invoke next to tell express to go to the next route or middle
    next()
})

// routes and controllers
app.get('/', (req, res) => {
    // res.send('<h1>just getting started!</h1>')
    // res.send('lets get started')
    // console.log('🔥🔥🔥🔥this is me', res.locals.user)

    let pokemonUrl = "https://pokeapi.co/api/v2/pokemon/?offset=0&limit=890"

    axios.get(pokemonUrl).then(respond => {

        let pokemon = respond.data.results

        res.render(('home.ejs'), {
            user: res.locals.user,
            pokemon: pokemon
            
        })

    })

})





app.use('/users', require('./controllers/users'))

// listen on a port
app.listen(PORT, () => {
    console.log(`authenticating users on PORT ${PORT} 🔏`)
})