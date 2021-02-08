const Game = require('./model/gameModel.js')
const Room = require('./model/roomModel.js')
const Hunter = require('./model/hunterModel.js')
const actionsController = require('./actionsController');

module.exports.generateRooms = async (req, res) => {
  let game = new Game();
  game.rooms = [[], [], [], []];
  game.hunter = new Hunter();

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
  res.status(200).send(game);
}

function generateWumpus(rooms) {
  let positionX;
  let positionY;
  do {
    positionX = generatePosition();
    positionY = generatePosition();
  } while (rooms[positionX][positionY].exit)

  rooms[positionX][positionY].wumpus = true;
  generatePerception(rooms, positionX, positionY, 'smell');
}

function generateGold(rooms) {
  let positionX;
  let positionY;
  do {
    positionX = generatePosition();
    positionY = generatePosition();
  } while (rooms[positionX][positionY].exit || rooms[positionX][positionY].wumpus)

  rooms[positionX][positionY].gold = true;
  generatePerception(rooms, positionX, positionY, 'shine');
}

function generatePit(rooms) {
  let positionX;
  let positionY;
  do {
    positionX = generatePosition();
    positionY = generatePosition();
  } while (rooms[positionX][positionY].exit || rooms[positionX][positionY].wumpus || rooms[positionX][positionY].gold)

  rooms[positionX][positionY].pit = true;
  generatePerception(rooms, positionX, positionY, 'breeze');
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