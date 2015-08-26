// Avoid `console` errors in browsers that lack a console.
(function() {
  var method;
  var noop = function() {};
  var methods = [
    'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
    'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
    'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
    'timeStamp', 'trace', 'warn'
  ];
  var length = methods.length;
  var console = (window.console = window.console || {});

  while (length--) {
    method = methods[length];

    // Only stub undefined methods.
    if (!console[method]) {
      console[method] = noop;
    }
  }
}());


function roundTo(input, num) {
  var resto = input % num;
  if (resto <= (num / 2)) {
    return input - resto;
  } else {
    return input + num - resto;
  }
}


function getBrowserPrefix() {
  var styles = window.getComputedStyle(document.documentElement, ''),
    pre = (Array.prototype.slice
      .call(styles)
      .join('')
      .match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
    )[1],
    dom = ('WebKit|Moz|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1];
  return {
    dom: dom,
    lowercase: pre,
    css: '-' + pre + '-',
    js: pre[0].toUpperCase() + pre.substr(1)
  };
}


function createCSSClass(selector, style) {
  if (!document.styleSheets) {
    return;
  }

  if (document.getElementsByTagName("head").length == 0) {
    return;
  }

  var stylesheet;
  var mediaType;
  if (document.styleSheets.length > 0) {
    for (i = 0; i < document.styleSheets.length; i++) {
      if (document.styleSheets[i].disabled) {
        continue;
      }
      var media = document.styleSheets[i].media;
      mediaType = typeof media;

      if (mediaType == "string") {
        if (media == "" || (media.indexOf("screen") != -1)) {
          styleSheet = document.styleSheets[i];
        }
      } else if (mediaType == "object") {
        if (media.mediaText == "" || (media.mediaText.indexOf("screen") != -1)) {
          styleSheet = document.styleSheets[i];
        }
      }

      if (typeof styleSheet != "undefined") {
        break;
      }
    }
  }

  if (typeof styleSheet == "undefined") {
    var styleSheetElement = document.createElement("style");
    styleSheetElement.type = "text/css";

    document.getElementsByTagName("head")[0].appendChild(styleSheetElement);

    for (i = 0; i < document.styleSheets.length; i++) {
      if (document.styleSheets[i].disabled) {
        continue;
      }
      styleSheet = document.styleSheets[i];
    }

    var media = styleSheet.media;
    mediaType = typeof media;
  }

  if (mediaType == "string") {
    for (i = 0; i < styleSheet.rules.length; i++) {
      if (styleSheet.rules[i].selectorText.toLowerCase() == selector.toLowerCase()) {
        styleSheet.rules[i].style.cssText = style;
        return;
      }
    }

    styleSheet.addRule(selector, style);
  } else if (mediaType == "object") {
    for (i = 0; i < styleSheet.cssRules.length; i++) {
      if (styleSheet.cssRules[i].selectorText.toLowerCase() == selector.toLowerCase()) {
        styleSheet.cssRules[i].style.cssText = style;
        return;
      }
    }

    styleSheet.insertRule(selector + "{" + style + "}", 0);
  }
}



function useTouch() {
  return !!('ontouchstart' in window) // works on most browsers 
    || !!('onmsgesturechange' in window); // works on ie10
};

function use3D() {
  return ('WebKitCSSMatrix' in window && 'm11' in new WebKitCSSMatrix());
}

function useLocalStorage() {
  return (typeof(Storage) !== "undefined" && typeof localStorage !== "undefined");
}

function detectFullscreen() {
  if (("standalone" in window.navigator) && window.navigator.standalone) {
    return true;
  }
  return false;
}

function useCSS3Animations() {
  var div = document.createElement('div'),
    divStyle = div.style,
    // you'll probably be better off using a `switch` instead of theses ternary ops
    support = {
      transition: divStyle.MozTransition === '' ? {
          name: 'MozTransition',
          end: 'transitionend'
        } :
        // Will ms add a prefix to the transitionend event?
        (divStyle.MsTransition === '' ? {
            name: 'MsTransition',
            end: 'msTransitionend'
          } :
          (divStyle.WebkitTransition === '' ? {
              name: 'WebkitTransition',
              end: 'webkitTransitionEnd'
            } :
            (divStyle.OTransition === '' ? {
                name: 'OTransition',
                end: 'oTransitionEnd'
              } :
              (divStyle.transition === '' ? {
                  name: 'transition',
                  end: 'transitionend'
                } :
                false)))),
      transform: divStyle.MozTransform === '' ? 'MozTransform' : (divStyle.MsTransform === '' ? 'MsTransform' :
        (divStyle.WebkitTransform === '' ? 'WebkitTransform' :
          (divStyle.OTransform === '' ? 'OTransform' :
            (divStyle.transform === '' ? 'transform' :
              false)))),
      animation: divStyle.MozAnimation === '' ? 'MozAnimation' : (divStyle.MsAnimation === '' ? 'MsAnimation' :
          (divStyle.WebkitAnimation === '' ? 'WebkitAnimation' :
            (divStyle.OAnimation === '' ? 'OAnimation' :
              (divStyle.animation === '' ? 'animation' :
                false))))
        //, animation: ...
    };

  return support;
};



function stopListeningTo(element, eventType) {

  if (typeof window.customEventListeners[eventType][element] != "undefined") {
    element.removeEventListener(eventType, window.customEventListeners[eventType][element]);
    return true;
  }
  return false;

}

function listenTo(element, eventType, fn) {


  if ((typeof element.id == "undefined" || element.id == "") && element != document.body && element != document.documentElement && element != window) {
    console.log("better not add a listener to elements witout id: ", element);
    return false;
  }
  if (typeof window.customEventListeners == "undefined") {
    window.customEventListeners = {}
  }
  if (typeof window.customEventListeners[eventType] == "undefined") {
    window.customEventListeners[eventType] = {};
  }
  if (typeof window.customEventListeners[eventType][element.id] != "undefined") { /* console.log("cannot add another listener for "+eventType+" to ",element); */
    return false;
  }

  window.customEventListeners[eventType][element.id] = fn;


  if (!element.addEventListener) {
    element.attachEvent("on" + eventType, fn);
  } else if (element.addEventListener) {
    if (eventType.indexOf("touch") == 0) {
      element.addEventListener(eventType, function(event) {
        event.preventDefault();
        if (event.touches.length == 0) //touchend
        {
          fn(event);
        } else {
          for (var i = 0; i < event.touches.length; i++) {
            event.touches[i].timeStamp = event.timeStamp
            event.touches[i].type = event.type;
            event.touches[i].multiTouchEvent = event;
            fn(event.touches[i]);
          }
        }
        return;
      }, true);
    } else {
      element.addEventListener(eventType, fn, false);
    }
  }
}


function hasClass(element, cls) {
  return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}


function addClass(element, cls) {
  if (!hasClass(element, cls)) {
    element.className = element.className + " " + cls;
  }
  return (element.className);
}


function removeClass(element, cls) {
  element.className = " " + element.className + " ";
  element.className = trim(element.className.replace(" " + cls + " ", " "));

  return (element.className);
}


function trim(str) {
  var str = str.replace(/^\s\s*/, ''),
    ws = /\s/,
    i = str.length;
  while (ws.test(str.charAt(--i)));
  return str.slice(0, i + 1);
}
