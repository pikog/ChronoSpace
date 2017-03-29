function Boss() {
  this.boss;
  this.chronoMove;
  this.dateWhenMove;
  this.timeEndMove;
}

Boss.prototype.init = function () {
  this.boss = $(".boss");
  this.boss.css("left", 750);
};

Boss.prototype.move = function () {
  if(this.chronoMove == null || this.chronoMove.result() >= this.timeEndMove) {
    if(this.chronoMove == null) {
      this.chronoMove = new Chrono();
    }
    var posY = Math.floor(Math.random() * 351);
    var timeToMove = 5 * Math.abs(parseInt(this.boss.css("bottom")) - posY);
    this.boss.css("transition-duration", timeToMove + "ms");
    this.boss.css("bottom", posY);
    this.timeEndMove = timeToMove + 2000;
    this.chronoMove.reset();
    new Bullet().init(this);
  }
};

Boss.prototype.shoot = function () {
  
};
