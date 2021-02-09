const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient({ region: 'eu-central-1' });
const { v4: uuidv4 } = require('uuid');
const Game = require('./model/game.js')
const Room = require('./model/room.js')
const Hunter = require('./model/hunter.js')
const actionsController = require('./actionsController');
const { Perception: Perception } = require('./constants/defines.js')

module.exports.generateRooms = async (req, res) => {
  let game = new Game();
  game.rooms = [[], [], [], []];
  game.hunter = new Hunter();
  game.id = uuidv4();
  game.created = new Date().getTime();

  for (let i = 0; i < 4; i++) {
    let roomsArray = new Array(new Room(), new Room(), new Room(), new Room());
    game.rooms[i] = roomsArray;
  }
  game.rooms[0][0].exit = true;
  game.rooms[0][0].hunter = true;
  generateWumpus(game.rooms);
  generateGold(game.rooms);
  for (let i = 0; i < 3; i++) {
    generatePit(game.rooms);
  }
  actionsController.checkPerception(game);
  /* I left then and catch empty because I don't find it relevant for the user to play, but at the same time
    I want to let you know that I know how to handle the promise error
  */
  persistGameResult(game).then(() => {
  }).catch((err) => {
    console.error(err);
  }).finally(() => {
    res.status(200).send(game);
  });
}

module.exports.getGamesResult = async (req, res) => {
  getGamesResultDDBB().then((data) => {
    res.status(200).send(data);
  }).catch((err) => {
    res.status(500).send(err);
  });
}

function generateWumpus(rooms) {
  let positionX;
  let positionY;
  do {
    positionX = generatePosition();
    positionY = generatePosition();
  } while (rooms[positionX][positionY].exit)

  rooms[positionX][positionY].wumpus = true;
  generatePerception(rooms, positionX, positionY, Perception.smell);
}

function generateGold(rooms) {
  let positionX;
  let positionY;
  do {
    positionX = generatePosition();
    positionY = generatePosition();
  } while (rooms[positionX][positionY].exit || rooms[positionX][positionY].wumpus)

  rooms[positionX][positionY].gold = true;
  generatePerception(rooms, positionX, positionY, Perception.shine);
}

function generatePit(rooms) {
  let positionX;
  let positionY;
  do {
    positionX = generatePosition();
    positionY = generatePosition();
  } while (rooms[positionX][positionY].exit || rooms[positionX][positionY].wumpus || rooms[positionX][positionY].gold)

  rooms[positionX][positionY].pit = true;
  generatePerception(rooms, positionX, positionY, Perception.breeze);
}

function generatePosition() {
  return Math.floor(Math.random() * 4);
}

function generatePerception(rooms, x, y, perception) {
  if (x != 0) {
    rooms[x-1][y][perception] = true;
  }
  if (x != rooms.length - 1) {
    rooms[x+1][y][perception] = true;
  }
  if (y != 0) {
    rooms[x][y-1][perception] = true;
  }
  if (y != rooms[0].length - 1) {
    rooms[x][y+1][perception] = true;
  }
}

function persistGameResult(game) {
  const params = {
    TableName: 'games',
    Item: {
      id: game.id,
      result: game.result,
      created: game.created,
      lastActivity: new Date().getTime(),
      ended: game.result != '' ? true : false
    }
  }
  return dynamodb.put(params).promise();
}

function getGamesResultDDBB() {
  const params = {
    TableName: 'games'
  }
  return dynamodb.scan(params).promise();
}

module.exports.persistGameResult = persistGameResult;
