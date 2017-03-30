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

  // if Alliance is chosen
  $('.button-alliance').click(function () {
    $('p.text-empire').css('display', 'none');
    $('p.text-alliance').css('display', 'block');
  });

  // display #description then #game
  $('.button-choice').click(function () {
    $('#homepage').addClass('animated zoomOutUp');
    window.setTimeout('descriptionAppearance()', intervalTime);
    window.setTimeout('descriptionDisappearance()', intervalTime * 12.5);
    gameVisible = window.setTimeout('gameAppearance()', intervalTime * 15);
  });

  // if the skip button is clicked
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

// mobile phone et tablet test

//var isMobile = {
//  Android: function () {
//    return navigator.userAgent.match(/Android/i);
//  },
//  BlackBerry: function () {
//    return navigator.userAgent.match(/BlackBerry/i);
//  },
//  iOS: function () {
//    return navigator.userAgent.match(/iPhone|iPad|iPod/i);
//  },
//  Opera: function () {
//    return navigator.userAgent.match(/Opera Mini/i);
//  },
//  Windows: function () {
//    return navigator.userAgent.match(/IEMobile/i);
//  },
//  any: function () {
//    return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
//  }
//};
//
//if (isMobile.any()) {
//  $('.bg-image').css('display', 'none');
//  $('main').css('display', 'none');
//  $('body').prepend('<div class="error"></div>');
//  $('.error').css('position', 'fixed');
//  
//}
