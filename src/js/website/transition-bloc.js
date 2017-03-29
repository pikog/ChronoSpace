// C'est encore un brouillon (ça se voit) et ce n'est que le début.

document.querySelector('#speech').style.display = 'none';
document.querySelector('#game').style.display = 'none';

function speechFadeIn(){
  $('#speech').fadeIn();
}

function gameFadeIn(){
  $('#speech').fadeOut();
  window.setTimeout($('#game').fadeIn(), 1000);
}

$(document).ready(function () {
  $('.button-choice').click(function () {
    $('#homepage').fadeOut();
    window.setTimeout('speechFadeIn()', 1000);
    window.setTimeout('gameFadeIn()', 30000);
  });
});