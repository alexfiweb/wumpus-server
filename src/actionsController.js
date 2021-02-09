const { Direction: Direction, Span: Span, GameResult: GameResult } = require('./constants/defines.js')
const gameController = require('./gameController');

module.exports.moveHunter = async (req, res) => {
  let game = req.body;

  switch (game.hunter.orientation) {
    case Direction.right:
      if (!isWall(Direction.right, game)) {
        game.hunter.positionY = game.hunter.positionY + 1;
        checkPerception(game);
      }
      break;
    case Direction.bottom:
      if (!isWall(Direction.bottom, game)) {
        game.hunter.positionX = game.hunter.positionX + 1;
        checkPerception(game);
      }
      break;
    case Direction.left:
      if (!isWall(Direction.left, game)) {
        game.hunter.positionY = game.hunter.positionY - 1;
        checkPerception(game);
      }
      break;
    case Direction.top:
      if (!isWall(Direction.top, game)) {
        game.hunter.positionX = game.hunter.positionX - 1;
        checkPerception(game);
      }
      break;
  }
  /* I left then and catch empty because I don't find it relevant for the user to play, but at the same time
    I want to let you know that I know how to handle the promise error
  */
  gameController.persistGameResult(game).then(() => {
  }).catch((err)=> {
    console.warn('Error');
  }).finally((data) => {
    res.status(200).send({ hunter: game.hunter, message: game.message, victory: game.victory, loss: game.loss });
  })
}

module.exports.turnAround = async (req, res) => {
  let hunter = req.body.hunter;
  let direction = req.body.direction;

  switch (hunter.orientation) {
    case Direction.right:
      hunter.orientation = direction == Direction.right ? Direction.bottom : Direction.top;
      break;
    case Direction.bottom:
      hunter.orientation = direction == Direction.right ? Direction.left : Direction.right;
      break;
    case Direction.left:
      hunter.orientation = direction == Direction.right ? Direction.top : Direction.bottom;
      break;
    case Direction.top:
      hunter.orientation = direction == Direction.right ? Direction.right : Direction.left;
      break;
  }

  res.status(200).send(hunter);
}

function checkPerception(game) {
  let y = game.hunter.positionY;
  let x = game.hunter.positionX;
  game.message = '';
  if (game.rooms[x][y].pit) {
    game.message = Span.pit;
    game.loss = true;
    game.result = GameResult.pit;
  } else if (game.rooms[x][y].wumpus) {
    game.message = Span.wumpus;
    game.loss = true;
    game.result = GameResult.wumpus;
  } else if (game.rooms[x][y].gold) {
    game.message = Span.gold;
    game.hunter.hasGold = true;
  } else if (game.rooms[x][y].exit && game.hunter.hasGold) {
    game.message = Span.victory;
    game.victory = true;
    game.result = GameResult.victory;
  } else {
    if (game.rooms[x][y].breeze) {
      game.message = Span.breezePerception;
    }
    if (game.rooms[x][y].smell) {
      game.message += Span.smellPerception;
    }
    if (game.rooms[x][y].shine) {
      game.message += Span.shinePerception;
    }
  }
}

function isWall(direction, game) {
  const leftWall = 0;
  const topWall = 0;
  const rightWall = game.rooms[0].length - 1;
  const bottomWall = game.rooms.length - 1;
  if ((direction === Direction.right && game.hunter.positionY === rightWall)
    || (direction === Direction.bottom && game.hunter.positionX === bottomWall)
    || (direction === Direction.left && game.hunter.positionY === leftWall)
    || (direction === Direction.top && game.hunter.positionX === topWall)) {
    game.message = Span.wall;

    return true;
  }
}

module.exports.checkPerception = checkPerception;