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
})({"script.js":[function(require,module,exports) {
// 360도 이미지 보기 기능 만들기
var make360Viewer = function make360Viewer($target) {
  // 필요한 변수들 선언
  var isDragging = false; // 드래그 중인지 체크
  var dragStartX = 0; // 드래그 시작한 x좌표
  var beforeSection = parseInt($target.style.getPropertyValue('--current-section')) || 0; // 이전 섹션값

  // 드래그 영역 계산하기
  var frameCount = parseInt($target.dataset.viewerNum);
  var containerWidth = $target.clientWidth; // 컨테이너 너비
  var oneSection = containerWidth / frameCount; // 한 섹션당 너비

  // 드래그할 때 섹션 업데이트하기
  function updateFrame(moveDistance) {
    // 원래 섹션 값 구하기
    var tempSection = Math.floor(Math.abs(moveDistance) / oneSection);

    // 현재 섹션 계산하기
    var nowSection;
    if (moveDistance < 0) {
      // 오른쪽으로 드래그
      nowSection = (beforeSection + tempSection + frameCount) % frameCount;
    } else {
      // 왼쪽으로 드래그
      nowSection = (beforeSection - tempSection + frameCount) % frameCount;
    }
    console.log('드래그 중>', {
      움직인거리: moveDistance,
      임시섹션: tempSection,
      현재섹션: nowSection,
      이전섹션: beforeSection
    });

    // CSS 변수 업데이트
    $target.style.setProperty('--current-section', nowSection);
  }

  // 마우스 이벤트
  function mouseStart(e) {
    isDragging = true;
    dragStartX = e.clientX;
    console.log('마우스 시작! x좌표:', dragStartX, '이전섹션:', beforeSection);
  }
  function mouseMove(e) {
    if (!isDragging) return;
    var nowX = e.clientX;
    var moveDistance = nowX - dragStartX;
    updateFrame(moveDistance);
  }

  // 터치 이벤트
  function touchStart(e) {
    isDragging = true;
    dragStartX = e.touches[0].clientX;
    console.log('터치 시작! x좌표:', dragStartX, '이전섹션:', beforeSection);
  }
  function touchMove(e) {
    if (!isDragging) return;
    e.preventDefault(); // 스크롤 막기

    var nowX = e.touches[0].clientX;
    var moveDistance = nowX - dragStartX;
    updateFrame(moveDistance);
  }

  // 드래그 끝났을 때
  function dragEnd() {
    if (!isDragging) return;
    isDragging = false;
    beforeSection = parseInt($target.style.getPropertyValue('--current-section')) || 0;
    console.log('끝! 마지막섹션:', beforeSection);
  }

  // 이벤트 달기
  function addEvents() {
    $target.addEventListener('mousedown', mouseStart);
    $target.addEventListener('touchstart', touchStart, {
      passive: false
    });
    window.addEventListener('mousemove', mouseMove);
    window.addEventListener('touchmove', touchMove, {
      passive: false
    });
    window.addEventListener('mouseup', dragEnd);
    window.addEventListener('touchend', dragEnd);
    window.addEventListener('mouseleave', dragEnd);
  }

  // 이벤트 제거하기
  function removeEvents() {
    $target.removeEventListener('mousedown', mouseStart);
    $target.removeEventListener('touchstart', touchStart, {
      passive: false
    });
    window.removeEventListener('mousemove', mouseMove);
    window.removeEventListener('touchmove', touchMove, {
      passive: false
    });
    window.removeEventListener('mouseup', dragEnd);
    window.removeEventListener('touchend', dragEnd);
    window.removeEventListener('mouseleave', dragEnd);
  }

  // 시작할 때 이벤트 달기
  addEvents();

  // 나중에 이벤트 제거할 수 있게 함수 돌려주기
  return removeEvents;
};

// 페이지 시작하면 실행할 함수
var start360Viewer = function start360Viewer() {
  // data-product-viewer 있는거 전부 찾기
  var $viewers = document.querySelectorAll("[data-product-viewer]");
  var cleanups = []; // 이벤트 제거 함수 모아두기

  // 찾은거 하나씩 처리하기
  $viewers.forEach(function ($viewer) {
    var frameCount = parseInt($viewer.dataset.viewerNum);

    // CSS 변수 설정
    $viewer.style.setProperty('--move-value', 100 / frameCount + '%');
    $viewer.style.setProperty('--move', '0');
    $viewer.style.setProperty('--current-section', '0');
    $viewer.style.setProperty('--view-num', frameCount);

    // 360 기능 적용하고 이벤트 제거 함수 저장
    var cleanup = make360Viewer($viewer);
    cleanups.push(cleanup);
    console.log('뷰어 설정 완료!', $viewer, '프레임:', frameCount);
  });

  // 화면 크기 바뀔 때 처리
  var resizeTimer;
  window.addEventListener('resize', function () {
    // 화면 바뀔때마다 실행하면 버벅이니까 좀 기다렸다가 한번만 실행
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      console.log('화면 크기 바뀜! 다시 설정하기');

      // 이벤트 다 제거하고
      cleanups.forEach(function (cleanup) {
        return cleanup();
      });
      cleanups.length = 0;

      // 다시 설정하기
      $viewers.forEach(function ($viewer) {
        var cleanup = make360Viewer($viewer);
        cleanups.push(cleanup);
      });
    }, 150); // 0.15초 기다렸다가 실행
  });
};

// 페이지 로드되면 시작!
window.addEventListener('load', start360Viewer);
},{}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;
function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}
module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "0.0.0.0" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "51317" + '/');
  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);
    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);
          if (didAccept) {
            handled = true;
          }
        }
      });

      // Enable HMR for CSS by default.
      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });
      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }
    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }
    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }
    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}
function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}
function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}
function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }
  var parents = [];
  var k, d, dep;
  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }
  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }
  return parents;
}
function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}
function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }
  if (checkedAssets[id]) {
    return;
  }
  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }
  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}
function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }
  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }
  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","script.js"], null)
//# sourceMappingURL=/script.75da7f30.js.map