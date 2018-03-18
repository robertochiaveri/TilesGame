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
    params.duration = this.config.transitionDuration.generic;
  }


  var CSSstyleDeclaration;
  var prefix = "";

  for (var p = 0; p < this.config.browserPrefixes.css.length; p++) {

    prefix = this.config.browserPrefixes.css[p];

    CSSstyleDeclaration += prefix + "animation-fill-mode:both;";
    CSSstyleDeclaration += prefix + "animation-duration:" + params.duration + "ms;";
    CSSstyleDeclaration += prefix + "animation-name:" + params.animation + ";";

    if (typeof params.iterations !== "undefined") {
      CSSstyleDeclaration += prefix + "animation-iteration-count:" + params.iteration + ";";
    }

    if (typeof params.delay === "number") {
      CSSstyleDeclaration += prefix + "animation-delay:" + params.delay + "ms;";
    }

    if (typeof params.easing === "string") {
      CSSstyleDeclaration += prefix + "animation-timing-function:" + params.easing + ";";
    }

    if (p < 0) {
      this.utils.listenTo(
        params.element,
        "animationend",
        function(event, context) {

          context.utils.stopListeningTo(
            params.element,
            "animationend",
            context.runtime.eventListeners
          );

          event.target.style["animation-name"] = "";
        },
        this.runtime.eventListeners,
        this);
    } else {

      this.utils.listenTo(params.element, this.config.browserPrefixes.lowercase[p] + "AnimationEnd",
        function(event, context) {

          context.utils.stopListeningTo(
            params.element,
            event.type,
            context.runtime.eventListeners
          );

          event.target.style[event.type.replace("End", "Name")] = "";

          context.utils.removeClass(params.element, context.config.labels.ANIMATED_LABEL);

        },
        this.runtime.eventListeners,
        this
      );

    }
  };
  this.utils.addClass(params.element, this.config.labels.ANIMATED_LABEL);
  params.element.style.cssText += CSSstyleDeclaration;
};
