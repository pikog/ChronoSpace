function Game() {
  this.speed = 0;
  this.background = new Background();
  this.controller = new Controller();
  this.player = new Player();
  this.obstaclesContainer = $(".obstacles");
  this.currentObstaclesId = [];
  this.obstacles = [];
}

Game.prototype.init = function () {
  this.controller.init();
  this.ticks();
};

Game.prototype.ticks = function () {
  var actual = this;
  setInterval(function () {
      actual.background.scroll(game.speed);
      actual.controller.checkChrono();
      actual.player.checkGameBorder();
      actual.player.autoDown();
      for (var i = 0; i < actual.obstacles.length; i++) {
        actual.obstacles[i].checkSpeed();
      }
      actual.checkCollision();
      actual.autoGenerateObstacle();
    },
    10);
};

Game.prototype.giveObstacleId = function () {
  for (var i = 0; this.currentObstaclesId.indexOf(i) != -1; i++);
  return i;
};

Game.prototype.checkCollision = function () {
  var playerHitbox = this.player.getHitbox();
  for (var i = 0; i < this.obstacles.length; i++) {
    var obstacleHitbox = this.obstacles[i].getHitbox();

    var dx = obstacleHitbox.x - playerHitbox.x;
    var dy = obstacleHitbox.y - playerHitbox.y;
    var distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < obstacleHitbox.radius + playerHitbox.radius) {
      this.obstacles[i].remove();
      new Obstacle().init();
    }
  }
}

Game.prototype.autoGenerateObstacle = function () {
  for(var i = 0; i < this.obstacles.length; i++) {
    if(this.obstacles[i].getX() == -150) {
      this.obstacles[i].remove();
      new Obstacle().init();
    }
  }
}
