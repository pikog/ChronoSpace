function Game() {
  this.speed = 0;
  this.background = new Background();
  this.controller = new Controller();
  this.player = new Player();
}

Game.prototype.init = function () {
  this.controller.init();
  this.ticks();
};

Game.prototype.ticks = function (speed) {
  var actual = this;
  setInterval(function () {
      actual.background.scroll(game.speed);
      actual.controller.checkChrono();
      actual.player.checkGameBorder();
      actual.player.autoDown();
    },
    10);
};