$(document).ready(function () {
  
  /*Import Class with gulp-include */
  /*
  * Controller object
  */
  function Controller() {
  
  }
  
  /*
  * Listen keydown especially Up/Down/Spacebar
  */
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
  
  /*
  * Background object
  */
  function Background() {
    this.background = $("#game .background");
    this.numberLayer = this.background.css("background-image").split(",").length;
  }
  
  /*
  * Function to scroll background layers at different speed
  * @param : speed of Game
  */
  Background.prototype.scroll = function (speed) {
    this.setX(0, this.getX(0) - speed);
    this.setX(1, this.getX(1) - speed*0.7);
    this.setX(2, this.getX(2) - speed*2);
    this.setX(3, this.getX(3) - speed*0.5);
  };
  
  /*
  * @param : layer (0 = back)
  * @return : true layer in Array css background
  */
  Background.prototype.trueLayer = function (layer) {
    return this.numberLayer - 1 - layer;
  };
  /*
  * @param : layer (0 = back)
  * @return : vertical X position
  */
  Background.prototype.getX = function (layer) {
    return parseInt(this.background.css("background-position").split(",")[this.trueLayer(layer)].split("px")[0]);
  };
  
  /*
  * @param : layer (0 = back)
  * @return : horizontal Y position
  */
  Background.prototype.getY = function (layer) {
    return parseInt(this.background.css("background-position").split(",")[this.trueLayer(layer)].split("px")[1]);
  };
  
  
  /*
  * @param : layer (0 = back), and value of X position
  */
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
  
  /*
  * @param : layer (0 = back), and value of Y position
  */
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
  
  /*
  * Reset all layer position
  */
  Background.prototype.reset = function () {
    for(var i = 0; i < this.numberLayer; i++) {
      this.setX(i, 0);
      this.setY(i, 0);
    }
  };
  
  
  
  
  
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
  
  /*
  * Player Object
  */
  function Player() {
    this.player = $(".player");
    this.speed = 150;
    this.hitboxRadius = 100 / 2;
    this.chronoShoot;
  }
  
  /*
  * Move player Up
  * launch when Arrow Up
  * Verify border colision
  */
  Player.prototype.up = function () {
    this.player.css("transition", "bottom 1000ms cubic-bezier(0.165, 0.84, 0.44, 1)");
    if (this.getY() + 100 + this.speed >= 500) {
      this.player.css("bottom", 400);
    } else {
      this.player.css("bottom", this.getY() + this.speed);
    }
  }
  
  /*
  * Move player Down
  * launch when Arrow Down
  * Verify border collision
  */
  Player.prototype.down = function () {
    this.player.css("transition", "bottom 1000ms cubic-bezier(0.165, 0.84, 0.44, 1)");
    if (this.getY() - this.speed <= 0) {
      this.player.css("bottom", 0);
    } else {
      this.player.css("bottom", this.getY() - this.speed);
    }
  }
  
  /*
  * @return : X pos
  */
  Player.prototype.getX = function () {
    return parseInt(this.player.css("left"));
  }
  
  /*
  * @return : Y pos
  */
  Player.prototype.getY = function () {
    return parseInt(this.player.css("bottom"));
  }
  
  /*
  * Set X pos
  * @params : value of X pos, speed of animation
  * used for animation scene
  */
  Player.prototype.setX = function (val, speed) {
    this.player.css("transition", "left " + speed + "s linear");
    this.player.css("left", val);
  }
  
  /*
  * Set Y pos
  * @params : value of Y pos, speed of animation
  * used for animation scene
  */
  Player.prototype.setY = function (val, speed) {
    this.player.css("transition", "bottom " + speed + "s linear");
    this.player.css("bottom", val);
  }
  
  /*
  * Set skin
  * @params : side
  */
  Player.prototype.setSkin = function (val) {
    this.player.css("background-image", "url(img/ship" + val + ".png)");
  }
  
  /*
  * @return : hitbox object
  */
  Player.prototype.getHitbox = function () {
    var hitbox = {
      radius: this.hitboxRadius
    };
    hitbox.x = this.getX() + 10 + this.hitboxRadius;
    hitbox.y = this.getY() + 10 + this.hitboxRadius;
    return hitbox;
  }
  
  /*
  * Shoot bullet
  * Launch a Chrono to create a cadenced shots
  */
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
  
  /*
  * Reset player
  * espcially pos and chrono
  */
  Player.prototype.reset = function () {
    this.chronoShoot = null;
    this.player.css("transition", "none");
    this.player.css("bottom", 200);
    this.player.css("left", 60);
  }
  
  /*
  * Obstacle Object
  */
  function Obstacle() {
    this.obstacle;
    this.hitboxRadius = 130 / 2;
  }
  
  /*
  * Create the obstacle div
  * Set a random Y pos and random skin
  * launch movement
  */
  Obstacle.prototype.init = function (speed) {
    this.obstacle = $('<div class="obstacle"></div>').appendTo(game.obstaclesContainer);
    game.obstacles.push(this);
    this.obstacle.css("bottom", (Math.floor(Math.random() * 3)) * 165);
    this.obstacle.css("background-image", "url(img/obstacle" + Math.floor(Math.random() * 2) + ".png)");
    this.setSpeed(speed);
  };
  
  /*
  * Remove obstacle form the Game
  */
  Obstacle.prototype.remove = function () {
    game.obstacles.remove(this);
    this.obstacle.remove();
  };
  
  /*
  * Move bullet with smooth transition
  * depends on length of trip
  * launch by tick game because speed can change
  * @param : speed of the game
  */
  Obstacle.prototype.setSpeed = function (speed) {
    this.obstacle.css("transition", "left " + (this.getX() + 150) / (speed / 2) + "ms linear");
    this.obstacle.css("left", -150 - Math.abs(this.getX() * 0.000001));
  };
  
  /*
  * @return : X pos
  */
  Obstacle.prototype.getX = function () {
    return parseInt(this.obstacle.css("left"));
  }
  
  /*
  * @return : Y pos
  */
  Obstacle.prototype.getY = function () {
    return parseInt(this.obstacle.css("bottom"));
  }
  
  /*
  * @return : Hitbox object
  */
  Obstacle.prototype.getHitbox = function () {
    var hitbox = {
      radius: this.hitboxRadius
    };
    hitbox.x = this.getX() + 10 + this.hitboxRadius;
    hitbox.y = this.getY() + 10 + this.hitboxRadius;
    return hitbox;
  }
  
  /*
  * Speeder object
  */
  function Speeder() {
    this.speeder;
    this.hitboxRadius = 50 / 2;
  }
  
  /*
  * Create the speeder div
  * Set a random Y pos and random skin
  * avoid collsion whith obstacle
  * launch movement
  */
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
  
  /*
  * Remove speeder form the Game
  */
  Speeder.prototype.remove = function () {
    game.speeders.remove(this);
    this.speeder.remove();
  };
  
  /*
  * Move speeder with smooth transition
  * depends on length of trip
  * launch by tick game because speed can change
  * @param : speed of the game
  */
  Speeder.prototype.setSpeed = function (speed) {
    this.speeder.css("transition", "left " + (this.getX() + 50) / (speed / 2) + "ms linear");
    this.speeder.css("left", -50 - Math.abs(this.getX() * 0.000001));
  };
  
  /*
  * @return : X pos
  */
  Speeder.prototype.getX = function () {
    return parseInt(this.speeder.css("left"));
  }
  
  /*
  * @return : Y pos
  */
  Speeder.prototype.getY = function () {
    return parseInt(this.speeder.css("bottom"));
  }
  
  /*
  * @return : Hitbox object
  */
  Speeder.prototype.getHitbox = function () {
    var hitbox = {
      radius: this.hitboxRadius
    };
    hitbox.x = this.getX() + this.hitboxRadius;
    hitbox.y = this.getY() + this.hitboxRadius;
    return hitbox;
  }
  
  /*
  * Boss object
  */
  function Boss() {
    this.boss = $(".boss");
    this.chronoMove;
    this.chronoShoot;
    this.dateWhenMove;
    this.timeEndMove;
    this.hitboxRadius = 130 / 2;
    this.life = 5;
    this.lifeElem = $(".boss .life");
  }
  /*
  * Initialization of Boss
  * set life and transition with pos
  */
  Boss.prototype.init = function () {
    this.boss.css("transition", "bottom 0s linear, left 1s linear");
    this.boss.css("left", 750);
    this.setLife(this.life);
  };
  
  /*
  * Set Life with expand/reduce the div
  */
  Boss.prototype.setLife = function (life) {
    this.lifeElem.css("width", 10 * life);
  };
  
  /*
  * Reduce Life and check if win
  */
  Boss.prototype.removeLife = function (life) {
    this.life--;
    this.setLife(this.life);
    if (this.life == 0) {
      game.win();
    }
  };
  
  /*
  * Generate a random Y pos and move with smooth transition depends of the length of trip
  * Launch a Chrono to avoid generate a new pos when the move is not finished
  */
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
  
  /*
  * Shoot bullet
  * Launch a Chrono to create a cadenced shots
  */
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
  
  /*
  * Set skin
  * @param : side
  */
  Boss.prototype.setSkin = function (val) {
    this.boss.css("background-image", "url(img/boss" + val + ".png)");
  }
  
  /*
  * @return : hitbox object
  */
  Boss.prototype.getHitbox = function () {
    var hitbox = {
      radius: this.hitboxRadius
    };
    hitbox.x = parseInt(this.boss.css("left")) + 10 + this.hitboxRadius;
    hitbox.y = parseInt(this.boss.css("bottom")) + 10 + this.hitboxRadius;
    return hitbox;
  }
  
  /*
  * reset pos, chrono, and life
  */
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
  }
  
  /*
  * Bullet object
  */
  function Bullet() {
    this.bullet;
    this.hitboxRadius = 10 / 2;
    this.shooter;
    this.speed = 0.002;
  }
  
  /*
  * Create the bullet div
  * Set a direction and skin depends on shooter (Boss or Player)
  */
  Bullet.prototype.init = function (entity, x, y) {
    this.bullet = $('<div class="bullet"></div>').appendTo(game.bulletsContainer);
    this.shooter = entity;
    if (entity instanceof Player) {
      this.bullet.css("left", x);
      this.bullet.css("bottom", y);
      this.bullet.css("background-image", "url(img/laser0.png)");
    } else {
      this.bullet.css("left", x - 35);
      this.bullet.css("bottom", y);
      this.bullet.css("background-image", "url(img/laser1.png)");
    }
    game.bullets.push(this);
  };
  
  /*
  * Remove bullet form the Game
  */
  Bullet.prototype.remove = function () {
    game.bullets.remove(this);
    this.bullet.remove();
  };
  
  /*
  * Move bullet with transition
  * depends on shooter
  */
  Bullet.prototype.move = function () {
    if (this.shooter instanceof Player) {
      this.bullet.css("transition-duration", this.speed * (960 - this.getX()) + "s");
      this.bullet.css("left", 960);
    } else {
      this.bullet.css("transition-duration", this.speed * (this.getX() + 50) + "s");
      this.bullet.css("left", -50);
    }
    game.audio.shootSound();
  };
  
  /*
  * @return : X pos
  */
  Bullet.prototype.getX = function () {
    return parseInt(this.bullet.css("left"));
  }
  
  /*
  * @return : Y pos
  */
  Bullet.prototype.getY = function () {
    return parseInt(this.bullet.css("bottom"));
  }
  
  /*
  * @return : Hitbox object
  */
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
  
  /*
  * HUD object
  * Contains life of player, time, goal
  */
  function Hud() {
    this.hud = $(".hud");
    this.lifeElem = $(".hud .life");
    this.timeElem = $(".hud .time");
    this.goalElem = $(".hud .goal");
    this.chrono;
    this.life = 4;
    this.progression = 0;
  }
  
  /*
  * Luanch chrono and set life
  */
  Hud.prototype.init = function () {
    this.chrono = new Chrono();
    this.setLife(this.life);
  };
  /*
  * Update Chrono
  */
  Hud.prototype.timeUpdate = function () {
    if (this.chrono) {
      this.timeElem.text((this.chrono.result() / 1000).toFixed(1) + "s");
    }
  };
  
  /*
  * Set life with expand/reduce div
  * @param : number of life
  */
  Hud.prototype.setLife = function (life) {
    this.lifeElem.css("width", 30 * life);
  };
  
  /*
  * Reduce Life and check if death
  */
  Hud.prototype.removeLife = function (life) {
    this.life--;
    this.setLife(this.life);
    if (this.life == 0) {
      game.gameOver();
      game.audio.failSound();
    }
  };
  
  /*
  * Increase progression
  */
  Hud.prototype.addProgression = function () {
    this.setProgression(++this.progression);
    return this.progression;
  };
  
  /*
  * set progression graphic element by expand/reduce div
  * @param : progression (<= game goal)
  */
  Hud.prototype.setProgression = function (progression) {
    this.goalElem.css("width", (progression / game.goal) * 100 + "%");
  };
  
  /*
  * reset HUD
  * espcially reset Chrono, life, progression
  */
  Hud.prototype.reset = function () {
    this.chrono = null;
    this.timeElem.text("0s");
    this.life = 3;
    this.setLife(3);
    this.setProgression(0);
    this.progression = 0;
    this.hud.show();
  };
  
  /*
  * Audio object
  * used when collision events or win/death events
  */
  function Audio() {
    this.explosion = $("audio#explosion")[0];
    this.fail = $("audio#fail")[0];
    this.win = $("audio#win")[0];
    this.tir = $("audio#tir")[0];
    this.bonus = $("audio#bonus")[0];
    
  }
  
  Audio.prototype.explosionSound = function () {
    this.explosion.currentTime = 0;
    this.explosion.play();
  };
  
  Audio.prototype.winSound = function () {
    this.win.currentTime = 0;
    this.win.play();
  };
  
  Audio.prototype.failSound = function () {
    this.fail.currentTime = 0;
    this.fail.play();
  };
  
  Audio.prototype.shootSound = function () {
    this.tir.currentTime = 0;
    this.tir.play();
  };
  
  Audio.prototype.bonusSound = function () {
    this.bonus.currentTime = 0;
    this.bonus.play();
  };
  /*
  * Misc function
  */
  
  /*
  * Chrono object
  * used the difference of begin date and en date
  */
  function Chrono() {
    this.start = new Date();
  }
  
  Chrono.prototype.reset = function () {
    this.start = new Date();
  }
  
  /*
  * @return : chrono time in ms
  */
  Chrono.prototype.result = function () {
    var end = new Date();
    return end.getTime() - this.start.getTime();
  }
  
  /*
  * Upgrade array
  * easy remove a ktem form an array
  */
  Array.prototype.remove = function (item) {
    var index = this.indexOf(item);
    if (index > -1) {
      this.splice(index, 1);
    }
  }
  
  
  /* Game var create */
  var game = new Game();
  var side = 0;
  
  /* Set side empire or rebel */
  $("a.button-empire").on('click', function(e) {
    side = 1;
  });
  
  /* Stop the game when return to home */
  $("a.button-play").on('click', function(e) {
    e.preventDefault();
    game.init(side);
  });
  $("a.button-return, a.logo").on('click', function(e) {
    e.preventDefault();
    game.gameOver();
  });
  
});
