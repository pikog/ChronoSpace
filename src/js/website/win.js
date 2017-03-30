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
  var side = getUrlParameter('side');
  var time = getUrlParameter('time');
  
  if(name) {
    $("input#pseudo").val(name);
    $(".card .name").text(name);
  }
  
  if(time) {
    $(".card .time").text(time);
  }

  $("input#pseudo").on('input', function () {
    $(".card .name").text($(this).val());
  });
});
