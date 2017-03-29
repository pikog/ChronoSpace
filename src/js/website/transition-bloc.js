// C'est encore un brouillon (ça se voit) et ce n'estque le début.

document.querySelector('#speech').style.display = 'none';

function speechFadeIn(){
  $('#speech').fadeIn();
}

$(document).ready(function () {
  $('.button-choice').click(function () {
    $('#homepage').fadeOut();
    window.setTimeout('speechFadeIn()', 1000);
  });
});