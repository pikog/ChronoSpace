function Player() {
  this.player = $(".player");
  this.rise;
  this.speedUp = 100;
  this.timeUp = 0.2;
  this.factorTimeDown = 0.002;
  this.hitboxRadius = 70 / 2;
}

Player.prototype.up = function () {
  if (this.getY() + this.speedUp >= 500) {
    this.player.css("transition", "bottom " + this.timeUp + "s cubic-bezier(0.25, 0.46, 0.45, 0.94)");
    this.player.css("bottom", 400);
  } else {
    this.player.css("transition", "bottom " + this.timeUp + "s cubic-bezier(0.25, 0.46, 0.45, 0.94)");
    this.player.css("bottom", this.getY() + this.speedUp);
  }
  this.rise = new Chrono();
}

Player.prototype.down = function () {
  this.player.css("transition", "bottom " + this.factorTimeDown * this.getY() + "s cubic-bezier(.57,.56,.69,.99) ");
  this.player.css("bottom", 0);
  this.rise = null;
}

Player.prototype.getX = function () {
  return parseInt(this.player.css("left"));
}

Player.prototype.getY = function () {
  return parseInt(this.player.css("bottom"));
}

Player.prototype.checkGameBorder = function () {
  if (this.getY() > 400) {
    this.up();
  } else if (this.getY() < 0) {
    this.down();
  }
}

Player.prototype.autoDown = function () {
  if (this.rise) {
    if (this.rise.result() > 200) {
      this.down();
    }
  } else {
    this.down();
  }
}

Player.prototype.getHitbox = function () {
  var hitbox = {radius: this.hitboxRadius};
  hitbox.x = this.getX() + 10 + this.hitboxRadius;
  hitbox.y = this.getY() + 10 + this.hitboxRadius;  
  return hitbox;
}
