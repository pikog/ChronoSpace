function Audio() {
  this.theme = $("audio#theme")[0];
  this.explosion = $("audio#explosion")[0];
  this.fail = $("audio#fail")[0];
  this.win = $("audio#win")[0];
}

Audio.prototype.init = function () {
  if(this.theme.paused) {
    this.theme.currentTime = 0;
    this.theme.play();
  }
};

Audio.prototype.explosionSound = function () {
  this.explosion.currentTime = 0;
  this.explosion.play();
};

Audio.prototype.winSound = function () {
  this.theme.pause();
  this.win.currentTime = 0;
  this.win.play();
};

Audio.prototype.failSound = function () {
  this.theme.pause();
  this.fail.currentTime = 0;
  this.fail.play();
};