// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"work5/script.js":[function(require,module,exports) {
(function () {
  var article = document.querySelector('.article--drawer');
  var drawerCtn = article.querySelector('.drawer__ctn');
  var dimmed = article.querySelector('.dimmed');
  var drawerButton = article.querySelector('button');
  var openClass = "is-open";
  var aniClass = "has-easing";
  var viewHeight = document.documentElement.getBoundingClientRect().height / 2;

  // Initialize movement tracking variables
  var startY = 0;
  var moveY = 0;
  var isMouseMove = false;
  drawerButton.addEventListener("click", function (e) {
    article.classList.add(openClass);
    drawerCtn.classList.add(aniClass);
  });
  dimmed.addEventListener("click", function (e) {
    article.classList.remove(openClass);
  });
  drawerCtn.addEventListener('mousedown', function (e) {
    e.preventDefault();
    drawerCtn.classList.remove(aniClass);
    startY = e.clientY;
    currentY = article.offsetTop;
    isMouseMove = true;
  });
  drawerCtn.addEventListener('mousemove', function (e) {
    if (!isMouseMove) return;
    e.preventDefault();
    console.log(e.clientY, startY);
    var deltaY = e.clientY - startY;
    moveY = currentY + deltaY;
    article.style.setProperty('--drawer-ctn-y', "".concat(moveY, "px"));
  });
  drawerCtn.addEventListener('mouseup', function (e) {
    e.preventDefault();
    drawerCtn.classList.add(aniClass);
    if (isMouseMove) {
      isMouseMove = false;
      if (viewHeight > (moveY || 0)) {
        // Add null check
        article.style.setProperty('--drawer-ctn-y', "0%");
      } else {
        article.classList.remove(openClass);
        article.style.setProperty('--drawer-ctn-y', "0%");
      }
    }
  });
  drawerCtn.addEventListener('mouseleave', function (e) {
    if (!isMouseMove) return; // 드래그 중일 때만 실행

    e.preventDefault();
    drawerCtn.classList.add(aniClass);
    isMouseMove = false;
    if (viewHeight > (moveY || 0)) {
      article.style.setProperty('--drawer-ctn-y', "0%");
    } else {
      article.classList.remove(openClass);
      article.style.setProperty('--drawer-ctn-y', "0%");
    }
  });
  function getTouchPos(e) {
    if (!e.touches || !e.touches[0]) return {
      y: 0
    }; // Add error handling
    return {
      y: e.touches[0].clientY - e.target.offsetTop + document.documentElement.scrollTop
    };
  }
  drawerCtn.addEventListener('touchstart', function (e) {
    drawerCtn.classList.remove(aniClass);
    var _getTouchPos = getTouchPos(e),
      y = _getTouchPos.y;
    startY = y;
  });
  drawerCtn.addEventListener('touchmove', function (e) {
    e.preventDefault();
    var _getTouchPos2 = getTouchPos(e),
      y = _getTouchPos2.y;
    moveY = y;
    var diffY = moveY - startY;
    if (diffY > 0) {
      article.style.setProperty('--drawer-ctn-y', "".concat(diffY, "px"));
    }
  });
  drawerCtn.addEventListener('touchend', function (e) {
    e.preventDefault();
    drawerCtn.classList.add(aniClass);
    if (viewHeight > (moveY || 0)) {
      // Add null check
      article.style.setProperty('--drawer-ctn-y', "0%");
    } else {
      article.classList.remove(openClass);
      article.style.setProperty('--drawer-ctn-y', "0%");
    }
  });
})();
},{}]