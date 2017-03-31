/*
* Speeder object
*/
function Speeder() {
  this.speeder;
  this.hitboxRadius = 50 / 2;
}

/*
* Create the speeder div
* Set a random Y pos and random skin
* avoid collsion whith obstacle
* launch movement
*/
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

/*
* Remove speeder form the Game
*/
Speeder.prototype.remove = function () {
  game.speeders.remove(this);
  this.speeder.remove();
};

/*
* Move speeder with smooth transition
* depends on length of trip
* launch by tick game because speed can change
* @param : speed of the game
*/
Speeder.prototype.setSpeed = function (speed) {
  this.speeder.css("transition", "left " + (this.getX() + 50) / (speed / 2) + "ms linear");
  this.speeder.css("left", -50 - Math.abs(this.getX() * 0.000001));
};

/*
* @return : X pos
*/
Speeder.prototype.getX = function () {
  return parseInt(this.speeder.css("left"));
}

/*
* @return : Y pos
*/
Speeder.prototype.getY = function () {
  return parseInt(this.speeder.css("bottom"));
}

/*
* @return : Hitbox object
*/
Speeder.prototype.getHitbox = function () {
  var hitbox = {
    radius: this.hitboxRadius
  };
  hitbox.x = this.getX() + this.hitboxRadius;
  hitbox.y = this.getY() + this.hitboxRadius;
  return hitbox;
}
