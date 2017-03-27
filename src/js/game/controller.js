function Controller() {
  this.lastArrowKey = null;
  this.chrono = null;
  this.numberOfCheck = 0;
}

Controller.prototype.init = function () {
  var actual = this;
  $(document).on('keydown', function (e) {
    if (e.key == "ArrowLeft" || e.key == "ArrowRight") {
      actual.arrowAlternate(e.key);
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
    console.log(this.chrono.result());
    this.chrono.reset();
  } else if (this.lastArrowKey == "ArrowRight" && key == "ArrowLeft") {
    this.lastArrowKey = key;
    game.speed = calcSpeed(this.chrono.result());
    console.log(this.chrono.result());
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