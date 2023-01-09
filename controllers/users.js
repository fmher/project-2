// create an instance of express routers
const express = require('express')
const db = require('../models')
const router = express.Router()
const crypto = require('crypto-js')
const bcrypt = require('bcrypt')
const axios = require('axios')
const pokemon = require('../models/pokemon')
const { escapeXML } = require('ejs')

// mount our routes on the router

// GET /users/new -- serves a form to create a new user
router.get('/new', (req, res) => {
    res.render('users/new.ejs', {
        user: res.locals.user
    })
})

// POST /users -- creates a new user from the form @ /users/new
router.post('/', async (req, res) => {
    try {
        // based on the info in the req.body, find or create user
        const [newUser, created] = await db.user.findOrCreate({
            where: {
                
                email: req.body.email,
                username: req.body.username

            }
        }) 
        // if the user is found, redirect user to login
        if (!created) {
            console.log('user exists!')
            res.redirect('/users/login?message=Please log in to continue.')
        } else {

            // here we know its a new user
            // hash the supplied password
            const hashedPassword = bcrypt.hashSync(req.body.password, 12)

            // saves username
            newUser.username = req.body.username

            // save the user with the new password
            newUser.password = hashedPassword
            await newUser.save() // actually save the new password in th db
            // ecrypt the new user's id and convert it to a string
            const encryptedId = crypto.AES.encrypt(String(newUser.id), process.env.SECRET)
            const encryptedIdString = encryptedId.toString()
            // place the encrypted id in a cookie
            res.cookie('userId', encryptedIdString)
            // redirect to user's profile
            res.redirect('/users/profile')
        }

    } catch (err) {
        console.log(err)
        res.status(500).send('server error')
    }
})


// GET /users/login -- render a login form that POSTs to /users/login
router.get('/login', (req, res) => {
    res.render('users/login.ejs', {
        message: req.query.message ? req.query.message : null,
        user: res.locals.user
    })
})


// POST /users/login -- ingest data from form rendered @ GET /users/login
router.post('/login', async (req, res) => {
    try {
        // look up the user based on their email
        const user = await db.user.findOne({
            where: {
                email: req.body.email
            }
        })
        // boilerplate message if login fails
        const badCredentialMessage = 'username or password incorrect'
        if (!user) {
            // if the user isn't found in the db 
            res.redirect('/users/login?message=' + badCredentialMessage)
        } else if (!bcrypt.compareSync(req.body.password, user.password)) {
            // if the user's supplied password is incorrect
            res.redirect('/users/login?message=' + badCredentialMessage)
        } else {
            // if the user is found and their password matches log them in
            console.log('loggin user in!')
            // ecrypt the new user's id and convert it to a string
            const encryptedId = crypto.AES.encrypt(String(user.id), process.env.SECRET)
            const encryptedIdString = encryptedId.toString()
            // place the encrypted id in a cookie
            res.cookie('userId', encryptedIdString)
            res.redirect('/users/profile')
        }
    } catch (err) {
        console.log(err)
        res.status(500).send('server error')
    }
})


// GET /users/logout -- clear any cookies and redirect to the homepage
router.get('/logout', (req, res) => {
    // log the user out by removing the cookie
    // make a get req to /
    res.clearCookie('userId')
    res.redirect('/')
})


// GET /users/profile -- show the user their profile page
router.get('/profile', async (req, res) => {
    
    // if the user is not logged in -- they are not allowed to be here
    if (!res.locals.user) {
        res.redirect('/users/login?message=You must authenticate before you are authorized to view this resource!')
    } else {
        try {

            const currentUser = await db.user.findByPk(res.locals.user.id)
            const currentFav = await currentUser.getPokemons()
            const allUsers = await db.user.findAll()
            // const allPkmn = allUsers.getPokemons()
            const userComments = await db.comment.findAll()
            
            res.render('users/profile.ejs', {
                user: currentUser,
                favPokemons: currentFav,
                userId: res.locals.user.id,
                allUsers: allUsers,
                userComments: userComments
            })
            
            // finds all users
            // console.log('🔥🔥🔥🔥', allUsers)
            // res.send(currentFav)
            // console.log('🔥🔥🔥🔥 currentFav -', currentFav)

         } catch (error) {
            console.error(error)
        }

    }
})


// receive data from fav button being clicked
router.post('/profile', async (req, res) => {
    
    try {

        if(res.locals.user) {

            const currentUser = await db.user.findByPk(res.locals.user.id)
            
            // know that this part works!
            const [newfav, created] = await db.pokemon.findOrCreate({
                where: {
                    pokemonName: req.body.name
                    
                }
            })

            await currentUser.addPokemon(newfav)

            res.redirect('/users/profile')

        } else {
            res.redirect('/')
        }
    } catch (error) {
        console.error(error)
    }
})


router.post('/profile/:idx', async (req, res) => {
    try {

        if(res.locals.user) {

            const worldChat = await db.comment.create({

                userId: res.locals.user.id,
                content: req.body.comment,
                pokemonId: null

            })

            res.redirect('/users/profile')

        } else {
            res.redirect('/users/login?message=You must authenticate before you are authorized to view this resource!')
        }

    } catch (error) {
        console.error(error)
    }
})

// delete favs
router.delete('/profile', async (req, res) => {
    try {
        
        const pokemonName = req.body.content
        const apiUrl = `http://pokeapi.co/api/v2/pokemon/${pokemonName}/`
        const pokemonsData = await axios.get(apiUrl)
        
                // console.log('----------',pokemonsData.data.id)
// userPokemons = db, spell error
        const deleteFav = await db.userPokemons.destroy({
            where: {
                userId: res.locals.user.id,
                pokemonId: pokemonsData.data.id
            }
        })
        res.redirect('/users/profile')

    } catch (error) {
        console.error(error)
    }
})




//allow pokemonList.ejs to have acces to API 
router.get('/pokemonList', async (req, res) => {
    if (!res.locals.user) {
        res.redirect('/users/login?message=You must authenticate before you are authorized to view this resource!')
    } else {
        
        try {

            let pokemonUrl = "https://pokeapi.co/api/v2/pokemon/?offset=0&limit=890"
    
            const pokemonComments = await db.comment.findAll()
    
            axios.get(pokemonUrl).then(respond => {

                let pkmn = respond.data.results
                res.render('users/pokemonList.ejs', {
                    pokemon: pkmn,
                    user: res.locals.user,
                    pokemonComments: pokemonComments 
                })
            })
        } catch (error) {
            console.error(error)
        }


    }
})





router.get('/pokemonList/:idx', async (req, res) => {
    
    if (!res.locals.user) {
        res.redirect('/users/login?message=You must authenticate before you are authorized to view this resource!')
    } else {
        
        try {

            const pokemonName = req.params.idx
            const apiUrl = `http://pokeapi.co/api/v2/pokemon/${pokemonName}/`
            const pokemonsData = await axios.get(apiUrl)

            const pokemonComments = await db.comment.findAll({
                // orders from new to oldest
                order: [['createdAt', 'DESC']],
                include: [db.user]
            })
            console.log('--------', pokemonComments[0].user.dataValues.username)
            // const allUsers = await db.user.findAll()

            res.render('users/pokemonData.ejs', {
                pokemon: pokemonsData.data,
                pokemonComments: pokemonComments,
                // allUsers: allUsers
            })
    
        } catch (err) {
            console.error(err)
        }
    }
})


// delete comments
router.delete('/pokemonList/:idx', async (req, res) => {

    try {
        // console.log('----------', req.body)
        const pokemonName = req.params.idx
        const apiUrl = `http://pokeapi.co/api/v2/pokemon/${pokemonName}/`
        const pokemonsData = await axios.get(apiUrl)
        
        const deleteComment = await db.comment.destroy({
            where: {
                userId: res.locals.user.id,
                pokemonId: pokemonsData.data.id,
                content: req.body.content
            }
        })
        res.redirect(`/users/pokemonList/${pokemonName}`)
        
        // console.log('-------------', req.body.comment)
        
    } catch (error) {
        console.error(error)
    }
})


// edit --------
router.put('/pokemonList/:idx', async (req, res) => {

    try {
        const user = res.locals.user
        const pokemonName = req.params.idx
        const apiUrl = `http://pokeapi.co/api/v2/pokemon/${pokemonName}/`

        // const edit = await db.comment.findOne(user.dataValues.id)
        console.log('------------ ',req.body)
        const x = await db.comment.update({
            content: req.body.editContent
            
        }, {
            where: {
                
                id: Number(req.body.commentId)
            }
        }
        
        )

        res.redirect(`/users/pokemonList/${pokemonName}`)

    } catch (error) {
        console.error(error)
    }
})





router.post('/pokemonList/:idx', async (req, res) => {

    if (!res.locals.user) {
        res.redirect('/users/login?message=You must authenticate before you are authorized to view this resource!')
    } else {

        try {
            

            const pokemonName = req.params.idx
            const apiUrl = `http://pokeapi.co/api/v2/pokemon/${pokemonName}/`
            const pokemonsData = await axios.get(apiUrl)

            const allUsers = await db.user.findAll()

            const pokemonComment = await db.comment.create({
                
                userId: res.locals.user.id,
                pokemonId: pokemonsData.data.id,
                content: req.body.comment
                
            })
            res.redirect(`/users/pokemonList/${pokemonName}`)
        } catch (error) {
            console.error(error)
        }
    }
})




// export the router
module.exports = router