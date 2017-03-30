$(document).ready(function () {
  function Controller() {
  
  }
  
  Controller.prototype.init = function () {
    var actual = this;
    $(document).on('keydown', function (e) {
      if (e.keyCode == 38) {
        e.preventDefault();
        game.player.up();
      } else if (e.keyCode == 40) {
        e.preventDefault();
        game.player.down();
      } else if (e.keyCode == 32 && game.step == 1) {
        e.preventDefault();
        game.player.shoot();
      }
    });
  };
  
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
    this.speed = 1;
    this.background = new Background();
    this.controller = new Controller();
    this.player = new Player();
    this.hud = new Hud();
    this.audio = new Audio();
    this.boss = new Boss();
    this.obstaclesContainer = $(".obstacles");
    this.obstacles = [];
    this.speedersContainer = $(".speeders");
    this.speeders = [];
    this.bulletsContainer = $(".bullets");
    this.bullets = [];
    this.tick;
    this.goal = 1; //10
    this.step = 0;
  }
  
  Game.prototype.init = function () {
    $(".gameOver").fadeOut(200);
    this.controller.init();
    this.ticks();
    new Obstacle().init(this.speed);
    new Speeder().init(this.speed);
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
          actual.boss.move();
          actual.boss.shoot();
          actual.checkCollision(actual.player, actual.bullets);
          actual.checkCollision(actual.boss, actual.bullets);
        },
        10);
    } else {
      this.tick = setInterval(function () {
          actual.background.scroll(actual.speed);
          for (var i = 0; i < actual.obstacles.length; i++) {
            actual.obstacles[i].setSpeed(actual.speed);
          }
          for (var i = 0; i < actual.speeders.length; i++) {
            actual.speeders[i].setSpeed(actual.speed);
          }
          actual.checkCollision(actual.player, actual.obstacles);
          actual.checkCollision(actual.player, actual.speeders);
          actual.autoGenerateObstacle();
          actual.autoGenerateSpeeder();
          actual.hud.timeUpdate();
        },
        10);
    }
  };
  
  Game.prototype.checkCollision = function (entity, projectiles) {
    var entityHitbox = entity.getHitbox();
    for (var i = 0; i < projectiles.length; i++) {
      var projectileHitbox = projectiles[i].getHitbox();
  
      var dx = projectileHitbox.x - entityHitbox.x;
      var dy = projectileHitbox.y - entityHitbox.y;
      var distance = Math.sqrt(dx * dx + dy * dy);
  
      if (distance < projectileHitbox.radius + entityHitbox.radius) {
        this.collision(entity, projectiles[i]);
      }
    }
  }
  
  Game.prototype.collision = function (entity, projectile) {
    if (projectile instanceof Obstacle) {
      this.speed = 1;
      projectile.remove();
      new Obstacle().init();
      this.hud.removeLife();
      this.audio.explosionSound();
    } else if (projectile instanceof Speeder) {
      this.speed += 0.3;
      new Speeder().init();
      projectile.remove();
      this.audio.explosionSound();
    } else if (projectile instanceof Bullet && projectile.shooter instanceof Boss) {
      projectile.remove();
      this.hud.removeLife();
      this.audio.explosionSound();
    } else if (projectile instanceof Bullet && projectile.shooter instanceof Player) {
      projectile.remove();
      this.boss.removeLife();
      this.audio.explosionSound();
    }
  }
  
  Game.prototype.autoGenerateObstacle = function () {
    for (var i = 0; i < this.obstacles.length; i++) {
      if (this.obstacles[i].getX() == -150) {
        this.obstacles[i].remove();
        if (this.hud.addProgression() == this.goal) {
          this.nextStep();
        } else {
          new Obstacle().init(this.speed);
        }
      }
    }
  }
  
  Game.prototype.autoGenerateSpeeder = function () {
    for (var i = 0; i < this.speeders.length; i++) {
      if (this.speeders[i].getX() == -50) {
        this.speeders[i].remove();
        new Speeder().init(this.speed);
      }
    }
  }
  
  
  Game.prototype.reset = function () {
    clearInterval(this.tick);
    $(document).off('keydown');
    for (var i = 0; i < this.obstacles.length; i++) {
      this.obstacles[i].remove();
    }
    for (var i = 0; i < this.bullets.length; i++) {
      this.bullets[i].remove();
    }
    this.speed = 1;
    this.background.reset();
    this.player.reset();
    this.hud.reset();
    this.boss.reset();
    this.step = 0;
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
    var result = (this.hud.chrono.result()/ 1000).toFixed(2);
    $("p.score").text(result + "s");
    for (var i = 0; i < this.bullets.length; i++) {
      this.bullets[i].remove();
      console.log(this.bullets);
    }
    this.hud.hud.fadeOut();
    this.boss.reset();
    this.audio.winSound();
    $(document).off('keydown');
    this.speed = 4;
    this.player.setY(200, 1);
    setTimeout(function () {
      actual.speed = 6;
      actual.player.setX(960, 1.5);
    }, 1200);
    setTimeout(function () {
      game.gameOver();
      window.location.href = "win.html?time=" + result + "&side=" + actual.player.side;
    }, 3000);
  }
  
  function Player() {
    this.player = $(".player");
    this.speed = 150;
    this.hitboxRadius = 100 / 2;
    this.side = 0;
    this.chronoShoot;
  }
  
  Player.prototype.up = function () {
    this.player.css("transition", "bottom 1000ms cubic-bezier(0.165, 0.84, 0.44, 1)");
    if (this.getY() + 100 + this.speed >= 500) {
      this.player.css("bottom", 400);
    } else {
      this.player.css("bottom", this.getY() + this.speed);
    }
  }
  
  Player.prototype.down = function () {
    this.player.css("transition", "bottom 1000ms cubic-bezier(0.165, 0.84, 0.44, 1)");
    if (this.getY() - this.speed <= 0) {
      this.player.css("bottom", 0);
    } else {
      this.player.css("bottom", this.getY() - this.speed);
    }
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
    this.player.css("background-image", "url(img/ship" + val + ".png)");
    this.side = val;
  }
  
  Player.prototype.getHitbox = function () {
    var hitbox = {
      radius: this.hitboxRadius
    };
    hitbox.x = this.getX() + 10 + this.hitboxRadius;
    hitbox.y = this.getY() + 10 + this.hitboxRadius;
    return hitbox;
  }
  
  Player.prototype.shoot = function () {
    if (this.chronoShoot == null || this.chronoShoot.result() >= 700) {
      if (this.chronoShoot == null) {
        this.chronoShoot = new Chrono();
      }
      var bullet = new Bullet();
      bullet.init(this, this.getX() + 100, this.getY() + 50);
      bullet.move();
      this.chronoShoot.reset();
    }
  };
  
  Player.prototype.reset = function () {
    this.chronoShoot = null;
    this.player.css("transition", "none");
    this.player.css("bottom", 200);
    this.player.css("left", 60);
    this.setSkin(0);
  }
  
  function Obstacle() {
    this.obstacle;
    this.hitboxRadius = 130 / 2;
  }
  
  Obstacle.prototype.init = function (speed) {
    this.obstacle = $('<div class="obstacle"></div>').appendTo(game.obstaclesContainer);
    game.obstacles.push(this);
    this.obstacle.css("bottom", (Math.floor(Math.random() * 3)) * 165);
    this.obstacle.css("background-image", "url(img/obstacle" + Math.floor(Math.random() * 2) + ".png)");
    this.setSpeed(speed);
  };
  
  Obstacle.prototype.remove = function () {
    game.obstacles.remove(this);
    this.obstacle.remove();
  };
  
  Obstacle.prototype.setSpeed = function (speed) {
    this.obstacle.css("transition", "left " + (this.getX() + 150) / (speed / 2) + "ms linear");
    this.obstacle.css("left", -150 - Math.abs(this.getX() * 0.000001));
  };
  
  Obstacle.prototype.getX = function () {
    return parseInt(this.obstacle.css("left"));
  }
  
  Obstacle.prototype.getY = function () {
    return parseInt(this.obstacle.css("bottom"));
  }
  
  Obstacle.prototype.getHitbox = function () {
    var hitbox = {
      radius: this.hitboxRadius
    };
    hitbox.x = this.getX() + 10 + this.hitboxRadius;
    hitbox.y = this.getY() + 10 + this.hitboxRadius;
    return hitbox;
  }
  
  function Speeder() {
    this.speeder;
    this.hitboxRadius = 50 / 2;
  }
  
  Speeder.prototype.init = function (speed) {
    this.speeder = $('<div class="speeder"></div>').appendTo(game.speedersContainer);
    game.speeders.push(this);
    var pos = (Math.floor(Math.random() * 9)) * 50;
    for(var i = 0; i < game.obstacles.length; i++) {
      while(pos >= game.obstacles[i].getY() && pos <= game.obstacles[i].getY() + 50) {
        var pos = (Math.floor(Math.random() * 9)) * 50;
      }
    }
    this.speeder.css("bottom", pos);
    this.setSpeed(speed);
  };
  
  Speeder.prototype.remove = function () {
    game.speeders.remove(this);
    this.speeder.remove();
  };
  
  Speeder.prototype.setSpeed = function (speed) {
    this.speeder.css("transition", "left " + (this.getX() + 50) / (speed / 2) + "ms linear");
    this.speeder.css("left", -50 - Math.abs(this.getX() * 0.000001));
  };
  
  Speeder.prototype.getX = function () {
    return parseInt(this.speeder.css("left"));
  }
  
  Speeder.prototype.getY = function () {
    return parseInt(this.speeder.css("bottom"));
  }
  
  Speeder.prototype.getHitbox = function () {
    var hitbox = {
      radius: this.hitboxRadius
    };
    hitbox.x = this.getX() + this.hitboxRadius;
    hitbox.y = this.getY() + this.hitboxRadius;
    return hitbox;
  }
  
  function Boss() {
    this.boss = $(".boss");
    this.chronoMove;
    this.chronoShoot;
    this.dateWhenMove;
    this.timeEndMove;
    this.hitboxRadius = 130 / 2;
    this.life = 1; //5
    this.lifeElem = $(".boss .life");
    this.side = 0;
  }
  
  Boss.prototype.init = function () {
    this.boss.css("transition", "bottom 0s linear, left 1s linear");
    this.boss.css("left", 750);
    this.setLife(this.life);
  };
  
  Boss.prototype.setLife = function (life) {
    this.lifeElem.css("width", 10 * life);
  };
  
  Boss.prototype.removeLife = function (life) {
    this.life--;
    this.setLife(this.life);
    if (this.life == 0) {
      game.win();
    }
  };
  
  Boss.prototype.move = function () {
    if (this.chronoMove == null || this.chronoMove.result() >= this.timeEndMove) {
      if (this.chronoMove == null) {
        this.chronoMove = new Chrono();
      }
      var posY = Math.floor(Math.random() * 351);
      var timeToMove = 5 * Math.abs(parseInt(this.boss.css("bottom")) - posY);
      this.boss.css("transition-duration", timeToMove + "ms");
      this.boss.css("bottom", posY);
      this.timeEndMove = timeToMove + 2000;
      this.chronoMove.reset();
    }
  };
  
  Boss.prototype.shoot = function () {
    if (this.chronoShoot == null || this.chronoShoot.result() >= 1200) {
      if (this.chronoShoot == null) {
        this.chronoShoot = new Chrono();
      }
      var bullet = new Bullet();
      bullet.init(this, parseInt(this.boss.css("left")), parseInt(this.boss.css("bottom")) + 75);
      bullet.move();
      this.chronoShoot.reset();
    }
  };
  
  Boss.prototype.setSkin = function (val) {
    this.boss.css("background-image", "url(img/boss" + val + ".png)");
    this.side = val;
  }
  
  Boss.prototype.getHitbox = function () {
    var hitbox = {
      radius: this.hitboxRadius
    };
    hitbox.x = parseInt(this.boss.css("left")) + 10 + this.hitboxRadius;
    hitbox.y = parseInt(this.boss.css("bottom")) + 10 + this.hitboxRadius;
    return hitbox;
  }
  
  Boss.prototype.reset = function () {
    this.chronoMove = null;
    this.chronoShoot = null;
    this.dateWhenMove = null;
    this.timeEndMove = null;
    this.boss.css("transition", "none");
    this.boss.css("bottom", 175);
    this.boss.css("left", 960);
    this.life = 5;
    this.setLife(5);
    this.setSkin(0);
  }
  
  function Bullet() {
    this.bullet;
    this.hitboxRadius = 10 / 2;
    this.shooter;
    this.speed = 0.002;
  }
  
  Bullet.prototype.init = function (entity, x, y) {
    this.bullet = $('<div class="bullet"></div>').appendTo(game.bulletsContainer);
    this.shooter = entity;
    if (entity instanceof Player) {
      this.bullet.css("left", x);
      this.bullet.css("bottom", y);
    } else {
      this.bullet.css("left", x - 35);
      this.bullet.css("bottom", y);
    }
    game.bullets.push(this);
  };
  
  Bullet.prototype.remove = function () {
    game.bullets.remove(this);
    this.bullet.remove();
  };
  
  Bullet.prototype.move = function () {
    if (this.shooter instanceof Player) {
      this.bullet.css("transition-duration", this.speed * (960 - this.getX()) + "s");
      this.bullet.css("left", 960);
    } else {
      this.bullet.css("transition-duration", this.speed * (this.getX() + 50) + "s");
      this.bullet.css("left", -50);
    }
  };
  
  Bullet.prototype.getX = function () {
    return parseInt(this.bullet.css("left"));
  }
  
  Bullet.prototype.getY = function () {
    return parseInt(this.bullet.css("bottom"));
  }
  
  Bullet.prototype.getHitbox = function () {
    var hitbox = {
      radius: this.hitboxRadius
    };
    if (this.shooter instanceof Player) {
      hitbox.x = this.getX() + 40 + this.hitboxRadius;
      hitbox.y = this.getY() + this.hitboxRadius;
    } else {
      hitbox.x = this.getX() + this.hitboxRadius;
      hitbox.y = this.getY() + this.hitboxRadius;
    }
    return hitbox;
  }
  
  function Hud() {
    this.hud = $(".hud");
    this.lifeElem = $(".hud .life");
    this.timeElem = $(".hud .time");
    this.goalElem = $(".hud .goal");
    this.chrono;
    this.life = 4;
    this.progression = 0;
  }
  
  Hud.prototype.init = function () {
    this.chrono = new Chrono();
    this.setLife(this.life);
  };
  
  Hud.prototype.timeUpdate = function () {
    if (this.chrono) {
      this.timeElem.text((this.chrono.result() / 1000).toFixed(1) + "s");
    }
  };
  
  Hud.prototype.setLife = function (life) {
    this.lifeElem.css("width", 30 * life);
  };
  
  Hud.prototype.removeLife = function (life) {
    this.life--;
    this.setLife(this.life);
    if (this.life == 0) {
      game.gameOver();
      game.audio.failSound();
    }
  };
  
  Hud.prototype.addProgression = function () {
    this.setProgression(++this.progression);
    return this.progression;
  };
  
  Hud.prototype.setProgression = function (progression) {
    this.goalElem.css("width", (progression / game.goal) * 100 + "%");
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
      this.theme.currentTime = 0;
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
  
  Array.prototype.remove = function (item) {
    var index = this.indexOf(item);
    if (index > -1) {
      this.splice(index, 1);
    }
  }
  
  var game = new Game();
  game.init();
});
