// create an instance of express routers
const express = require('express')
const db = require('../models')
const router = express.Router()

// mount our routes on the router

// GET /users/new -- server a form to create a new user
router.get('/new', (req, res) => {
    res.render('users/new.ejs', {
        user: res.locals.user
    })
})

// POST /users -- create a new user from the form @ /users/new
router.post('/', async (req, res) => {
    try {
        // based on info in the req.body, find or create user
        const [newUser, created] = await db.user.findOrCreate({
            where: {
                email: req.body.email
            },
            // TODO: dont add plaintext passwords to the db
            defaults: {
                password: req.body.password
            }
        })
        // TODO: redirect to the login page if the user is found
        // log the user in (store the user's id as as a cookie in the browser)
        res.cookie('userID', newUser.id)
        // redirect to the homepage (for now)
        res.redirect('/users/profile')

    } catch(err) {
        console.log(err)
        res.status(500).send('server error!')
    }
})

// GET /users/login -- render a login form that POSTs to /users/login
router.get('/login', (req, res) => {
    // res.send('show login form')
    res.render('users/login.ejs', {
        message: req.query.message ? req.query.message : null,
        user: res.locals.user
    })
})

// POST /users/login -- ingest data from form rendered @ GET /users/login
router.post('/login', async (req, res) => {
    // res.send('check user crendentials against db')
    try {
        // look up the user based on their email
        const user = await db.user.findOne({
            where: {
                email: req.body.email
            }
        })
        // boilerplate message if login fails
        const badCredentialMessage = 'username or password incorrectt'
        if(!user) {
            // if user isnt found in db
            res.redirect('/users/login?=message=' + badCredentialMessage)
        } else if (user.password !== req.body.password ) {
            // id users supplied password is incorrect
            res.redirect('/users/login?message=' + badCredentialMessage)
        } else {
            // if user is found and their password matched log them in
            console.log('logged user in!')
            res.cookie('userId', user.id) // userId = user.id
            res.redirect('/users/profile')
        }
        // if the user isnt found in the db
        // if users supplied password is incorrect
        // if the user is found and their password matches log them in
    } catch(err) {
        console.log(err)
        res.status(500).send('server error!')
    }
})

// GET /users/logout -- clear ant cookes and redirect to the homepage
router.get('/logout', (req, res) => {
    // res.send('log the user out by clearing the cookie')
    res.clearCookie('userId')
    res.redirect('/')
})

// GET /users/profile -- show the user their profile page
router.get('/profile', (req, res) => {
    // if user not logged in -- not allowed to be here
    if (!res.locals.user) {
        res.redirect('users/login?message=You must authenticate before you are authorized to view this resourse!')
    } else {
        res.render('users/profile.ejs', {
            user: res.locals.user
        })
    }
})

// export the router
module.exports = router