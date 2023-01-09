const db = require("./models");
//-------does create comments  
db.comment.create({
    userId: 6,
    pokemonId: 1,
    content: 'did it go through??'
})
.then(comment => {
    console.log(comment.get())
})




//---- finds all user id comments

// db.user.findOne({
//     where: { 
//         // userId: 1,
//         id: 6
//     }, 
//     include: [db.comment]
// })
// .then(user => {
//     console.log(user.comments)
// })




//----------- finds all pkmn id comments

// db.pokemon.findOne({
//     where: { 
//         // userId: 1,
//         id: 2
//     }, 
//     include: [db.comment]
// })
// .then(user => {
//     console.log(user.comments)
// })