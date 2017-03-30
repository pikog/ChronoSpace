$(document).ready(function () {
  /* 
  * @param Name of value in URL
  * @return Value in URL
  */
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
  /* Set name in id card */
  if(name) {
    $("input#pseudo").val(name);
    $(".card .name").text(name);
  }
  /* Set time in id card */
  if(!isNaN(time)) {
    $(".card .time").text(parseInt(time) + "\"" + time.toString().split(".")[1]);
  }
  /* 
  * Set grade, ship, avatar, side in id card 
  * grade and avatar depends on time
  */
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
    /*
    * Set metadata for sharing on facebook
    */
    $("meta[property='og:description']").attr("content", "Je suis " + $(".card .grade").text() + " avec " + $(".card .time").text() + " sur Chrono Space ! Etes vous capable de faire mieux ?");
  }
  /*
  * Set pseudo on id card when input change
  */
  $("input#pseudo").on('input', function () {
    $(".card .name").text($(this).val());
    setClipboardButton();
  });
  
  /*
  * Avoid submit form
  */
  $('form').submit(function(e) {
    e.preventDefault();
  });
  
  /*
  * Set share link
  */
  var clipboard = new Clipboard('a.share-link');
  function setClipboardButton() {
    $('a.share-link').attr("data-clipboard-text", "https://pikog.github.io/ChronoSpace/src/win.html?time=" + time + "&side=" + side + "&name=" + $(".card .name").text());
  }
  clipboard.on('success', function(e) {
    $('a.share-link').text("Lien copié dans votre presse papier");
    setTimeout(function() {
      $('a.share-link').text("Obtenir votre lien de partage");
    }, 3000);
  });
});
