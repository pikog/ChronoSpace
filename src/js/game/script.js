$(document).ready(function () {
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
  
  function Background() {
    this.background = $("#game .background");
    this.numberLayer = this.background.css("background-image").split(",").length;
  }
  
  Background.prototype.scroll = function (speed) {
    this.setX(0, this.getX(0) - speed);
    this.setX(1, this.getX(1) - speed - speed/1);
  };
  
  Background.prototype.trueLayer = function (layer) {
    return this.numberLayer - 1 - layer;
  };
  
  Background.prototype.getX = function (layer) {
    return parseInt(this.background.css("background-position").split(",")[this.trueLayer(layer)].split("px")[0]);
  };
  
  Background.prototype.getY = function (layer) {
    return parseInt(this.background.css("background-position").split(",")[this.trueLayer(layer)].split("px")[1]);
  };
  
  Background.prototype.setX = function (layer, val) {
    var result = "";
    for(var i = 0; i < this.numberLayer; i++) {
      if(i == this.trueLayer(layer)) {
        result += val + "px " + this.getY(this.trueLayer(i)) + "px";
      }
      else {
        result += this.getX(this.trueLayer(i)) + "px " + this.getY(this.trueLayer(i)) + "px";
      }
      
      if(i != this.numberLayer - 1) {
        result += ", ";
      }
    }
    this.background.css("background-position", result);
  };
  
  Background.prototype.setY = function (layer, val) {
    var result = "";
    for(var i = 0; i < this.numberLayer; i++) {
      if(i == this.trueLayer(layer)) {
        result += this.getX(this.trueLayer(i)) + "px " + val + "px";
      }
      else {
        result += this.getX(this.trueLayer(i)) + "px " + this.getY(this.trueLayer(i)) + "px";
      }
      
      if(i != this.numberLayer - 1) {
        result += ", ";
      }
    }
    this.background.css("background-position", result);
  };
  
  
  
  
  
  function Game() {
    this.speed = 0;
    this.background = new Background();
    this.controller = new Controller();
  }
  
  Game.prototype.init = function () {
    this.controller.init();
    this.ticks();
  };
  
  Game.prototype.ticks = function (speed) {
    var actual = this;
    setInterval(function () {
        actual.background.scroll(game.speed);
        actual.controller.checkChrono();
      },
      10);
  };
  function Chrono() {
    this.start = new Date();
  }
  
  Chrono.prototype.reset = function() {
    this.start = new Date();
  }
    
  Chrono.prototype.result = function() {
    var end = new Date();
    return end.getTime() - this.start.getTime();
  }
  
  function calcSpeed(time) {
    if(time > 2000) {
      return 0;
    }
    else if(time > 1000) {
      return 2;
    }
    else if(time > 500) {
      return 4;
    }
    else if(time > 100) {
      return 6;
    }
    else if(time > 0) {
      return 10;
    }
  }
  var game = new Game();
  game.init();

});
