game = game || {};
game.utils = game.utils || {};

game.utils.roundTo = function(input, num) {
  var resto = input % num;
  if (resto <= (num / 2)) {
    return input - resto;
  } else {
    return input + num - resto;
  }
};
