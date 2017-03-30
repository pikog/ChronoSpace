function Audio() {
  this.explosion = $("audio#explosion")[0];
  this.fail = $("audio#fail")[0];
  this.win = $("audio#win")[0];
  this.tir = $("audio#tir")[0];
  this.bonus = $("audio#bonus")[0];
  
}

Audio.prototype.explosionSound = function () {
  this.explosion.currentTime = 0;
  this.explosion.play();
};

Audio.prototype.winSound = function () {
  this.win.currentTime = 0;
  this.win.play();
};

Audio.prototype.failSound = function () {
  this.fail.currentTime = 0;
  this.fail.play();
};

Audio.prototype.shootSound = function () {
  this.tir.currentTime = 0;
  this.tir.play();
};

Audio.prototype.bonusSound = function () {
  this.bonus.currentTime = 0;
  this.bonus.play();
};