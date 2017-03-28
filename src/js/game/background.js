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




