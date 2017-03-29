$(document).ready(function () {
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
      else if (e.keyCode == 120 && game.step == 1) {
        e.preventDefault();
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
  
  Background.prototype.reset = function () {
    for(var i = 0; i < this.numberLayer; i++) {
      this.setX(i, 0);
      this.setY(i, 0);
    }
  };
  
  
  
  
  
  function Game() {
    this.speed = 0;
    this.background = new Background();
    this.controller = new Controller();
    this.player = new Player();
    this.hud = new Hud();
    this.audio = new Audio();
    this.boss = new Boss();
    this.obstaclesContainer = $(".obstacles");
    this.currentObstaclesId = [];
    this.obstacles = [];
    this.bulletsContainer = $(".bullets");
    this.bullets = [];
    this.tick;
    this.goal = 1;
    this.step = 0;
  }
  
  Game.prototype.init = function () {
    $(".gameOver").fadeOut(200);
    this.controller.init();
    this.ticks();
    new Obstacle().init();
    this.hud.init();
    this.audio.init();
  };
  
  Game.prototype.ticks = function () {
    var actual = this;
    if (this.step == 1) {
      clearInterval(this.tick);
      this.tick = setInterval(function () {
          actual.background.scroll(actual.speed);
          actual.hud.timeUpdate();
          actual.player.checkGameBorder();
          actual.player.autoDown();
          actual.boss.move();
        },
        10);
    } else {
      this.tick = setInterval(function () {
          actual.background.scroll(actual.speed);
          actual.controller.checkChrono();
          actual.player.checkGameBorder();
          actual.player.autoDown();
          for (var i = 0; i < actual.obstacles.length; i++) {
            actual.obstacles[i].checkSpeed();
          }
          actual.checkCollision();
          actual.autoGenerateObstacle();
          actual.hud.timeUpdate();
        },
        10);
    }
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
        this.hud.removeLife();
        this.audio.explosionSound();
        if (this.hud.life == 0) {
          this.gameOver();
          this.audio.failSound();
        }
      }
    }
  }
  
  Game.prototype.autoGenerateObstacle = function () {
    for (var i = 0; i < this.obstacles.length; i++) {
      if (this.obstacles[i].getX() == -150) {
        this.obstacles[i].remove();
        if (this.hud.addProgression() == this.goal) {
          this.nextStep();
        } else {
          new Obstacle().init();
        }
      }
    }
  }
  
  Game.prototype.reset = function () {
    clearInterval(this.tick);
    $(document).off('keydown');
    for (var i = 0; i < this.obstacles.length; i++) {
      this.obstacles[i].remove();
    }
    this.speed = 0;
    this.background.reset();
    this.controller.reset();
    this.player.reset();
    this.hud.reset();
  }
  
  Game.prototype.gameOver = function () {
    $(".gameOver").fadeIn();
    setTimeout(function () {
      game.reset();
    }, 2000);
  }
  
  Game.prototype.nextStep = function () {
    clearInterval(this.tick);
    var actual = this;
    this.tick = setInterval(function () {
        actual.background.scroll(actual.speed);
        actual.hud.timeUpdate();
      },
      10);
    $(document).off('keydown');
    this.speed = 4;
    this.player.setY(200, 1);
    this.boss.init();
    this.step = 1;
    this.controller.init();
    setTimeout(function () {
      game.ticks();
    }, 1200);
  }
  
  Game.prototype.win = function () {
    clearInterval(this.tick);
    var actual = this;
    this.tick = setInterval(function () {
        actual.background.scroll(actual.speed);
      },
      10);
    var result = this.hud.chrono.result();
    $("p.score").text((result / 1000).toFixed(2) + "s");
    this.hud.hud.fadeOut();
    this.audio.winSound();
    $(document).off('keydown');
    this.controller.reset();
    this.speed = 4;
    this.player.setY(200, 1);
    setTimeout(function () {
      actual.speed = 6;
      actual.player.setX(960, 1.5);
    }, 1200);
    setTimeout(function () {
      game.gameOver();
    }, 3000);
  }
  
  function Player() {
    this.player = $(".player");
    this.rise;
    this.speedUp = 100;
    this.timeUp = 0.2;
    this.factorTimeDown = 0.002;
    this.hitboxRadius = 70 / 2;
    this.side = 0;
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
  
  Player.prototype.setX = function (val, speed) {
    this.player.css("transition", "left " + speed + "s linear");
    this.player.css("left", val);
  }
  
  Player.prototype.setY = function (val, speed) {
    this.player.css("transition", "bottom " + speed + "s linear");
    this.player.css("bottom", val);
  }
  
  Player.prototype.setSkin = function (val) {
    this.player.css("background-image", "url(../img/space" + val + ".png)");
    this.side = val;
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
  
  Player.prototype.reset = function () {
    this.rise = null;
    this.player.css("transition", "none");
    this.player.css("bottom", 0);
    this.player.css("left", 60);
    this.setSkin(0);
  }
  function Obstacle() {
    this.id;
    this.obstacle;
    this.hitboxRadius = 130 / 2;
  }
  
  Obstacle.prototype.init = function () {
    this.id = game.giveObstacleId();
    game.currentObstaclesId.push(this.id);
    game.obstaclesContainer.append('<div class="obstacle" id="obstacle-' + this.id + '"></div>');
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
  
  function Bullet() {
    this.id;
    this.bullet;
    this.hitboxRadius = 10 / 2;
    this.shooter;
    this.speed = 5;
  }
  
  Bullet.prototype.init = function (entity) {
    this.bullet = game.bulletsContainer.append('<div class="bullet"><div class="hitbox"></div></div>');
    game.bullets.push(this);
    this.shooter = entity;
    console.log(game.bullets);
  };
  
  Bullet.prototype.remove = function () {
    game.bullets.remove(this);
    this.bullet.remove();
  };
  
  Obstacle.prototype.move = function () {
    if(typeof entity === 'Player') {
      this.obstacle.css("transition-duration", this.speed * (960 - this.getX()) + "s");
      this.obstacle.css("right", 960);
    }
    else {
      this.obstacle.css("transition-duration", this.speed * (this.getX() + 10) + "s");
      this.obstacle.css("left", -10);
    }
  };
  
  Bullet.prototype.getX = function () {
    return parseInt(this.obstacle.css("left"));
  }
  
  Bullet.prototype.getY = function () {
    return parseInt(this.obstacle.css("bottom"));
  }
  
  Bullet.prototype.getHitbox = function () {
    var hitbox = {radius: this.hitboxRadius};
    hitbox.x = this.getX() + 10 + this.hitboxRadius;
    hitbox.y = this.getY() + 10 + this.hitboxRadius;  
    return hitbox;
  }
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
  function Audio() {
    this.theme = $("audio#theme")[0];
    this.explosion = $("audio#explosion")[0];
    this.fail = $("audio#fail")[0];
    this.win = $("audio#win")[0];
  }
  
  Audio.prototype.init = function () {
    if(this.theme.paused) {
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
});
