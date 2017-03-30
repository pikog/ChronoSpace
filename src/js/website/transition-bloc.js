$('body').prepend('<div class="bg-image"></div>');

var intervalTime = 1000;

// only #homepage displayed
$('#description').css('display', 'none');
$('#game').css('display', 'none');
$('#win').css('display', 'none');

function homepageAppearance() {
  $('#homepage').removeClass('animated zoomOutUp');
  $('#homepage').fadeIn();
}

function descriptionAppearance() {
  $('.bg-image').fadeOut();
  $('#description').fadeIn();
}

function descriptionDisappearance() {
  $('#description').fadeOut();
}

function gameAppearance() {
  $('.bg-image').fadeIn();
  $('#homepage').css('display', 'none');
  $('#game').fadeIn();
}

$(document).ready(function () {
  // if Empire is chosen
  $('.button-empire').click(function () {
    $('p.text-empire').css('display', 'block');
    $('p.text-alliance').css('display', 'none');
    $('a.button-skip')
  });

  // if Alliance is Chosen
  $('.button-alliance').click(function () {
    $('p.text-empire').css('display', 'none');
    $('p.text-alliance').css('display', 'block');
  });

  // display #description then #game
  $('.button-choice').click(function () {
    $('#homepage').addClass('animated zoomOutUp');
    window.setTimeout('descriptionAppearance()', intervalTime);
    window.setTimeout('descriptionDisappearance()', intervalTime * 10);
    gameVisible = window.setTimeout('gameAppearance()', intervalTime * 12.5);
  });

  $('.button-skip').click(function () {
    $('#description').fadeOut();
    $('.bg-image').fadeIn();
    clearTimeout(gameVisible);
    window.setTimeout('gameAppearance()', intervalTime);
  })

  // if the logo is clicked then #homepage reappears
  $('a.logo').click(function () {
    $('.bg-image').fadeIn();
    $('#description').fadeOut();
    $('#game').fadeOut();
    $('#win').fadeOut();
    clearTimeout(gameVisible);
    window.setTimeout('homepageAppearance()', intervalTime);
  });
});
