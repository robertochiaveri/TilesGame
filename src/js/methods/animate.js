game.animate = function(params) {
  "use strict";

  if (
    typeof params === "undefined" ||
    !params.element ||
    typeof params.animation !== "string") {
    console.log("wrong parameters in animate call", params);
    return false;
  }
  if (typeof params.duration !== "number") {
    params.duration = game.config.transitionDuration.generic;
  }


  var CSSstyleDeclaration, prefix = "";

  for (var p = 0; p < game.config.CSSprefixes.length; p++) {
    prefix = game.config.CSSprefixes[p];
    CSSstyleDeclaration += prefix + "animation-fill-mode:both;";
    CSSstyleDeclaration += prefix + "animation-duration:" + params.duration +
      "ms;";
    CSSstyleDeclaration += prefix + "animation-name:" + params.animation +
      ";";

    if (typeof params.iterations !== "undefined") {
      CSSstyleDeclaration += prefix + "animation-iteration-count:" +
        params.iteration + ";";
    }

    if (typeof params.delay === "number") {
      CSSstyleDeclaration += prefix + "animation-delay:" + params.delay +
        "ms;";
    }

    if (typeof params.easing === "string") {
      CSSstyleDeclaration += prefix + "animation-timing-function:" +
        params.easing + ";";
    }



    if (p < 0) {
      game.utils.listenTo(params.element, "animationEnd", function(event) {
        event.target.style["animation"] = "";
      });
    } else {
      game.utils.listenTo(params.element, game.config.CSSprefixes[p] +
        "AnimationEnd",
        function(event) {
          event.target.style[event.type.replace("End", "")] = "";
        });
    }
  }
  params.element.style.cssText += CSSstyleDeclaration;
};
