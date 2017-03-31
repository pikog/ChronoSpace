/*
* Player Object
*/
function Player() {
  this.player = $(".player");
  this.speed = 150;
  this.hitboxRadius = 100 / 2;
  this.chronoShoot;
}

/*
* Move player Up
* launch when Arrow Up
* Verify border colision
*/
Player.prototype.up = function () {
  this.player.css("transition", "bottom 1000ms cubic-bezier(0.165, 0.84, 0.44, 1)");
  if (this.getY() + 100 + this.speed >= 500) {
    this.player.css("bottom", 400);
  } else {
    this.player.css("bottom", this.getY() + this.speed);
  }
}

/*
* Move player Down
* launch when Arrow Down
* Verify border collision
*/
Player.prototype.down = function () {
  this.player.css("transition", "bottom 1000ms cubic-bezier(0.165, 0.84, 0.44, 1)");
  if (this.getY() - this.speed <= 0) {
    this.player.css("bottom", 0);
  } else {
    this.player.css("bottom", this.getY() - this.speed);
  }
}

/*
* @return : X pos
*/
Player.prototype.getX = function () {
  return parseInt(this.player.css("left"));
}

/*
* @return : Y pos
*/
Player.prototype.getY = function () {
  return parseInt(this.player.css("bottom"));
}

/*
* Set X pos
* @params : value of X pos, speed of animation
* used for animation scene
*/
Player.prototype.setX = function (val, speed) {
  this.player.css("transition", "left " + speed + "s linear");
  this.player.css("left", val);
}

/*
* Set Y pos
* @params : value of Y pos, speed of animation
* used for animation scene
*/
Player.prototype.setY = function (val, speed) {
  this.player.css("transition", "bottom " + speed + "s linear");
  this.player.css("bottom", val);
}

/*
* Set skin
* @params : side
*/
Player.prototype.setSkin = function (val) {
  this.player.css("background-image", "url(img/ship" + val + ".png)");
}

/*
* @return : hitbox object
*/
Player.prototype.getHitbox = function () {
  var hitbox = {
    radius: this.hitboxRadius
  };
  hitbox.x = this.getX() + 10 + this.hitboxRadius;
  hitbox.y = this.getY() + 10 + this.hitboxRadius;
  return hitbox;
}

/*
* Shoot bullet
* Launch a Chrono to create a cadenced shots
*/
Player.prototype.shoot = function () {
  if (this.chronoShoot == null || this.chronoShoot.result() >= 700) {
    if (this.chronoShoot == null) {
      this.chronoShoot = new Chrono();
    }
    var bullet = new Bullet();
    bullet.init(this, this.getX() + 100, this.getY() + 50);
    bullet.move();
    this.chronoShoot.reset();
  }
};

/*
* Reset player
* espcially pos and chrono
*/
Player.prototype.reset = function () {
  this.chronoShoot = null;
  this.player.css("transition", "none");
  this.player.css("bottom", 200);
  this.player.css("left", 60);
}
