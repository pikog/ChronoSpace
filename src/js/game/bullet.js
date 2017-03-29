function Bullet() {
  this.id;
  this.bullet;
  this.hitboxRadius = 10 / 2;
  this.shooter;
  this.speed = 5;
}

Bullet.prototype.init = function (entity) {
  this.bullet = game.bulletsContainer.append('<div class="bullet"><div class="hitbox"></div></div>');
  game.bullets.push(this);
  this.shooter = entity;
  console.log(game.bullets);
};

Bullet.prototype.remove = function () {
  game.bullets.remove(this);
  this.bullet.remove();
};

Obstacle.prototype.move = function () {
  if(typeof entity === 'Player') {
    this.obstacle.css("transition-duration", this.speed * (960 - this.getX()) + "s");
    this.obstacle.css("right", 960);
  }
  else {
    this.obstacle.css("transition-duration", this.speed * (this.getX() + 10) + "s");
    this.obstacle.css("left", -10);
  }
};

Bullet.prototype.getX = function () {
  return parseInt(this.obstacle.css("left"));
}

Bullet.prototype.getY = function () {
  return parseInt(this.obstacle.css("bottom"));
}

Bullet.prototype.getHitbox = function () {
  var hitbox = {radius: this.hitboxRadius};
  hitbox.x = this.getX() + 10 + this.hitboxRadius;
  hitbox.y = this.getY() + 10 + this.hitboxRadius;  
  return hitbox;
}