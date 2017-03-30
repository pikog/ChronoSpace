$(document).ready(function () {
  var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
      sURLVariables = sPageURL.split('&'),
      sParameterName,
      i;

    for (i = 0; i < sURLVariables.length; i++) {
      sParameterName = sURLVariables[i].split('=');

      if (sParameterName[0] === sParam) {
        return sParameterName[1] === undefined ? true : sParameterName[1];
      }
    }
  };

  var name = getUrlParameter('name');
  var side = parseInt(getUrlParameter('side'));
  var time = parseFloat(getUrlParameter('time'));
  
  if(name) {
    $("input#pseudo").val(name);
    $(".card .name").text(name);
  }
  
  if(!isNaN(time)) {
    $(".card .time").text(parseInt(time) + "\"" + time.toString().split(".")[1]);
  }
  if(!isNaN(time) && !isNaN(side)) {
    if(side) {
      $(".card img.side").attr("src", "img/win/empire_logo.png");
      $(".card img.ship").attr("src", "img/ship1.png");
      $(".card .sideText").text("Empire");
      if(time > 30) {
        $(".card .grade").text("Trooper");
        $(".card img.character").attr("src", "img/win/empire_3.png");
      }
      else if(time > 24) {
        $(".card .grade").text("Boba Fett");
        $(".card img.character").attr("src", "img/win/empire_2.png");
      }
      else {
        $(".card .grade").text("Dark Vador");
        $(".card img.character").attr("src", "img/win/empire_1.png");
      }
    }
    else {
      $(".card img.side").attr("src", "img/win/rebel_logo.png");
      $(".card img.ship").attr("src", "img/ship0.png");
      $(".card .sideText").text("Rebel");
      if(time > 30) {
        $(".card .grade").text("C3PO");
        $(".card img.character").attr("src", "img/win/rebel_3.png");
      }
      else if(time > 24) {
        $(".card .grade").text("Luke");
        $(".card img.character").attr("src", "img/win/rebel_2.png");
      }
      else {
        $(".card .grade").text("Yoda");
        $(".card img.character").attr("src", "img/win/rebel_1.png");
      }
    }
    $("meta[property='og:description']").attr("content", "Je suis " + $(".card .grade").text() + " avec " + $(".card .time").text() + " sur Chrono Space ! Etes vous capable de faire mieux ?");
  }

  $("input#pseudo").on('input', function () {
    $(".card .name").text($(this).val());
  });
});
