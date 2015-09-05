game.ajaxCall = function(url) {
  "use strict";

  var xmlhttp;
  if (window.XMLHttpRequest) {
    xmlhttp = new XMLHttpRequest();
  } else {
    return false;
  }

  xmlhttp.onreadystatechange = function() {

    console.log(xmlhttp.status);

    if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
      console.log(xmlhttp.responseText);
    }

  };

  xmlhttp.open("GET", url, true);
  xmlhttp.send();


};


function jsonpCall(url, callback) {

  "use strict";

  var callbackName = "jsonp_callback_" + Math.round(100000 * Math.random());

  window[callbackName] = function(data) {
    delete window[callbackName];
    document.body.removeChild(jsonpCallScript);
    callback(data);
  };

  var jsonpCallScript = document.createElement("script");
  jsonpCallScript.src = url + (url.indexOf("?") >= 0 ? "&" : "?") + "callback=" + callbackName;
  document.body.appendChild(jsonpCallScript);
}
