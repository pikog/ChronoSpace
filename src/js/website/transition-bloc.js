var intervalTime = 1000;

$('#speech').css('display', 'none');
$('#game').css('display', 'none');
$('#win').css('display', 'none');

function homepageAppearance() {
  $('#homepage').removeClass('animated zoomOutUp');
  $('#homepage').fadeIn();
}

function speechAppearance() {
  $('#speech').fadeIn();
}

function speechDisappearance() {
  $('#speech').fadeOut();
}

function gameAppearance() {
  $('#homepage').css('display', 'none');
  $('#game').fadeIn();
}

$(document).ready(function () {
  $('.button-empire').click(function () {
    $('p.text-empire').css('display', 'block');
    $('p.text-rebel').css('display', 'none');
  });

  $('.button-rebel').click(function () {
    $('p.text-empire').css('display', 'none');
    $('p.text-rebel').css('display', 'block');
  });

  $('.button-choice').click(function () {
    $('#homepage').addClass('animated zoomOutUp');
    window.setTimeout('speechAppearance()', intervalTime);
    window.setTimeout('speechDisappearance()', intervalTime * 10);
    gameVisible = window.setTimeout('gameAppearance()', intervalTime * 12.5);
  });

  $('a.logo').click(function () {
    if ($('#homepage').css('display', 'none')) {
      $('#speech').fadeOut();
      $('#game').fadeOut();
      $('#win').fadeOut();
      clearTimeout(gameVisible);
      window.setTimeout('homepageAppearance()', intervalTime);
    }
  });
});
