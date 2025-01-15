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
})({"work6/script.js":[function(require,module,exports) {
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
},{}]