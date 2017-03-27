var lastKey,
    chrono;

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

function onKey() {
  $(document).on('keydown', function (e) {
    if (e.key == "ArrowLeft" || e.key == "ArrowRight") {
      keyAlternate(e.key);
    }
  });
}

function keyAlternate(key) {
  if (lastKey == null) {
    lastKey = key;
    chrono = new Chrono();
  } else if (lastKey == "ArrowLeft" && key == "ArrowRight") {
    lastKey = key;
    console.log(chrono.result());
    chrono.reset();
  } else if (lastKey == "ArrowRight" && key == "ArrowLeft") {
    lastKey = key;
    console.log(chrono.result());
    chrono.reset();
  }
}