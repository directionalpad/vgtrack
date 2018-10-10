# vgTrack
A NodeJS, Express, and Vue.js sample application leveraging Sequelize, Axios and other fun technologies for the purpose of demostrating my development capabilities to a potential employer who shall remain unnamed in this README to preserve my own anonymity.


vgTrack is a lightweb web application that allows you to search video games against IGDB and add them to your collection as "Wanted", "For Sale", or "Owned". See the Usage section for more information.

The API is written as a NodeJS application using ExpressJS, Axios, Sequelize, PostgreSQL and the IGDB NodeJS library. It functions indepedent of the Vue.js application which is located in the `www/` directory. The Vue.js application is self-contained and should be runnable as-is once the NodeJS API is functional. See the Building and Running instructions below for more information.

## Requirements
- NodeJS 8.x - [https://nodejs.org/](https://nodejs.org/)
- npm 6.4.x - [https://www.npmjs.com/](https://www.npmjs.com/)
- Express 4.x - [https://expressjs.com/](https://expressjs.com/)
- Vue.js 2.x - [https://vuejs.org](https://vuejs.org)
- PostgreSQL 9.5+ - [https://www.postgresql.org/](https://www.postgresql.org/)

## Building and Running
Pull the latest vgTrack `master` repository and navigate to the directory in which it is located. Assuming you have NodeJS and npm installed and available in your PATH you should be able to execute the following commands to retrieve the necessary dependencies:

**Dependency Installation**
```
# npm install --save express
# npm install --save body-parser
# npm install --save pg
# npm install --save sequelize
# npm install --save sequelize-cli
# npm install --save igdb-api-node
```

**Database Initialization**

The database used for this sample application is PostgreSQL. **PostgreSQL must be used** as the `Sequelize.ARRAY` data type is being used to store the publishers collection internally to the application. 

This step will not cover installing and configuring PostgreSQL, so if you are needing to configure a PostgreSQL environment a tutorial can be found at [https://www.techrepublic.com/blog/diy-it-guy/diy-a-postgresql-database-server-setup-anyone-can-handle/](https://www.techrepublic.com/blog/diy-it-guy/diy-a-postgresql-database-server-setup-anyone-can-handle/) to assist with that.

The default database configuration for the application is located in `./config/config.js` relative to your applications root directory. The default database configuration has the following values set:
```
    username: 'vgtrack',
    password: 'vgtrack',
    database: 'vgtrack',
    host: 'localhost',
    dialect: 'postgres'
```

You may change these (aside from the dialect) as necessary to meet your configuration needs. Once the database configuration has been appropriately set you will need to create the database and run migrations, to do so execute the following commands in the vgTrack project root directory:
```
# ./node_modules/.bin/sequelize db:create
# ./node_modules/.bin/sequelize db:migrate
```


**Starting the API (NodeJS Application)**

Once all the dependencies and database configuration and initialization has been performed you can start the application by running the following command in the root directory of the project:
```
# node app.js
```

This should create a server running on http://localhost:5000/ with the vgTrack API available. 

**Starting the Web Interface (Vue.js Application)**

The Vue.js application is self contained and located in `./www/` relative to the root directory of the project. There is only one html page available which is located at `./www/index.html`. Assuming the API is successfully running in the prior step above you should now be able to utilize the application. See the "Usage" section below for more information.


## Usage

Once the application has been launched you should be presented with a pretty plain looking window with two links at the top labeled "Game Collection" and "Game Search" respectively. Click on "Game Search" link at the top and you will be presented with a text box and a button that allows you to search for games. Due to time constraints (see more in the "Notes" section below) you will have to manually click the "Search" button in order to get results to come back on the page. Games work on a fuzzy-match system and pull 30 results (maximum) back from the IGDB API. You will be able to select options on the games such as Platform (console) and Status (Owned, For Sale, Wanted). After selecting a platform and status you can hit "Add Game" which will add it to your game collection. Navigating back to "Game Collection" will then show the game and its associated details along with your selected platform and status.


## Notes, "Bugs", Etc.
Due to the time contraints and availability I had on writing this application there are a number of things I could have done better and would have liked to. I have broken down a number of things I'd like to touch on as more of a retrospective  

**Error Handling**

For starters the Vue.js application has no real error handling and works entirely on happy-path user inputs. If you don't do something correctly it will just sit and stare blankly at you unless you watch the debug console on your browser of choice. The NodeJS application does have some limited error handling and pushes it to the Vue.js application, but the Vue.js application has no support for the error data coming back making it seem unresponsive. In a real-world application this would absolutely be a priority in developing something that is user facing. 


**UI/UX Shortcomings**

- Errors: As stated above error handling would be something much required in a real world application. 

- Empty States: The UI/UX has empty states that are just intentionally left blank. Due to time constraints and external real world situations I did not have an ample amount of time to implement something to handle it.

- Empty Bindings (on search result drop downs) instead of default selection: I somewhat abused how v-model works along with passing in the "Game" object on component render time when it came to search and grabbing the user selections of "platform" and "status". I wish I had more time to explore and work on Vue to perform a cleaner implementation, but this is what I ended up with. 

- Search Button: I did not get a chance to implement "Push enter to search" making clicking of the button mandatory. This irks me as someone who prefers good UX, but again time constraints prevented me from getting around to it.

- Overall responsiveness: Spinners, loading states, etc should all be something that this application has in order to really indicate to the user its "state" at any given point in time. 

**IGDB API Limitations**

As a note here the IGDB API limits "expanded" search results to 100 queries per API key on a free API key. I have provided an API key in this application intentionally to allow you guys to utilize it without having to worry about signing up for one. However in the event that the "search" functionality on this application stops behaving or only starts providing partial-data results back for games a new key may be needed in order to experience the full functionality of the application. An IGDB API key can be retrieved here: [https://www.igdb.com/api](https://www.igdb.com/api) and you can modify line 4 of `./app.js` to read as follows:
```
const igdb = require('igdb-api-node').default('<new API key>');
```

**Overall Assessment / Time Spent**

As stated in the interview I have never actually used Vue.js before. In fact, I have not used almost any of the technologies in this sample application before outside of some light NodeJS work at another company I have previously worked for. I suspect I put about ~12-16 hours in this application learning the technologies and implementing them. The primary focus of the implementation was functionality over pretty, so unfortunately the UX of the Vue application suffered the most. I do suspect there are multiple things I could have done much better (better separation of concerns, code cleanliness, etc) however the application came together better than I expected for the time spent learning these technologies and implementing them. 
