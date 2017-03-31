/*
* HUD object
* Contains life of player, time, goal
*/
function Hud() {
  this.hud = $(".hud");
  this.lifeElem = $(".hud .life");
  this.timeElem = $(".hud .time");
  this.goalElem = $(".hud .goal");
  this.chrono;
  this.life = 4;
  this.progression = 0;
}

/*
* Luanch chrono and set life
*/
Hud.prototype.init = function () {
  this.chrono = new Chrono();
  this.setLife(this.life);
};
/*
* Update Chrono
*/
Hud.prototype.timeUpdate = function () {
  if (this.chrono) {
    this.timeElem.text((this.chrono.result() / 1000).toFixed(1) + "s");
  }
};

/*
* Set life with expand/reduce div
* @param : number of life
*/
Hud.prototype.setLife = function (life) {
  this.lifeElem.css("width", 30 * life);
};

/*
* Reduce Life and check if death
*/
Hud.prototype.removeLife = function (life) {
  this.life--;
  this.setLife(this.life);
  if (this.life == 0) {
    game.gameOver();
    game.audio.failSound();
  }
};

/*
* Increase progression
*/
Hud.prototype.addProgression = function () {
  this.setProgression(++this.progression);
  return this.progression;
};

/*
* set progression graphic element by expand/reduce div
* @param : progression (<= game goal)
*/
Hud.prototype.setProgression = function (progression) {
  this.goalElem.css("width", (progression / game.goal) * 100 + "%");
};

/*
* reset HUD
* espcially reset Chrono, life, progression
*/
Hud.prototype.reset = function () {
  this.chrono = null;
  this.timeElem.text("0s");
  this.life = 3;
  this.setLife(3);
  this.setProgression(0);
  this.progression = 0;
  this.hud.show();
};
