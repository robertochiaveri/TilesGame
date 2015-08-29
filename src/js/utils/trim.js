game.utils.trim = function(str) {
  "use strict";
  str = str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
  var ws = /\s/;
  var i = str.length;
  while (ws.test(str.charAt(--i)));
  return str.slice(0, i + 1);
};
