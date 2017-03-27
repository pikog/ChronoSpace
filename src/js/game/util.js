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