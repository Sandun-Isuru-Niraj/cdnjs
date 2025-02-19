/*!
* metismenu - v3.0.0-beta.0
* A menu plugin
* https://github.com/onokumus/metismenu#readme
*
* Made by Osman Nuri Okumus <onokumus@gmail.com> (https://github.com/onokumus)
* Under MIT License
*/
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.MetisMenu = factory());
}(this, (function () { 'use strict';

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};
      var ownKeys = Object.keys(source);

      if (typeof Object.getOwnPropertySymbols === 'function') {
        ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        }));
      }

      ownKeys.forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    }

    return target;
  }

  var Default = {
    parentTrigger: "li",
    subMenu: "ul",
    toggle: true,
    triggerElement: "a"
  };
  var ClassNames = {
    activeClass: "active",
    collapseClass: "collapse",
    collapseInClass: "in",
    collapsingClass: "collapsing"
  };

  var MetisMenu =
  /*#__PURE__*/
  function () {
    function MetisMenu(element, options) {
      this.element = typeof element === "string" ? document.querySelector(element) : element;
      this.cacheEl = this.element;
      this.config = _objectSpread({}, Default, options);
      this.cacheConfig = this.config;
      this.disposed = false;
      this.ulArr = [];
      this.listenerOb = [];
      this.init();
    }

    var _proto = MetisMenu.prototype;

    _proto.update = function update() {
      this.disposed = false;
      this.element = this.cacheEl;
      this.config = this.cacheConfig;
      this.init();
    };

    _proto.dispose = function dispose() {
      for (var _iterator = this.listenerOb, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
        var _ref;

        if (_isArray) {
          if (_i >= _iterator.length) break;
          _ref = _iterator[_i++];
        } else {
          _i = _iterator.next();
          if (_i.done) break;
          _ref = _i.value;
        }

        var lo = _ref;

        for (var key in lo) {
          if (lo.hasOwnProperty(key)) {
            var el = lo[key];
            el[1].removeEventListener(el[0], el[2]);
          }
        }
      }

      this.ulArr = [];
      this.listenerOb = [];
      this.config = null;
      this.element = null;
      this.disposed = true;
    };

    _proto.on = function on(event, fn) {
      this.element.addEventListener(event, fn, false);
      return this;
    };

    _proto.off = function off(event, fn) {
      this.element.removeEventListener(event, fn);
      return this;
    };

    _proto.emit = function emit(event, eventDetail, shouldBubble) {
      if (shouldBubble === void 0) {
        shouldBubble = false;
      }

      var evt;

      if (typeof CustomEvent === "function") {
        evt = new CustomEvent(event, {
          bubbles: shouldBubble,
          detail: eventDetail
        });
      } else {
        evt = document.createEvent("CustomEvent");
        evt.initCustomEvent(event, shouldBubble, false, eventDetail);
      }

      this.element.dispatchEvent(evt);
      return this;
    };

    _proto.init = function init() {
      this.ulArr = [].slice.call(this.element.querySelectorAll(this.config.subMenu));

      for (var _iterator2 = this.ulArr, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
        var _ref2;

        if (_isArray2) {
          if (_i2 >= _iterator2.length) break;
          _ref2 = _iterator2[_i2++];
        } else {
          _i2 = _iterator2.next();
          if (_i2.done) break;
          _ref2 = _i2.value;
        }

        var ul = _ref2;
        var li = ul.parentNode;
        ul.classList.add(ClassNames.collapseClass);

        if (li.classList.contains(ClassNames.activeClass)) {
          this.show(ul);
        } else {
          this.hide(ul);
        }

        var a = li.querySelector(this.config.triggerElement);

        if (a.getAttribute("aria-disabled") === "true") {
          return;
        }

        a.setAttribute("aria-expanded", "false");
        var listenerOb = {
          aClick: ["click", a, this.clickEvent.bind(this)]
        };

        for (var key in listenerOb) {
          if (listenerOb.hasOwnProperty(key)) {
            var listener = listenerOb[key];
            listener[1].addEventListener(listener[0], listener[2]);
          }
        }

        this.listenerOb.push(listenerOb);
      }
    };

    _proto.clickEvent = function clickEvent(ev) {
      if (!this.disposed) {
        if (ev.currentTarget.tagName === "A") {
          ev.preventDefault();
        }

        var li = ev.target.parentNode;
        var ul = li.querySelector(this.config.subMenu);
        this.toggle(ul);
      }
    };

    _proto.toggle = function toggle(ul) {
      if (ul.parentNode.classList.contains(ClassNames.activeClass)) {
        this.hide(ul);
      } else {
        this.show(ul);
      }
    };

    _proto.show = function show(ul) {
      var _this = this;

      if (this.isTransitioning || ul.classList.contains(ClassNames.collapseInClass)) {
        return;
      }

      var complete = function complete() {
        ul.classList.remove(ClassNames.collapsingClass);
        ul.style.height = "";
        ul.removeEventListener("transitionend", complete);

        _this.setTransitioning(false);

        _this.emit("shown.metisMenu", {
          shownElement: ul
        });
      };

      var li = ul.parentNode;
      li.classList.add(ClassNames.activeClass);
      var a = li.querySelector(this.config.triggerElement);
      a.setAttribute("aria-expanded", "true");
      ul.style.height = "0px";
      ul.classList.remove(ClassNames.collapseClass);
      ul.classList.remove(ClassNames.collapseInClass);
      ul.classList.add(ClassNames.collapsingClass);
      var eleParentSiblins = [].slice.call(li.parentNode.children).filter(function (c) {
        return c !== li;
      });

      if (this.config.toggle && eleParentSiblins.length > 0) {
        for (var _iterator3 = eleParentSiblins, _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
          var _ref3;

          if (_isArray3) {
            if (_i3 >= _iterator3.length) break;
            _ref3 = _iterator3[_i3++];
          } else {
            _i3 = _iterator3.next();
            if (_i3.done) break;
            _ref3 = _i3.value;
          }

          var sibli = _ref3;
          var sibUl = sibli.querySelector(this.config.subMenu);

          if (sibUl !== null) {
            this.hide(sibUl);
          }
        }
      }

      this.setTransitioning(true);
      ul.classList.add(ClassNames.collapseClass);
      ul.classList.add(ClassNames.collapseInClass);
      ul.style.height = ul.scrollHeight + "px";
      this.emit("show.metisMenu", {
        showElement: ul
      });
      ul.addEventListener("transitionend", complete);
    };

    _proto.hide = function hide(ul) {
      var _this2 = this;

      if (this.isTransitioning || !ul.classList.contains(ClassNames.collapseInClass)) {
        return;
      }

      this.emit("hide.metisMenu", {
        hideElement: ul
      });
      var li = ul.parentNode;
      li.classList.remove(ClassNames.activeClass);

      var complete = function complete() {
        ul.classList.remove(ClassNames.collapsingClass);
        ul.classList.add(ClassNames.collapseClass);
        ul.removeEventListener("transitionend", complete);

        _this2.setTransitioning(false);

        _this2.emit("hidden.metisMenu", {
          hiddenElement: ul
        });
      };

      ul.style.height = ul.getBoundingClientRect().height + "px";
      ul.style.height = ul.offsetHeight + "px";
      ul.classList.add(ClassNames.collapsingClass);
      ul.classList.remove(ClassNames.collapseClass);
      ul.classList.remove(ClassNames.collapseInClass);
      this.setTransitioning(true);
      ul.addEventListener("transitionend", complete);
      ul.style.height = "0px";
      var a = li.querySelector(this.config.triggerElement);
      a.setAttribute("aria-expanded", "false");
    };

    _proto.setTransitioning = function setTransitioning(isTransitioning) {
      this.isTransitioning = isTransitioning;
    };

    return MetisMenu;
  }();

  return MetisMenu;

})));
//# sourceMappingURL=metisMenu.js.map
