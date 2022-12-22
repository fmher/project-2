## Project Idea

I was thinking of creating a pokemon fan blog. You can favorite up to 6 pokemon on your profile and explain why you choose them. It can be why you like them or that you choose them because that team set up is broken. You can talk to people, write random status updates, view other peoples statuses, respond to statuses. Talk to other people who like pokemon as well. It will be like a little community. 

## API link

https://pokeapi.co/ 
This link allows to recieve a good amount of data on pokemon.

## User approach

People who like pokemon casusally or competitively would come join this blog to talk to others who feel the same way. This app would target people who only wants to talk about pokemon. Weather it is an update about pokemon, pokemon strategies, or about the anime.

## ERD

![erd](https://user-images.githubusercontent.com/115588595/209241947-6bb121e6-b49b-4d79-81b5-d2ac4da087d1.png)


## Restful charting

| VERB        | URL      | CRUD     |  RESPONSE  | 
|:-----------:|:--------:|:--------:|:----------:|
| get         | /        | read     | homepage   |
| get         | /users   | read     | user hompage |
| post        | /users/new | create | new user hompage |
| post        | /users/commits | create | writes a post on homepage |
| get         | /users/commits/edit | read | edits comments/post |
| get         | /users/:id | read   | shows current/edited comments |
| get         | /users/pokemon | read | show all pokemon |
| post        | /users/pokemon/commits | create | comment on the selected pokemon |
| put         | /users/:id && /users/pokemon/:id | update | update all comments on user page and pokemon page |
| destroy     | /users/:id && /users/pokemon/:id | destroy | delete selected comment on user or pokemon page | 

## WireFrames

## MVP

- Login, sign up, and sign out works correctly
- Be able to comments
- Be able to edit comments
- make css/styling look decent
- make sure app works
- Be able to add pokemons from all the way up to pokemon ultra sun and moon
- create page where you can view all pokemon in order
- Be able to favorite & unfavorite pokemon
- Add up to 6 pokemon to your personal/home page

## stretch goals

- Be able to unlike a comment
- Be able to play songs from pokemon
- Add pokemon items to blog such as berries or equipment
- add multiple pages for certain threads such as chatting page, pokemon page, compeitive page

