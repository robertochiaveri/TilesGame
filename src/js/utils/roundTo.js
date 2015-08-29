game.utils.roundTo = function(input, num) {
  "use strict";
  var resto = input % num;
  if (resto <= (num / 2)) {
    return input - resto;
  } else {
    return input + num - resto;
  }
};
