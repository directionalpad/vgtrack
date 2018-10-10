// General API
const Express = require('express');
const BodyParser = require('body-parser');
const igdb = require('igdb-api-node').default('9107dac21639705bdb1e06abbf9cda3e');

// Database
const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('./config/config.js')[env];
const GameModel = require('./models/game');
const sequelize = new Sequelize(config.database, config.username, config.password, config);
const Game = GameModel(sequelize, Sequelize);

const app = Express();
app.use(BodyParser.json());
app.use(function(request, response, next) {
  response.header("Access-Control-Allow-Methods", "POST, GET, DELETE, OPTIONS");
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/search', (request, response) => {
  console.log("Received Search Request.")
  var errors = [];

  if(request.query.title) {
    igdb.games({
      search: request.query.title,
      limit: 30,
      fields: [ 
        'name', 
        'alternative_names',
        'first_release_date',
        'cover',
        'summary',
        'publishers',
        'platforms'
      ],
      expand: [ 
        'publishers', 
        'platforms' 
      ]
    })
    .then((results) => { 
      if(results.body && Array.isArray(results.body)) {
        if(results.body.length == 0) {
          response.status(404).send({errors: ['No results found'] });
        } else {
          games = [];

          results.body.forEach(result => {
            game = {
              id: result.id,
              title: result.name,
              release_date: (result.first_release_date) ? result.first_release_date : 0,
              description: (result.summary) ? result.summary : 'No game summary available.',
              platform: [],
              publishers: [],
              box_art_url: "./images/missing-art.jpg"
            }
            
            // Fill in box art if available
            if(result.cover && result.cover.url) {
              game.box_art_url = "http:" + result.cover.url;
            }

            // Fill in platforms 
            if(result.platforms && Array.isArray(result.platforms) && result.platforms.length > 0) {
              result.platforms.forEach(platform => {
                game.platform.push(platform.name);
              });
            } else {
              game.platform.push('Unknown');
            }

            // Fill in publishers
            if(result.publishers && Array.isArray(result.publishers) && result.publishers.length > 0) {
              result.publishers.forEach(publisher => {
                game.publishers.push(publisher.name);
              });
            } else {
              game.publishers.push('Unknown');
            }

            games.push(game);
          });

          return response.status(200).send({
            games: games
          });
        }
      } else {
        errors.push('Got unexpected response back from igdb.');
      }
    });
  } else {
    errors.push('Title is a required query parameter when searching.')
  }

  if(errors.length > 0) {
    return response.status(400).send({
      errors: errors
    });
  }
});

app.delete('/games/:id', (request, response) => {
  Game.destroy({
    where:{
      id: request.params.id
    }
  }).then((result) => {
    return response.status(204).send();
  });
});

app.get('/games', (request, response) => {
  Game.findAll()
  .then((games) => {
    return response.status(200)
    .send({games: games}); 
  });
});

app.post('/games', (request, response) => {
  var errors = [];

  if(!request.body.title) {
    errors.push("Title is required.");
  }
  if(!request.body.platform) {
    errors.push("Console is required.");
  }
  if(!request.body.status) {
    errors.push("Status is required.");
  }
 
  if(errors.length == 0) {
    game = {
      title: request.body.title,
      description: request.body.description,
      release_date: request.body.release_date,
      platform: request.body.platform,
      status: request.body.status,
      publishers: request.body.publishers,
      box_art_url: request.body.box_art_url
    }
   
    Game.create(game)
      .then(game => {     
        return response.status(201).send({
        game: game
      });
    });
  }
  else
  {
    return response.status(400).send({
      errors: errors
    });
  }
});

const PORT = 5000;

app.listen(5000, () => {
  console.log(`Server running on port ${PORT}`);
})