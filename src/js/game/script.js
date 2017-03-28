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
      } else if (e.keyCode == 32) {
        e.preventDefault();
        game.player.up();
      } else if (e.keyCode == 17) {
        e.preventDefault();
        game.player.down();
      }
    });
    $(document).on('click', function (e) {
      e.preventDefault();
      game.player.up();
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
  
  function Background() {
    this.background = $("#game .background");
    this.numberLayer = this.background.css("background-image").split(",").length;
  }
  
  Background.prototype.scroll = function (speed) {
    this.setX(0, this.getX(0) - speed);
    this.setX(1, this.getX(1) - speed*0.7);
    this.setX(2, this.getX(2) - speed*2);
    this.setX(3, this.getX(3) - speed*0.5);
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
    this.obstaclesContainer = $(".obstacles");
    this.currentObstaclesId = [];
    this.obstacles = [];
  }
  
  Game.prototype.init = function () {
    this.controller.init();
    this.ticks();
  };
  
  Game.prototype.ticks = function () {
    var actual = this;
    setInterval(function () {
        actual.background.scroll(game.speed);
        actual.controller.checkChrono();
        actual.player.checkGameBorder();
        actual.player.autoDown();
        for (var i = 0; i < actual.obstacles.length; i++) {
          actual.obstacles[i].checkSpeed();
        }
        actual.checkCollision();
        actual.autoGenerateObstacle();
      },
      10);
  };
  
  Game.prototype.giveObstacleId = function () {
    for (var i = 0; this.currentObstaclesId.indexOf(i) != -1; i++);
    return i;
  };
  
  Game.prototype.checkCollision = function () {
    var playerHitbox = this.player.getHitbox();
    for (var i = 0; i < this.obstacles.length; i++) {
      var obstacleHitbox = this.obstacles[i].getHitbox();
  
      var dx = obstacleHitbox.x - playerHitbox.x;
      var dy = obstacleHitbox.y - playerHitbox.y;
      var distance = Math.sqrt(dx * dx + dy * dy);
  
      if (distance < obstacleHitbox.radius + playerHitbox.radius) {
        this.obstacles[i].remove();
        new Obstacle().init();
      }
    }
  }
  
  Game.prototype.autoGenerateObstacle = function () {
    for(var i = 0; i < this.obstacles.length; i++) {
      if(this.obstacles[i].getX() == -150) {
        this.obstacles[i].remove();
        new Obstacle().init();
      }
    }
  }
  
  function Player() {
    this.player = $(".player");
    this.rise;
    this.speedUp = 100;
    this.timeUp = 0.2;
    this.factorTimeDown = 0.002;
    this.hitboxRadius = 70 / 2;
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
    this.player.css("transition", "bottom " + this.factorTimeDown * this.getY() + "s cubic-bezier(.57,.56,.69,.99) ");
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
  
  Player.prototype.getHitbox = function () {
    var hitbox = {radius: this.hitboxRadius};
    hitbox.x = this.getX() + 10 + this.hitboxRadius;
    hitbox.y = this.getY() + 10 + this.hitboxRadius;  
    return hitbox;
  }
  
  function Obstacle() {
    this.id;
    this.obstacle;
    this.hitboxRadius = 130 / 2;
  }
  
  Obstacle.prototype.init = function () {
    this.id = game.giveObstacleId();
    game.currentObstaclesId.push(this.id);
    game.obstaclesContainer.append('<div class="obstacle" id="obstacle-' + this.id + '"><div class="hitbox"></div><div>');
    this.obstacle = $('#obstacle-' + this.id);
    game.obstacles.push(this);
    this.obstacle.css("bottom", (Math.floor(Math.random() * 3)) * 165);
  };
  
  Obstacle.prototype.remove = function () {
    game.currentObstaclesId.remove(this.id);
    game.obstacles.remove(this);
    this.obstacle.remove();
  };
  
  Obstacle.prototype.setSpeed = function (speed) {
    if(speed == 0) {
      this.obstacle.css("left", this.getX());
    }
    else {
      this.obstacle.css("transition-duration", speed * (this.getX() + 150) + "s");
      this.obstacle.css("left", - 150 - Math.abs(this.getX()*0.000001));
    }
  };
  
  Obstacle.prototype.getX = function () {
    return parseInt(this.obstacle.css("left"));
  }
  
  Obstacle.prototype.getY = function () {
    return parseInt(this.obstacle.css("bottom"));
  }
  
  Obstacle.prototype.checkSpeed = function () {
    this.setSpeed(calcObstacleSpeed(game.speed));
  }
  
  Obstacle.prototype.getHitbox = function () {
    var hitbox = {radius: this.hitboxRadius};
    hitbox.x = this.getX() + 10 + this.hitboxRadius;
    hitbox.y = this.getY() + 10 + this.hitboxRadius;  
    return hitbox;
  }
  function Chrono() {
    this.start = new Date();
  }
  
  Chrono.prototype.reset = function () {
    this.start = new Date();
  }
  
  Chrono.prototype.result = function () {
    var end = new Date();
    return end.getTime() - this.start.getTime();
  }
  
  function calcSpeed(time) {
    if (time > 2000) {
      return 0;
    } else if (time > 1000) {
      return 2;
    } else if (time > 500) {
      return 4;
    } else if (time > 100) {
      return 6;
    } else if (time > 0) {
      return 10;
    }
  }
  
  function calcObstacleSpeed(speed) {
    if (speed == 10) {
      return 0.0009;
    } else if (speed == 6) {
      return 0.0013;
    } else if (speed == 4) {
      return 0.0018;
    } else if (speed == 2) {
      return 0.0022;
    } else if (speed == 0) {
      return 0;
    }
  }
  
  Array.prototype.remove = function (item) {
    var index = this.indexOf(item);
    if (index > -1) {
      this.splice(index, 1);
    }
  }
  
  var game = new Game();
  game.init();
  new Obstacle().init();
});
