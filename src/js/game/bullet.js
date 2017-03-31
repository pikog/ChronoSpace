/*
* Bullet object
*/
function Bullet() {
  this.bullet;
  this.hitboxRadius = 10 / 2;
  this.shooter;
  this.speed = 0.002;
}

/*
* Create the bullet div
* Set a direction and skin depends on shooter (Boss or Player)
*/
Bullet.prototype.init = function (entity, x, y) {
  this.bullet = $('<div class="bullet"></div>').appendTo(game.bulletsContainer);
  this.shooter = entity;
  if (entity instanceof Player) {
    this.bullet.css("left", x);
    this.bullet.css("bottom", y);
    this.bullet.css("background-image", "url(img/laser0.png)");
  } else {
    this.bullet.css("left", x - 35);
    this.bullet.css("bottom", y);
    this.bullet.css("background-image", "url(img/laser1.png)");
  }
  game.bullets.push(this);
};

/*
* Remove bullet form the Game
*/
Bullet.prototype.remove = function () {
  game.bullets.remove(this);
  this.bullet.remove();
};

/*
* Move bullet with transition
* depends on shooter
*/
Bullet.prototype.move = function () {
  if (this.shooter instanceof Player) {
    this.bullet.css("transition-duration", this.speed * (960 - this.getX()) + "s");
    this.bullet.css("left", 960);
  } else {
    this.bullet.css("transition-duration", this.speed * (this.getX() + 50) + "s");
    this.bullet.css("left", -50);
  }
  game.audio.shootSound();
};

/*
* @return : X pos
*/
Bullet.prototype.getX = function () {
  return parseInt(this.bullet.css("left"));
}

/*
* @return : Y pos
*/
Bullet.prototype.getY = function () {
  return parseInt(this.bullet.css("bottom"));
}

/*
* @return : Hitbox object
*/
Bullet.prototype.getHitbox = function () {
  var hitbox = {
    radius: this.hitboxRadius
  };
  if (this.shooter instanceof Player) {
    hitbox.x = this.getX() + 40 + this.hitboxRadius;
    hitbox.y = this.getY() + this.hitboxRadius;
  } else {
    hitbox.x = this.getX() + this.hitboxRadius;
    hitbox.y = this.getY() + this.hitboxRadius;
  }
  return hitbox;
}
