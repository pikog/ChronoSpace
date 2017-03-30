function Obstacle() {
  this.obstacle;
  this.hitboxRadius = 130 / 2;
}

Obstacle.prototype.init = function (speed) {
  this.obstacle = $('<div class="obstacle"></div>').appendTo(game.obstaclesContainer);
  game.obstacles.push(this);
  this.obstacle.css("bottom", (Math.floor(Math.random() * 3)) * 165);
  this.obstacle.css("background-image", "url(img/obstacle" + Math.floor(Math.random() * 2) + ".png)");
  this.setSpeed(speed);
};

Obstacle.prototype.remove = function () {
  game.obstacles.remove(this);
  this.obstacle.remove();
};

Obstacle.prototype.setSpeed = function (speed) {
  this.obstacle.css("transition", "left " + (this.getX() + 150) / (speed / 2) + "ms linear");
  this.obstacle.css("left", -150 - Math.abs(this.getX() * 0.000001));
};

Obstacle.prototype.getX = function () {
  return parseInt(this.obstacle.css("left"));
}

Obstacle.prototype.getY = function () {
  return parseInt(this.obstacle.css("bottom"));
}

Obstacle.prototype.getHitbox = function () {
  var hitbox = {
    radius: this.hitboxRadius
  };
  hitbox.x = this.getX() + 10 + this.hitboxRadius;
  hitbox.y = this.getY() + 10 + this.hitboxRadius;
  return hitbox;
}
