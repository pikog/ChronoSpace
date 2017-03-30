function Player() {
  this.player = $(".player");
  this.speed = 150;
  this.hitboxRadius = 100 / 2;
  this.chronoShoot;
}

Player.prototype.up = function () {
  this.player.css("transition", "bottom 1000ms cubic-bezier(0.165, 0.84, 0.44, 1)");
  if (this.getY() + 100 + this.speed >= 500) {
    this.player.css("bottom", 400);
  } else {
    this.player.css("bottom", this.getY() + this.speed);
  }
}

Player.prototype.down = function () {
  this.player.css("transition", "bottom 1000ms cubic-bezier(0.165, 0.84, 0.44, 1)");
  if (this.getY() - this.speed <= 0) {
    this.player.css("bottom", 0);
  } else {
    this.player.css("bottom", this.getY() - this.speed);
  }
}

Player.prototype.getX = function () {
  return parseInt(this.player.css("left"));
}

Player.prototype.getY = function () {
  return parseInt(this.player.css("bottom"));
}

Player.prototype.setX = function (val, speed) {
  this.player.css("transition", "left " + speed + "s linear");
  this.player.css("left", val);
}

Player.prototype.setY = function (val, speed) {
  this.player.css("transition", "bottom " + speed + "s linear");
  this.player.css("bottom", val);
}

Player.prototype.setSkin = function (val) {
  this.player.css("background-image", "url(img/ship" + val + ".png)");
}

Player.prototype.getHitbox = function () {
  var hitbox = {
    radius: this.hitboxRadius
  };
  hitbox.x = this.getX() + 10 + this.hitboxRadius;
  hitbox.y = this.getY() + 10 + this.hitboxRadius;
  return hitbox;
}

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

Player.prototype.reset = function () {
  this.chronoShoot = null;
  this.player.css("transition", "none");
  this.player.css("bottom", 200);
  this.player.css("left", 60);
}
