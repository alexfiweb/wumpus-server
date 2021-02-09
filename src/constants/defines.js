const Direction = {
  right: 'right',
  left: 'left',
  top: 'top',
  bottom: 'bottom'
}

const Perception = {
  smell: 'smell',
  breeze: 'breeze',
  shine: 'shine'
}

const GameResult = {
  victory: 'victory',
  wumpus: 'deathByWumpus',
  pit: 'deathByPit'
}

const Span = {
  wall: '<span class="wall-text">Hay un muro</span><br>',
  pit: '<span class="death-text"><b>Has caido en un pozo y has muerto</b></span><br>',
  wumpus: '<span class="death-text"><b>Has sido comido por wumpus y has muerto</b></span><br>',
  gold: '<span class="victory-text"><b>Has conseguido el oro, vuelve a la casilla de salida</b></span><br>',
  victory: '<span class="victory-text"><b>¡Enhorabuena, has ganado!</b></span><br>',
  shinePerception: '<span class="perception-text">Se percibe un brillo</span><br>',
  smellPerception: '<span class="perception-text">Se percibe un hedor</span><br>',
  breezePerception: '<span class="perception-text">Se percibe una brisa</span><br>'
}

module.exports = {
  Direction: Direction,
  Span: Span,
  Perception: Perception,
  GameResult: GameResult
}