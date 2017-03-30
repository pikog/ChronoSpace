function Speeder() {
  this.speeder;
  this.hitboxRadius = 50 / 2;
  this.factorSpeed = 1.5;
}

Speeder.prototype.init = function (speed) {
  this.speeder = $('<div class="speeder"></div>').appendTo(game.speedersContainer);
  game.speeders.push(this);
  var pos = (Math.floor(Math.random() * 9)) * 50;
  for(var i = 0; i < game.obstacles.length; i++) {
    while(pos >= game.obstacles[i].getY() && pos <= game.obstacles[i].getY() + 50) {
      var pos = (Math.floor(Math.random() * 9)) * 50;
    }
  }
  this.speeder.css("bottom", pos);
  this.setSpeed(speed);
};

Speeder.prototype.remove = function () {
  game.speeders.remove(this);
  this.speeder.remove();
};

Speeder.prototype.setSpeed = function (speed) {
  this.speeder.css("transition", "left " + speed * this.factorSpeed * (this.getX() + 50) + "ms linear");
  this.speeder.css("left", -50 - Math.abs(this.getX() * 0.000001));
};

Speeder.prototype.getX = function () {
  return parseInt(this.speeder.css("left"));
}

Speeder.prototype.getY = function () {
  return parseInt(this.speeder.css("bottom"));
}

Speeder.prototype.checkSpeed = function () {
  this.setSpeed(game.speed);
}

Speeder.prototype.getHitbox = function () {
  var hitbox = {
    radius: this.hitboxRadius
  };
  hitbox.x = this.getX() + this.hitboxRadius;
  hitbox.y = this.getY() + this.hitboxRadius;
  return hitbox;
}
