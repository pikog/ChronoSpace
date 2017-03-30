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
