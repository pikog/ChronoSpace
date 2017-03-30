function Boss() {
  this.boss = $(".boss");
  this.chronoMove;
  this.chronoShoot;
  this.dateWhenMove;
  this.timeEndMove;
  this.hitboxRadius = 130 / 2;
  this.life = 1; //5
  this.lifeElem = $(".boss .life");
  this.side = 0;
}

Boss.prototype.init = function () {
  this.boss.css("transition", "bottom 0s linear, left 1s linear");
  this.boss.css("left", 750);
  this.setLife(this.life);
};

Boss.prototype.setLife = function (life) {
  this.lifeElem.css("width", 10 * life);
};

Boss.prototype.removeLife = function (life) {
  this.life--;
  this.setLife(this.life);
  if (this.life == 0) {
    game.win();
  }
};

Boss.prototype.move = function () {
  if (this.chronoMove == null || this.chronoMove.result() >= this.timeEndMove) {
    if (this.chronoMove == null) {
      this.chronoMove = new Chrono();
    }
    var posY = Math.floor(Math.random() * 351);
    var timeToMove = 5 * Math.abs(parseInt(this.boss.css("bottom")) - posY);
    this.boss.css("transition-duration", timeToMove + "ms");
    this.boss.css("bottom", posY);
    this.timeEndMove = timeToMove + 2000;
    this.chronoMove.reset();
  }
};

Boss.prototype.shoot = function () {
  if (this.chronoShoot == null || this.chronoShoot.result() >= 1200) {
    if (this.chronoShoot == null) {
      this.chronoShoot = new Chrono();
    }
    var bullet = new Bullet();
    bullet.init(this, parseInt(this.boss.css("left")), parseInt(this.boss.css("bottom")) + 75);
    bullet.move();
    this.chronoShoot.reset();
  }
};

Boss.prototype.setSkin = function (val) {
  this.boss.css("background-image", "url(img/boss" + val + ".png)");
  this.side = val;
}

Boss.prototype.getHitbox = function () {
  var hitbox = {
    radius: this.hitboxRadius
  };
  hitbox.x = parseInt(this.boss.css("left")) + 10 + this.hitboxRadius;
  hitbox.y = parseInt(this.boss.css("bottom")) + 10 + this.hitboxRadius;
  return hitbox;
}

Boss.prototype.reset = function () {
  this.chronoMove = null;
  this.chronoShoot = null;
  this.dateWhenMove = null;
  this.timeEndMove = null;
  this.boss.css("transition", "none");
  this.boss.css("bottom", 175);
  this.boss.css("left", 960);
  this.life = 5;
  this.setLife(5);
  this.setSkin(0);
}
