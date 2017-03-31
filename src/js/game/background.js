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




