game.utils.createCSSClass = function(selector, style) {
  "use strict";
  if (!document.styleSheets) {
    return false;
  }

  if (document.getElementsByTagName("head").length === 0) {
    return false;
  }

  var styleSheet;
  var mediaType;
  var media;
  var i;

  if (document.styleSheets.length > 0) {
    for (i = 0; i < document.styleSheets.length; i++) {
      if (document.styleSheets[i].disabled) {
        continue;
      }
      media = document.styleSheets[i].media;
      mediaType = typeof media;

      if (mediaType === "string") {
        if (media === "" || (media.indexOf("screen") !== -1)) {
          styleSheet = document.styleSheets[i];
        }
      } else if (mediaType === "object") {
        if (media.mediaText === "" || (media.mediaText.indexOf("screen") !== -1)) {
          styleSheet = document.styleSheets[i];
        }
      }

      if (typeof styleSheet !== "undefined") {
        break;
      }
    }
  }

  if (typeof styleSheet === "undefined") {
    var styleSheetElement = document.createElement("style");
    styleSheetElement.type = "text/css";

    document.getElementsByTagName("head")[0].appendChild(styleSheetElement);

    for (i = 0; i < document.styleSheets.length; i++) {
      if (document.styleSheets[i].disabled) {
        continue;
      }
      styleSheet = document.styleSheets[i];
    }

    media = styleSheet.media;
    mediaType = typeof media;
  }

  if (mediaType === "string") {
    for (i = 0; i < styleSheet.rules.length; i++) {
      if (styleSheet.rules[i].selectorText.toLowerCase() === selector.toLowerCase()) {
        styleSheet.rules[i].style.cssText = style;
        return;
      }
    }

    styleSheet.addRule(selector, style);
  } else if (mediaType === "object") {
    for (i = 0; i < styleSheet.cssRules.length; i++) {
      if (styleSheet.cssRules[i].selectorText.toLowerCase() === selector.toLowerCase()) {
        styleSheet.cssRules[i].style.cssText = style;
        return;
      }
    }

    styleSheet.insertRule(selector + "{" + style + "}", 0);
  }
};
