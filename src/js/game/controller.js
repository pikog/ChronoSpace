function Controller() {

}

Controller.prototype.init = function () {
  var actual = this;
  $(document).on('keydown', function (e) {
    if (e.key == "ArrowUp") {
      e.preventDefault();
      game.player.up();
    } else if (e.key == "ArrowDown") {
      e.preventDefault();
      game.player.down();
    } else if (e.keyCode == 32 && game.step == 1) {
      e.preventDefault();
      game.player.shoot();
    }
  });
};
