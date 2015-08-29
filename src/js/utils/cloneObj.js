game.utils.cloneObj = function(obj) {
  if (null == obj || "object" != typeof obj) return obj;
  var copy = obj.constructor();
  for (var attr in obj) {
    if (obj.hasOwnProperty(attr) && attr != "htmlElement") copy[
      attr] = obj[attr];
  }
  return copy;
};
