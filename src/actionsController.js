const Game = require('./model/gameModel.js')
const Hunter = require('./model/hunterModel.js')

module.exports.moveHunter = async (req, res) => {
  let game = new Game();
  game = req.body;

  switch (game.hunter.orientation) {
    case 'right':
      if (game.hunter.positionY === game.rooms[0].length - 1) {
        game.message = `<span class='wall-text'>Hay un muro</span><br>`;
      } else {
        game.hunter.positionY = game.hunter.positionY + 1;
        checkPerception(game);
      }
      break;
    case 'bottom':
      if (game.hunter.positionX === game.rooms.length - 1) {
        game.message = `<span class='wall-text'>Hay un muro</span><br>`;
      } else {
        game.hunter.positionX = game.hunter.positionX + 1;
        checkPerception(game);
      }
      break;
    case 'left':
      if (game.hunter.positionY === 0) {
        game.message = `<span class='wall-text'>Hay un muro</span><br>`;
      } else {
        game.hunter.positionY = game.hunter.positionY - 1;
        checkPerception(game);
      }
      break;
    case 'top':
      if (game.hunter.positionX === 0) {
        game.message = `<span class='wall-text'>Hay un muro</span><br>`;
      } else {
        game.hunter.positionX = game.hunter.positionX - 1;
        checkPerception(game);
      }
      break;
  }

  res.status(200).send({ hunter: game.hunter, message: game.message, victory: game.victory, loss: game.loss });
}

module.exports.turnAround = async (req, res) => {
  let hunter = new Hunter();
  hunter = req.body.hunter;
  let direction = req.body.direction;

  switch (hunter.orientation) {
    case 'right':
      if (direction == 'right') {
        hunter.orientation = 'bottom';
      } else if (direction == 'left') {
        hunter.orientation = 'top';
      }
      break;
    case 'bottom':
      if (direction == 'right') {
        hunter.orientation = 'left';
      } else if (direction == 'left') {
        hunter.orientation = 'right';
      }
      break;
    case 'left':
      if (direction == 'right') {
        hunter.orientation = 'top';
      } else if (direction == 'left') {
        hunter.orientation = 'bottom';
      }
      break;
    case 'top':
      if (direction == 'right') {
        hunter.orientation = 'right';
      } else if (direction == 'left') {
        hunter.orientation = 'left';
      }
      break;
  }

  res.status(200).send(hunter);
}

function checkPerception(game) {
  let y = game.hunter.positionY;
  let x = game.hunter.positionX;
  game.message = '';
  if (game.rooms[x][y].pit) {
    game.message = `<span class='death-text'><b>Has caido en un pozo y has muerto</b></span><br>`;
    game.loss = true;
  } else if (game.rooms[x][y].wumpus) {
    game.message = `<span class='death-text'><b>Has sido comido por wumpus y has muerto</b></span><br>`
    game.loss = true;
  } else if (game.rooms[x][y].gold) {
    game.message = `<span class='victory-text'><b>Has conseguido el oro, vuelve a la casilla de salida</b></span><br>`
    game.hunter.hasGold = true;
  } else if (game.rooms[x][y].exit && game.hunter.hasGold) {
    game.message = `<span class='victory-text'><b>¡Enhorabuena, has ganado!</b></span><br>`
    game.victory = true;
  } else {
    if (game.rooms[x][y].breeze) {
      game.message = `<span class='perception-text'>Se percibe una brisa</span><br>`
    }
    if (game.rooms[x][y].smell) {
      game.message = `${game.message}<span class='perception-text'>Se percibe un hedor</span><br>`
    }
    if (game.rooms[x][y].shine) {
      game.message = `${game.message}<span class='perception-text'>Se percibe un brillo</span><br>`
    }
  }
}

module.exports.checkPerception = checkPerception;
