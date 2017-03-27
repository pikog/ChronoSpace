function Background() {
  this.background = $("#game .background");
}

Background.prototype.scroll = function (speed) {
  this.background.css("background-position", parseInt(this.background.css("background-position")) - speed + "px 0px");
};