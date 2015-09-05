game.utils.editCSSRule = function(ruleClass, property, newValue) {

  "use strict";

  for (var s = 0; s < document.styleSheets.length; s++) {
    var sheet = document.styleSheets[s];
    var rules = sheet.cssRules ? sheet.cssRules : sheet.rules;

    if (rules == null) return "null";

    for (var i = 0; i < rules.length; i++) {
      if (rules[i].selectorText === ruleClass) {
        if (typeof newValue !== "undefined") {
          return rules[i].style[property] = newValue;
        } else {
          return rules[i].style[property];
        };

      }
    }

  }
  return null;
};
