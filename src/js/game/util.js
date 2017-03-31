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
