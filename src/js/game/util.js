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
