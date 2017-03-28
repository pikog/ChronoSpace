function Obstacle() {
  this.id;
  this.obstacle;
  this.hitboxRadius = 130 / 2;
}

Obstacle.prototype.init = function () {
  this.id = game.giveObstacleId();
  game.currentObstaclesId.push(this.id);
  game.obstaclesContainer.append('<div class="obstacle" id="obstacle-' + this.id + '"><div class="hitbox"></div><div>');
  this.obstacle = $('#obstacle-' + this.id);
  game.obstacles.push(this);
  this.obstacle.css("bottom", (Math.floor(Math.random() * 3)) * 165);
};

Obstacle.prototype.remove = function () {
  game.currentObstaclesId.remove(this.id);
  game.obstacles.remove(this);
  this.obstacle.remove();
};

Obstacle.prototype.setSpeed = function (speed) {
  if(speed == 0) {
    this.obstacle.css("left", this.getX());
  }
  else {
    this.obstacle.css("transition-duration", speed * (this.getX() + 150) + "s");
    this.obstacle.css("left", - 150 - Math.abs(this.getX()*0.000001));
  }
};

Obstacle.prototype.getX = function () {
  return parseInt(this.obstacle.css("left"));
}

Obstacle.prototype.getY = function () {
  return parseInt(this.obstacle.css("bottom"));
}

Obstacle.prototype.checkSpeed = function () {
  this.setSpeed(calcObstacleSpeed(game.speed));
}

Obstacle.prototype.getHitbox = function () {
  var hitbox = {radius: this.hitboxRadius};
  hitbox.x = this.getX() + 10 + this.hitboxRadius;
  hitbox.y = this.getY() + 10 + this.hitboxRadius;  
  return hitbox;
}