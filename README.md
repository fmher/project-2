## Link to Website

https://project-pokemon-fanbase.herokuapp.com/

## Project Idea

I was thinking of creating a pokemon fan blog. You can favorite up to 6 pokemon on your profile and explain why you choose them. It can be why you like them or that you choose them because that team set up is broken. You can talk to people, write random status updates, view other peoples statuses, respond to statuses. Talk to other people who like pokemon as well. It will be like a little community. 


## API link

https://pokeapi.co/ 
This link allows to recieve a good amount of data on pokemon.

## Installation

- fork and clone the repo
- open project and npm i in terminal to get project to work
- touch .env and type in the following code inside the .env file SECRET='hello this is a secret'
- run echo node_module .env >> .gitignore to avoid showing node modules
- create datebase and migrate database with sequelize db:create and sequelize db:migrate
- lastly, run nodemon in terminal and open browser with the url localhost:8000


## User approach

People who like pokemon casusally or competitively would come join this blog to talk to others who feel the same way. This app would target people who only wants to talk about pokemon. Weather it is an update about pokemon, pokemon strategies, or about the anime.

## ERD

![erd-v2](https://user-images.githubusercontent.com/115588595/209248112-e70152c6-e4d8-4459-89b3-78f6f3d5dfec.png)



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
| put         | /pokemon/:id | update | update all comments on user page and pokemon page |
| destroy     | /pokemon/:id | destroy | delete selected comment on user or pokemon page | 

## WireFrames

![IMG_9330](https://user-images.githubusercontent.com/115588595/209245793-904b2d8b-88bf-4054-819c-fe30cf370c55.jpg)

## User Stories

- user can talk to pokemon fans
- As a user, you can see all your favorite pokemons
- you can favorite and dislike any pokemon and however many you like
- You can talk to everyone in world chat 
- you talk and comment about certain pokemons within their directory


## MVP

- Login, sign up, and sign out works correctly
- Be able to comments
- Be able to edit comments
- make sure app works
- Be able to add pokemons from all the way up to pokemon sword and shield
- create page where you can view all pokemon in order
- Be able to favorite & unfavorite pokemon
- Add pokemon to your personal/home page

## stretch goals

- Be able to unlike a comment
- Be able to play songs from pokemon
- Add pokemon items to blog such as berries or equipment
- add multiple pages for certain threads such as chatting page, pokemon page, compeitive page
- make css/ styling look amazing
- limit liked pokemon up to 6

## Post reflection 
I was struggling quite a bit on this project. I got everything to work with a lot of help. If I didnt talk to people or google search I would of never figured how to create this project successfully. I think I should of worked on this project more on the break. That way my project would look completed. As of right now my project works but does not look great at all due to not having any styling down. After finishing this project I am more confident in my abilites because I have a better understanding of full stack development. Still, I would like to pracctice more so that I can get better at full stack development. That way, I can properly create another project and not have so may problems, getting stuck, or constantly seek for help. 

