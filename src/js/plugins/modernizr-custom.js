/* Modernizr (Custom Build) | MIT & BSD
 * Build: http://modernizr.com/download/#-mq-cssclasses-csstransforms3d-cssanimations-csstransitions-touch-localstorage
 */
;
window.Modernizr = function(e, t, n) {
  function C(e) {
    f.cssText = e
  }

  function k(e, t) {
    return C(h.join(e + ";") + (t || ""))
  }

  function L(e, t) {
    return typeof e === t
  }

  function A(e, t) {
    return !!~("" + e).indexOf(t)
  }

  function O(e, t) {
    for (var r in e) {
      var i = e[r];
      if (!A(i, "-") && f[i] !== n) return t == "pfx" ? i : !0
    }
    return !1
  }

  function M(e, t, r) {
    for (var i in e) {
      var s = t[e[i]];
      if (s !== n) return r === !1 ? e[i] : L(s, "function") ? s.bind(r || t) : s
    }
    return !1
  }

  function _(e, t, n) {
    var r = e.charAt(0).toUpperCase() + e.slice(1),
      i = (e + " " + d.join(r + " ") + r).split(" ");
    return L(t, "string") || L(t, "undefined") ? O(i, t) : (i = (e + " " + v.join(r + " ") + r).split(" "), M(i, t, n))
  }
  var r = "2.8.3",
    i = {},
    s = !0,
    o = t.documentElement,
    u = "modernizr",
    a = t.createElement(u),
    f = a.style,
    l, c = {}.toString,
    h = " -webkit- -moz- -o- -ms- ".split(" "),
    p = "Webkit Moz O ms",
    d = p.split(" "),
    v = p.toLowerCase().split(" "),
    m = {},
    g = {},
    y = {},
    b = [],
    w = b.slice,
    E, S = function(e, n, r, i) {
      var s, a, f, l, c = t.createElement("div"),
        h = t.body,
        p = h || t.createElement("body");
      if (parseInt(r, 10))
        while (r--) f = t.createElement("div"), f.id = i ? i[r] : u + (r + 1), c.appendChild(f);
      return s = ["&#173;", '<style id="s', u, '">', e, "</style>"].join(""), c.id = u, (h ? c : p).innerHTML += s, p.appendChild(c), h || (p.style.background = "", p.style.overflow = "hidden", l = o.style.overflow, o.style.overflow = "hidden", o.appendChild(p)), a = n(c, e), h ? c.parentNode.removeChild(c) : (p.parentNode.removeChild(p), o.style.overflow = l), !!a
    },
    x = function(t) {
      var n = e.matchMedia || e.msMatchMedia;
      if (n) return n(t) && n(t).matches || !1;
      var r;
      return S("@media " + t + " { #" + u + " { position: absolute; } }", function(t) {
        r = (e.getComputedStyle ? getComputedStyle(t, null) : t.currentStyle)["position"] == "absolute"
      }), r
    },
    T = {}.hasOwnProperty,
    N;
  !L(T, "undefined") && !L(T.call, "undefined") ? N = function(e, t) {
    return T.call(e, t)
  } : N = function(e, t) {
    return t in e && L(e.constructor.prototype[t], "undefined")
  }, Function.prototype.bind || (Function.prototype.bind = function(t) {
    var n = this;
    if (typeof n != "function") throw new TypeError;
    var r = w.call(arguments, 1),
      i = function() {
        if (this instanceof i) {
          var e = function() {};
          e.prototype = n.prototype;
          var s = new e,
            o = n.apply(s, r.concat(w.call(arguments)));
          return Object(o) === o ? o : s
        }
        return n.apply(t, r.concat(w.call(arguments)))
      };
    return i
  }), m.touch = function() {
    var n;
    return "ontouchstart" in e || e.DocumentTouch && t instanceof DocumentTouch ? n = !0 : S(["@media (", h.join("touch-enabled),("), u, ")", "{#modernizr{top:9px;position:absolute}}"].join(""), function(e) {
      n = e.offsetTop === 9
    }), n
  }, m.cssanimations = function() {
    return _("animationName")
  }, m.csstransforms3d = function() {
    var e = !!_("perspective");
    return e && "webkitPerspective" in o.style && S("@media (transform-3d),(-webkit-transform-3d){#modernizr{left:9px;position:absolute;height:3px;}}", function(t, n) {
      e = t.offsetLeft === 9 && t.offsetHeight === 3
    }), e
  }, m.csstransitions = function() {
    return _("transition")
  }, m.localstorage = function() {
    try {
      return localStorage.setItem(u, u), localStorage.removeItem(u), !0
    } catch (e) {
      return !1
    }
  };
  for (var D in m) N(m, D) && (E = D.toLowerCase(), i[E] = m[D](), b.push((i[E] ? "" : "no-") + E));
  return i.addTest = function(e, t) {
    if (typeof e == "object")
      for (var r in e) N(e, r) && i.addTest(r, e[r]);
    else {
      e = e.toLowerCase();
      if (i[e] !== n) return i;
      t = typeof t == "function" ? t() : t, typeof s != "undefined" && s && (o.className += " " + (t ? "" : "no-") + e), i[e] = t
    }
    return i
  }, C(""), a = l = null, i._version = r, i._prefixes = h, i._domPrefixes = v, i._cssomPrefixes = d, i.mq = x, i.testProp = function(e) {
    return O([e])
  }, i.testAllProps = _, i.testStyles = S, o.className = o.className.replace(/(^|\s)no-js(\s|$)/, "$1$2") + (s ? ' js ' + b.join(' ') : ""), i
}(this, this.document);
