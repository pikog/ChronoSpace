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
        actual.boss.shoot();
        actual.checkCollision(actual.player, actual.bullets);
        actual.checkCollision(actual.boss, actual.bullets);
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
        actual.checkCollision(actual.player, actual.obstacles);
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
    projectile.remove();
    new Obstacle().init();
    this.hud.removeLife();
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
