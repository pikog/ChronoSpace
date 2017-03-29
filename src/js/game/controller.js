function Controller() {
  this.lastArrowKey = null;
  this.chrono = null;
  this.numberOfCheck = 0;
}

Controller.prototype.init = function () {
  var actual = this;
  $(document).on('keydown', function (e) {
    if ((e.key == "ArrowLeft" || e.key == "ArrowRight") && game.step == 0) {
      e.preventDefault();
      actual.arrowAlternate(e.key);
    } else if (e.keyCode == 32) {
      e.preventDefault();
      game.player.up();
    }
    else if(e.keyCode == 65 && game.step == 1) {
      e.preventDefault();
      game.player.shoot();
    }
  });
};

Controller.prototype.arrowAlternate = function (key) {
  if (this.lastArrowKey == null) {
    this.lastArrowKey = key;
    this.chrono = new Chrono();
  } else if (this.lastArrowKey == "ArrowLeft" && key == "ArrowRight") {
    this.lastArrowKey = key;
    game.speed = calcSpeed(this.chrono.result());
    this.chrono.reset();
  } else if (this.lastArrowKey == "ArrowRight" && key == "ArrowLeft") {
    this.lastArrowKey = key;
    game.speed = calcSpeed(this.chrono.result());
    this.chrono.reset();
  }
}

Controller.prototype.checkChrono = function () {
  if (this.numberOfCheck >= 200 && this.chrono != null) {
    if (this.chrono.result() >= 500) {
      game.speed = 0;
    }
  } else {
    this.numberOfCheck++;
  }
}

Controller.prototype.reset = function () {
  this.lastArrowKey = null;
  this.chrono = null;
  this.numberOfCheck = 0;
}
