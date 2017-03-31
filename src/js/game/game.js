/* 
* Main file
* Define Game object
*/
function Game() {
  this.speed = 1;
  /*
  * Declare herited object of Game
  */
  this.background = new Background();
  this.controller = new Controller();
  this.player = new Player();
  this.hud = new Hud();
  this.audio = new Audio();
  this.boss = new Boss();
  /*
  * Array and jQuery object who contains "small" and non-unique object
  */
  this.obstaclesContainer = $(".obstacles");
  this.obstacles = [];
  this.speedersContainer = $(".speeders");
  this.speeders = [];
  this.bulletsContainer = $(".bullets");
  this.bullets = [];
  this.tick;
  this.goal = 10;
  this.step = 0;
  this.side = 0;
}

/*
* Initilize Game
* @param side (empire = 1, rebel = 0)
* remove black layer, set side skin
* launch unique tick fonction of the game
* create first obstacle and speeder
*/
Game.prototype.init = function (side) {
  this.side = side;
  this.player.setSkin(side);
  this.boss.setSkin(side);
  $(".gameOver").fadeOut(200);
  this.controller.init();
  this.ticks();
  new Obstacle().init(this.speed);
  new Speeder().init(this.speed);
  this.hud.init();
};

/*
* Main and unique tick fonction of the game
* every 10ms
* 2 steps : first runner(0), second shooter(1)
* overall animate background, boss, obstacle and speeders
*   check collision and update timer
*/
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


/*
* Check colision
* @params
*   entity: generally Boss or Player
*   Array of projectiles: generally Array Bullets or Array Obstacles of Game
* When collision launch collision function with in params the entity and the projectile
*/
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
/*
* Collision function
* @params: entity (Boss or Player), projectile (Bullet or Obstacle)
* different scenario with each case
*/
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
    this.audio.bonusSound();
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
/*
* Generate new obstacle and check progression in step 0 (Runner)
* Launch by the Game tick
*/
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
/*
* Generate new speeder in step 0 (Runner)
* Launch by the Game tick
*/
Game.prototype.autoGenerateSpeeder = function () {
  for (var i = 0; i < this.speeders.length; i++) {
    if (this.speeders[i].getX() == -50) {
      this.speeders[i].remove();
      new Speeder().init(this.speed);
    }
  }
}

/*
* Reset Game espacially var or entity pos
* Used when death or return to home
*/
Game.prototype.reset = function () {
  clearInterval(this.tick);
  $(document).off('keydown');
  $(".obstacle").remove();
  this.obstacles = [];
  $(".bullet").remove();
  this.bullets = [];
  $(".speeder").remove();
  this.speeders = [];
  this.speed = 1;
  this.background.reset();
  this.player.reset();
  this.hud.reset();
  this.boss.reset();
  this.step = 0;
}

/*
* Game over function
* Display black layer and reset
*/
Game.prototype.gameOver = function () {
  $(".gameOver").fadeIn();
  game.reset();
}

/*
* Go to step shooter (1)
* Short animation and intialise Boss
*/
Game.prototype.nextStep = function () {
  clearInterval(this.tick);
  var actual = this;
  this.tick = setInterval(function () {
      actual.background.scroll(actual.speed);
      actual.hud.timeUpdate();
    },
    10);
  $(".speeder").remove();
  this.speeders = [];
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

/*
* Launch when Win
* Short animation, and redirection on the win page, with custom parms in URL
*/
Game.prototype.win = function () {
  clearInterval(this.tick);
  var actual = this;
  this.tick = setInterval(function () {
      actual.background.scroll(actual.speed);
    },
    10);
  var result = (this.hud.chrono.result()/ 1000).toFixed(2);
  $(".bullet").remove();
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
    window.location.href = "win.html?time=" + result + "&side=" + actual.side;
  }, 3000);
}
