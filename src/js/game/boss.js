function Boss() {
  this.boss;
}

Boss.prototype.init = function () {
  player.player.after('<div class="boss"><div>');
  this.boss = $(".boss");
  this.boss.css("left", 790);
};

Boss.prototype.move = function () {
  var posY = Math.floor(Math.random * 351);
  this.boss.css("transition-duration", 0.05 * parseInt(Math.abs(this.boss.css("left") - posY)) + "s");
  this.boss.css("bottom", posY);
};
