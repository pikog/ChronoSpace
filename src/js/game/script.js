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
        e.preventDefault();
        actual.arrowAlternate(e.key);
      }
      else if(e.keyCode == 32) {
        e.preventDefault();
        game.player.up();
      }
      else if(e.keyCode == 17) {
        e.preventDefault();
        game.player.down();
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
    this.player = new Player();
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
        actual.player.checkGameBorder();
        actual.player.autoDown();
      },
      10);
  };
  function Player() {
    this.player = $(".player");
    this.rise;
    this.speedUp = 100;
    this.timeUp = 0.2;
    this.timeDown = 1.5;
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
    this.player.css("transition", "bottom " + this.timeDown + "s cubic-bezier(0.455, 0.03, 0.515, 0.955)");
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
