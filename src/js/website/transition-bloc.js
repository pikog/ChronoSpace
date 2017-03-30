$('body').prepend('<div class="bg-image"></div>');

var intervalTime = 1000;
var descriptionSkipped = false;

// only #homepage displayed
$('#description').css('display', 'none');
$('#gameSection').css('display', 'none');
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
  $('#gameSection').fadeIn();
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
    $('a.controlSound').css('display', 'block');
    if ($('i.fa').hasClass('fa-volume-off')) {
      $('audio#theme')[0].currentTime = 0;
    }
    $('audio#theme')[0].play();
    $('i.fa').removeClass('fa-volume-off');
    $('i.fa').addClass('fa-volume-up');
  });

  // stop or play music
  $('a.controlSound').click(function () {
    if ($('i.fa').hasClass('fa-volume-up')) {
      $('i.fa').removeClass('fa-volume-up');
      $('i.fa').addClass('fa-volume-off');
      $('audio#theme')[0].pause();
      $('audio').each(function() {
        this.muted = true;
      });
      
    } else {
      $('i.fa').removeClass('fa-volume-off');
      $('i.fa').addClass('fa-volume-up');
      $('audio#theme')[0].play();
      $('audio').each(function() {
        this.muted = false;
      });
    }
  });

  // if the skip button is clicked
  $('.button-skip').click(function () {
    descriptionSkipped = true;
    if (descriptionSkipped) {
      clearTimeout(gameVisible);
    }
    $('#description').fadeOut();
    $('.bg-image').fadeIn();
    window.setTimeout('gameAppearance()', intervalTime);
    descriptionSkipped = false;
  })

  // if the logo is clicked then #homepage reappears
  $('a.logo').click(function () {
    descriptionSkipped = true;
    if (descriptionSkipped) {
      clearTimeout(gameVisible);
    }
    $('.bg-image').fadeIn();
    $('#description').fadeOut();
    $('#gameSection').fadeOut();
    $('#win').fadeOut();
    clearTimeout(gameVisible);
    window.setTimeout('homepageAppearance()', intervalTime);
    descriptionSkipped = false;
  });
});

// mobile phone et tablet test

var isMobile = {
  Android: function () {
    return navigator.userAgent.match(/Android/i);
  },
  BlackBerry: function () {
    return navigator.userAgent.match(/BlackBerry/i);
  },
  iOS: function () {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i);
  },
  Opera: function () {
    return navigator.userAgent.match(/Opera Mini/i);
  },
  Windows: function () {
    return navigator.userAgent.match(/IEMobile/i);
  },
  any: function () {
    return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
  }
};

if (isMobile.any()) {
  $('.bg-image').css('display', 'none');
  $('header').css('display', 'none');
  $('main').css('display', 'none');
  $('body').prepend('<div class="error"><div class="message">Ce jeu ne fonction pas sur mobile ou tablette !</div></div>');
}
