game = game || {};
game.utils = game.utils || {};

game.utils.useCSS3Animations = function() {
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
      transform: divStyle.MozTransform === '' ? 'MozTransform' : (divStyle.MsTransform ===
        '' ? 'MsTransform' :
        (divStyle.WebkitTransform === '' ? 'WebkitTransform' :
          (divStyle.OTransform === '' ? 'OTransform' :
            (divStyle.transform === '' ? 'transform' :
              false)))),
      animation: divStyle.MozAnimation === '' ? 'MozAnimation' : (divStyle.MsAnimation ===
          '' ? 'MsAnimation' :
          (divStyle.WebkitAnimation === '' ? 'WebkitAnimation' :
            (divStyle.OAnimation === '' ? 'OAnimation' :
              (divStyle.animation === '' ? 'animation' :
                false))))
        //, animation: ...
    };

  return support;
};
