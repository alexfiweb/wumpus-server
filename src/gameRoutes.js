const gameController = require('./gameController');
const actionsController = require('./actionsController');
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.route('/')
  .get(gameController.generateRooms);

app.route('/make-movement')
  .post(actionsController.moveHunter);

app.route('/turn-around')
  .post(actionsController.turnAround);

module.exports = app;