function Hud() {
  this.hud = $(".hud");
  this.lifeElem = $(".hud .life"); 
  this.timeElem = $(".hud .time");
  this.goalElem = $(".hud .goal");
  this.chrono;
  this.life = 3;
  this.progression = 0;
}
  
Hud.prototype.init = function () {
  this.chrono = new Chrono();
  this.setLife(this.life);
};

Hud.prototype.timeUpdate = function () {
  if(this.chrono) {
    this.timeElem.text((this.chrono.result()/1000).toFixed(1) + "s");
  }
};

Hud.prototype.setLife = function (life) {
  this.lifeElem.css("width", 30 * life);
};

Hud.prototype.removeLife = function (life) {
  this.life--;
  this.setLife(this.life);
};
  
Hud.prototype.addProgression = function () {
  this.setProgression(++this.progression);
  return this.progression;
};

Hud.prototype.setProgression = function (progression) {
  this.goalElem.css("width", (progression/game.goal)*100 + "%");
};

Hud.prototype.reset = function () {
  this.chrono = null;
  this.timeElem.text("0s");
  this.life = 3;
  this.setLife(3);
  this.setProgression(0);
  this.progression = 0;
  this.hud.show();
};