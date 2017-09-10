/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Engine__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Renderer__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__lib_stats_min__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__lib_stats_min___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__lib_stats_min__);



// import PIXI from '../lib/pixi.min';

const stats = new __WEBPACK_IMPORTED_MODULE_2__lib_stats_min___default.a();
stats.showPanel(0);
document.body.appendChild(stats.dom);

const pixelsPerCell = 3,
  cols = Math.ceil(window.innerWidth / pixelsPerCell),
  rows = Math.ceil(window.innerHeight / pixelsPerCell),
  renderer = new __WEBPACK_IMPORTED_MODULE_1__Renderer__["a" /* default */](cols, rows, pixelsPerCell, pixelsPerCell),
  engine = new __WEBPACK_IMPORTED_MODULE_0__Engine__["a" /* default */](
    cols, //number of columns
    rows, //number of rows
    renderer.render, //onTick
    60, //desired fps
    stats
  );

renderer.onDraw = engine.onDraw;
window.onload = engine.start;


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__World__ = __webpack_require__(2);


class Engine {
  constructor(cols, rows, onTick, desiredFps, stats) {
    let engineTime = 0,
      frameNumber = 0,
      current = new __WEBPACK_IMPORTED_MODULE_0__World__["a" /* default */](rows, cols),
      next = new __WEBPACK_IMPORTED_MODULE_0__World__["a" /* default */](rows, cols);

    const computeNextState = () => {
      let nextState = 0;
      const diff = [];
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          let neighbors = current.neighbours(i, j),
            currentState = current.get(i, j);

          nextState = neighbors === 3 ? 1 : neighbors == 2 ? currentState : 0;
          next.set(i, j, nextState);

          if (currentState !== nextState) diff.push({ i, j, nextState });
        }
      }
      const temp = current;
      current = next;
      next = temp;
      return diff;
    };

    const tick = timeStamp => {
      stats.begin();
      const elapsed = timeStamp - engineTime;
      if (elapsed > 1000 / desiredFps) {
        const diff = computeNextState();
        frameNumber += 1;
        engineTime = timeStamp - elapsed % (1000 / desiredFps);
        onTick(current, diff);
      }
      stats.end();
      window.requestAnimationFrame(tick);
    };

    this.start = () => {
      window.requestAnimationFrame(tick);
    };

    this.onDraw = (i, j) => {
      current.cross(i, j);
    };
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Engine;



/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class World {
  constructor(rows, cols) {
    const arr = new Uint8Array(new ArrayBuffer(rows * cols)),
      index = (i, j) => i * cols + j;

    this.get = (i, j) =>
      i >= 0 && i < rows && j >= 0 && j < cols ? arr[index(i, j)] : undefined;

    this.set = (i, j, val) => (arr[index(i, j)] = val);

    this.cross = (i, j) => {
      if (i - 1 > 0) arr[index(i - 1, j)] = 1;
      if (j - 1 > 0) arr[index(i, j - 1)] = 1;
      arr[index(i, j)] = 1;
      if (j + 1 > cols) arr[index(i, j + 1)] = 1;
      if (i + 1 < rows) arr[index(i + 1, j)] = 1;
    };

    this.neighbours = (i, j) =>
      (this.get(i - 1, j - 1) || 0) +
      (this.get(i - 1, j) || 0) +
      (this.get(i - 1, j + 1) || 0) +
      (this.get(i, j - 1) || 0) +
      (this.get(i, j + 1) || 0) +
      (this.get(i + 1, j - 1) || 0) +
      (this.get(i + 1, j) || 0) +
      (this.get(i + 1, j + 1) || 0);

    //random start
    for (let i = 0; i < arr.length; i++) arr[i] = Math.round(Math.random());
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = World;



/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Renderer {
  constructor(cols, rows, cellWidth, cellHeight) {
    const renderer = PIXI.autoDetectRenderer(256, 256, {
      antialias: false,
      transparent: false,
      resolution: 1
    });
    renderer.view.style.position = 'absolute';
    renderer.view.style.display = 'block';
    renderer.autoResize = true;
    renderer.resize(window.innerWidth, window.innerHeight);
    renderer.backgroundColor = 0x000000;
    document.body.appendChild(renderer.view);
    const stage = new PIXI.Container();
    stage.interactive = true;
    const graphics = new PIXI.Graphics();
    stage.addChild(graphics);
    renderer.render(stage);

    let mouseDown = false;

    const onDraw = event => {
      if (!mouseDown) return;
      const mousePos = {
        x: event.data.originalEvent.clientX * stage.width / stage.width,
        y: event.data.originalEvent.clientY * stage.height / stage.height
      };
      const pos = {
        i: ~~(mousePos.y / cellHeight),
        j: ~~(mousePos.x / cellWidth)
      };

      this.onDraw(pos.i, pos.j);
    };

    stage.on('pointerdown', evt => {
      mouseDown = true;
      onDraw(evt);
    });

    stage.on('pointermove', onDraw);
    stage.on('pointerup', evt => (mouseDown = false));

    this.render = (world, diff) => {
      graphics.beginFill(0xffffff);
      diff
        .filter(cell => cell.nextState === 1)
        .forEach(cell =>
          graphics.drawRect(
            cell.j * cellWidth,
            cell.i * cellHeight,
            cellWidth,
            cellHeight
          )
        );
      graphics.endFill();
      graphics.beginFill(0x000000);
      diff
        .filter(cell => cell.nextState !== 1)
        .forEach(cell =>
          graphics.drawRect(
            cell.j * cellWidth,
            cell.i * cellHeight,
            cellWidth,
            cellHeight
          )
        );

      graphics.endFill();
      renderer.render(stage);
    };
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Renderer;



/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

// stats.js - http://github.com/mrdoob/stats.js
(function(f,e){ true?module.exports=e():"function"===typeof define&&define.amd?define(e):f.Stats=e()})(this,function(){var f=function(){function e(a){c.appendChild(a.dom);return a}function u(a){for(var d=0;d<c.children.length;d++)c.children[d].style.display=d===a?"block":"none";l=a}var l=0,c=document.createElement("div");c.style.cssText="position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000";c.addEventListener("click",function(a){a.preventDefault();
u(++l%c.children.length)},!1);var k=(performance||Date).now(),g=k,a=0,r=e(new f.Panel("FPS","#0ff","#002")),h=e(new f.Panel("MS","#0f0","#020"));if(self.performance&&self.performance.memory)var t=e(new f.Panel("MB","#f08","#201"));u(0);return{REVISION:16,dom:c,addPanel:e,showPanel:u,begin:function(){k=(performance||Date).now()},end:function(){a++;var c=(performance||Date).now();h.update(c-k,200);if(c>g+1E3&&(r.update(1E3*a/(c-g),100),g=c,a=0,t)){var d=performance.memory;t.update(d.usedJSHeapSize/
1048576,d.jsHeapSizeLimit/1048576)}return c},update:function(){k=this.end()},domElement:c,setMode:u}};f.Panel=function(e,f,l){var c=Infinity,k=0,g=Math.round,a=g(window.devicePixelRatio||1),r=80*a,h=48*a,t=3*a,v=2*a,d=3*a,m=15*a,n=74*a,p=30*a,q=document.createElement("canvas");q.width=r;q.height=h;q.style.cssText="width:80px;height:48px";var b=q.getContext("2d");b.font="bold "+9*a+"px Helvetica,Arial,sans-serif";b.textBaseline="top";b.fillStyle=l;b.fillRect(0,0,r,h);b.fillStyle=f;b.fillText(e,t,v);
b.fillRect(d,m,n,p);b.fillStyle=l;b.globalAlpha=.9;b.fillRect(d,m,n,p);return{dom:q,update:function(h,w){c=Math.min(c,h);k=Math.max(k,h);b.fillStyle=l;b.globalAlpha=1;b.fillRect(0,0,r,m);b.fillStyle=f;b.fillText(g(h)+" "+e+" ("+g(c)+"-"+g(k)+")",t,v);b.drawImage(q,d+a,m,n-a,p,d,m,n-a,p);b.fillRect(d+n-a,m,a,p);b.fillStyle=l;b.globalAlpha=.9;b.fillRect(d+n-a,m,a,g((1-h/w)*p))}}};return f});


/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMzZmY2Y4NzgxOTdiNWQwZWJjN2QiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FwcC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvRW5naW5lLmpzIiwid2VicGFjazovLy8uL3NyYy9Xb3JsZC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvUmVuZGVyZXIuanMiLCJ3ZWJwYWNrOi8vLy4vbGliL3N0YXRzLm1pbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7QUM3REE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7O0FDdEJBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIsVUFBVTtBQUMvQix1QkFBdUIsVUFBVTtBQUNqQztBQUNBOztBQUVBO0FBQ0E7O0FBRUEscURBQXFELGtCQUFrQjtBQUN2RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBOzs7Ozs7OztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLG1CQUFtQixnQkFBZ0I7QUFDbkM7QUFDQTtBQUFBO0FBQUE7Ozs7Ozs7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTs7Ozs7OztBQ3hFQTtBQUNBLGVBQWUsc0ZBQXVJLGtCQUFrQixpQkFBaUIsY0FBYyxxQkFBcUIsU0FBUyxjQUFjLFlBQVksb0JBQW9CLHFEQUFxRCxJQUFJLHdDQUF3QyxnQ0FBZ0MsTUFBTSxPQUFPLGVBQWUsWUFBWSxlQUFlLHVDQUF1QztBQUNsZix5QkFBeUIsS0FBSyxtSEFBbUgsc0ZBQXNGLEtBQUssT0FBTywwREFBMEQsNEJBQTRCLGdCQUFnQixJQUFJLGdDQUFnQyxrQkFBa0IsbURBQW1ELHlCQUF5QjtBQUMzZCxtQ0FBbUMsU0FBUyxtQkFBbUIsYUFBYSwwQkFBMEIsd0JBQXdCLHdKQUF3SixVQUFVLFdBQVcsNEJBQTRCLGFBQWEseUJBQXlCLG1EQUFtRCxxQkFBcUIsY0FBYyxvQkFBb0IsY0FBYztBQUNyZSxvQkFBb0IsY0FBYyxpQkFBaUIsb0JBQW9CLE9BQU8sMkJBQTJCLGdCQUFnQixnQkFBZ0IsY0FBYyxnQkFBZ0Isb0JBQW9CLGNBQWMsa0RBQWtELHFDQUFxQyx3QkFBd0IsY0FBYyxpQkFBaUIsc0NBQXNDLFNBQVMiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgMzZmY2Y4NzgxOTdiNWQwZWJjN2QiLCJpbXBvcnQgRW5naW5lIGZyb20gJy4vRW5naW5lJztcclxuaW1wb3J0IFJlbmRlcmVyIGZyb20gJy4vUmVuZGVyZXInO1xyXG5pbXBvcnQgU3RhdHMgZnJvbSAnLi4vbGliL3N0YXRzLm1pbic7XHJcbi8vIGltcG9ydCBQSVhJIGZyb20gJy4uL2xpYi9waXhpLm1pbic7XHJcblxyXG5jb25zdCBzdGF0cyA9IG5ldyBTdGF0cygpO1xyXG5zdGF0cy5zaG93UGFuZWwoMCk7XHJcbmRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoc3RhdHMuZG9tKTtcclxuXHJcbmNvbnN0IHBpeGVsc1BlckNlbGwgPSAzLFxyXG4gIGNvbHMgPSBNYXRoLmNlaWwod2luZG93LmlubmVyV2lkdGggLyBwaXhlbHNQZXJDZWxsKSxcclxuICByb3dzID0gTWF0aC5jZWlsKHdpbmRvdy5pbm5lckhlaWdodCAvIHBpeGVsc1BlckNlbGwpLFxyXG4gIHJlbmRlcmVyID0gbmV3IFJlbmRlcmVyKGNvbHMsIHJvd3MsIHBpeGVsc1BlckNlbGwsIHBpeGVsc1BlckNlbGwpLFxyXG4gIGVuZ2luZSA9IG5ldyBFbmdpbmUoXHJcbiAgICBjb2xzLCAvL251bWJlciBvZiBjb2x1bW5zXHJcbiAgICByb3dzLCAvL251bWJlciBvZiByb3dzXHJcbiAgICByZW5kZXJlci5yZW5kZXIsIC8vb25UaWNrXHJcbiAgICA2MCwgLy9kZXNpcmVkIGZwc1xyXG4gICAgc3RhdHNcclxuICApO1xyXG5cclxucmVuZGVyZXIub25EcmF3ID0gZW5naW5lLm9uRHJhdztcclxud2luZG93Lm9ubG9hZCA9IGVuZ2luZS5zdGFydDtcclxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvYXBwLmpzXG4vLyBtb2R1bGUgaWQgPSAwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCBXb3JsZCBmcm9tICcuL1dvcmxkJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRW5naW5lIHtcbiAgY29uc3RydWN0b3IoY29scywgcm93cywgb25UaWNrLCBkZXNpcmVkRnBzLCBzdGF0cykge1xuICAgIGxldCBlbmdpbmVUaW1lID0gMCxcbiAgICAgIGZyYW1lTnVtYmVyID0gMCxcbiAgICAgIGN1cnJlbnQgPSBuZXcgV29ybGQocm93cywgY29scyksXG4gICAgICBuZXh0ID0gbmV3IFdvcmxkKHJvd3MsIGNvbHMpO1xuXG4gICAgY29uc3QgY29tcHV0ZU5leHRTdGF0ZSA9ICgpID0+IHtcbiAgICAgIGxldCBuZXh0U3RhdGUgPSAwO1xuICAgICAgY29uc3QgZGlmZiA9IFtdO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByb3dzOyBpKyspIHtcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBjb2xzOyBqKyspIHtcbiAgICAgICAgICBsZXQgbmVpZ2hib3JzID0gY3VycmVudC5uZWlnaGJvdXJzKGksIGopLFxuICAgICAgICAgICAgY3VycmVudFN0YXRlID0gY3VycmVudC5nZXQoaSwgaik7XG5cbiAgICAgICAgICBuZXh0U3RhdGUgPSBuZWlnaGJvcnMgPT09IDMgPyAxIDogbmVpZ2hib3JzID09IDIgPyBjdXJyZW50U3RhdGUgOiAwO1xuICAgICAgICAgIG5leHQuc2V0KGksIGosIG5leHRTdGF0ZSk7XG5cbiAgICAgICAgICBpZiAoY3VycmVudFN0YXRlICE9PSBuZXh0U3RhdGUpIGRpZmYucHVzaCh7IGksIGosIG5leHRTdGF0ZSB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgY29uc3QgdGVtcCA9IGN1cnJlbnQ7XG4gICAgICBjdXJyZW50ID0gbmV4dDtcbiAgICAgIG5leHQgPSB0ZW1wO1xuICAgICAgcmV0dXJuIGRpZmY7XG4gICAgfTtcblxuICAgIGNvbnN0IHRpY2sgPSB0aW1lU3RhbXAgPT4ge1xuICAgICAgc3RhdHMuYmVnaW4oKTtcbiAgICAgIGNvbnN0IGVsYXBzZWQgPSB0aW1lU3RhbXAgLSBlbmdpbmVUaW1lO1xuICAgICAgaWYgKGVsYXBzZWQgPiAxMDAwIC8gZGVzaXJlZEZwcykge1xuICAgICAgICBjb25zdCBkaWZmID0gY29tcHV0ZU5leHRTdGF0ZSgpO1xuICAgICAgICBmcmFtZU51bWJlciArPSAxO1xuICAgICAgICBlbmdpbmVUaW1lID0gdGltZVN0YW1wIC0gZWxhcHNlZCAlICgxMDAwIC8gZGVzaXJlZEZwcyk7XG4gICAgICAgIG9uVGljayhjdXJyZW50LCBkaWZmKTtcbiAgICAgIH1cbiAgICAgIHN0YXRzLmVuZCgpO1xuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aWNrKTtcbiAgICB9O1xuXG4gICAgdGhpcy5zdGFydCA9ICgpID0+IHtcbiAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGljayk7XG4gICAgfTtcblxuICAgIHRoaXMub25EcmF3ID0gKGksIGopID0+IHtcbiAgICAgIGN1cnJlbnQuY3Jvc3MoaSwgaik7XG4gICAgfTtcbiAgfVxufVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvRW5naW5lLmpzXG4vLyBtb2R1bGUgaWQgPSAxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIFdvcmxkIHtcbiAgY29uc3RydWN0b3Iocm93cywgY29scykge1xuICAgIGNvbnN0IGFyciA9IG5ldyBVaW50OEFycmF5KG5ldyBBcnJheUJ1ZmZlcihyb3dzICogY29scykpLFxuICAgICAgaW5kZXggPSAoaSwgaikgPT4gaSAqIGNvbHMgKyBqO1xuXG4gICAgdGhpcy5nZXQgPSAoaSwgaikgPT5cbiAgICAgIGkgPj0gMCAmJiBpIDwgcm93cyAmJiBqID49IDAgJiYgaiA8IGNvbHMgPyBhcnJbaW5kZXgoaSwgaildIDogdW5kZWZpbmVkO1xuXG4gICAgdGhpcy5zZXQgPSAoaSwgaiwgdmFsKSA9PiAoYXJyW2luZGV4KGksIGopXSA9IHZhbCk7XG5cbiAgICB0aGlzLmNyb3NzID0gKGksIGopID0+IHtcbiAgICAgIGlmIChpIC0gMSA+IDApIGFycltpbmRleChpIC0gMSwgaildID0gMTtcbiAgICAgIGlmIChqIC0gMSA+IDApIGFycltpbmRleChpLCBqIC0gMSldID0gMTtcbiAgICAgIGFycltpbmRleChpLCBqKV0gPSAxO1xuICAgICAgaWYgKGogKyAxID4gY29scykgYXJyW2luZGV4KGksIGogKyAxKV0gPSAxO1xuICAgICAgaWYgKGkgKyAxIDwgcm93cykgYXJyW2luZGV4KGkgKyAxLCBqKV0gPSAxO1xuICAgIH07XG5cbiAgICB0aGlzLm5laWdoYm91cnMgPSAoaSwgaikgPT5cbiAgICAgICh0aGlzLmdldChpIC0gMSwgaiAtIDEpIHx8IDApICtcbiAgICAgICh0aGlzLmdldChpIC0gMSwgaikgfHwgMCkgK1xuICAgICAgKHRoaXMuZ2V0KGkgLSAxLCBqICsgMSkgfHwgMCkgK1xuICAgICAgKHRoaXMuZ2V0KGksIGogLSAxKSB8fCAwKSArXG4gICAgICAodGhpcy5nZXQoaSwgaiArIDEpIHx8IDApICtcbiAgICAgICh0aGlzLmdldChpICsgMSwgaiAtIDEpIHx8IDApICtcbiAgICAgICh0aGlzLmdldChpICsgMSwgaikgfHwgMCkgK1xuICAgICAgKHRoaXMuZ2V0KGkgKyAxLCBqICsgMSkgfHwgMCk7XG5cbiAgICAvL3JhbmRvbSBzdGFydFxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSBhcnJbaV0gPSBNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkpO1xuICB9XG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9Xb3JsZC5qc1xuLy8gbW9kdWxlIGlkID0gMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBSZW5kZXJlciB7XG4gIGNvbnN0cnVjdG9yKGNvbHMsIHJvd3MsIGNlbGxXaWR0aCwgY2VsbEhlaWdodCkge1xuICAgIGNvbnN0IHJlbmRlcmVyID0gUElYSS5hdXRvRGV0ZWN0UmVuZGVyZXIoMjU2LCAyNTYsIHtcbiAgICAgIGFudGlhbGlhczogZmFsc2UsXG4gICAgICB0cmFuc3BhcmVudDogZmFsc2UsXG4gICAgICByZXNvbHV0aW9uOiAxXG4gICAgfSk7XG4gICAgcmVuZGVyZXIudmlldy5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgcmVuZGVyZXIudmlldy5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICByZW5kZXJlci5hdXRvUmVzaXplID0gdHJ1ZTtcbiAgICByZW5kZXJlci5yZXNpemUod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCk7XG4gICAgcmVuZGVyZXIuYmFja2dyb3VuZENvbG9yID0gMHgwMDAwMDA7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChyZW5kZXJlci52aWV3KTtcbiAgICBjb25zdCBzdGFnZSA9IG5ldyBQSVhJLkNvbnRhaW5lcigpO1xuICAgIHN0YWdlLmludGVyYWN0aXZlID0gdHJ1ZTtcbiAgICBjb25zdCBncmFwaGljcyA9IG5ldyBQSVhJLkdyYXBoaWNzKCk7XG4gICAgc3RhZ2UuYWRkQ2hpbGQoZ3JhcGhpY3MpO1xuICAgIHJlbmRlcmVyLnJlbmRlcihzdGFnZSk7XG5cbiAgICBsZXQgbW91c2VEb3duID0gZmFsc2U7XG5cbiAgICBjb25zdCBvbkRyYXcgPSBldmVudCA9PiB7XG4gICAgICBpZiAoIW1vdXNlRG93bikgcmV0dXJuO1xuICAgICAgY29uc3QgbW91c2VQb3MgPSB7XG4gICAgICAgIHg6IGV2ZW50LmRhdGEub3JpZ2luYWxFdmVudC5jbGllbnRYICogc3RhZ2Uud2lkdGggLyBzdGFnZS53aWR0aCxcbiAgICAgICAgeTogZXZlbnQuZGF0YS5vcmlnaW5hbEV2ZW50LmNsaWVudFkgKiBzdGFnZS5oZWlnaHQgLyBzdGFnZS5oZWlnaHRcbiAgICAgIH07XG4gICAgICBjb25zdCBwb3MgPSB7XG4gICAgICAgIGk6IH5+KG1vdXNlUG9zLnkgLyBjZWxsSGVpZ2h0KSxcbiAgICAgICAgajogfn4obW91c2VQb3MueCAvIGNlbGxXaWR0aClcbiAgICAgIH07XG5cbiAgICAgIHRoaXMub25EcmF3KHBvcy5pLCBwb3Muaik7XG4gICAgfTtcblxuICAgIHN0YWdlLm9uKCdwb2ludGVyZG93bicsIGV2dCA9PiB7XG4gICAgICBtb3VzZURvd24gPSB0cnVlO1xuICAgICAgb25EcmF3KGV2dCk7XG4gICAgfSk7XG5cbiAgICBzdGFnZS5vbigncG9pbnRlcm1vdmUnLCBvbkRyYXcpO1xuICAgIHN0YWdlLm9uKCdwb2ludGVydXAnLCBldnQgPT4gKG1vdXNlRG93biA9IGZhbHNlKSk7XG5cbiAgICB0aGlzLnJlbmRlciA9ICh3b3JsZCwgZGlmZikgPT4ge1xuICAgICAgZ3JhcGhpY3MuYmVnaW5GaWxsKDB4ZmZmZmZmKTtcbiAgICAgIGRpZmZcbiAgICAgICAgLmZpbHRlcihjZWxsID0+IGNlbGwubmV4dFN0YXRlID09PSAxKVxuICAgICAgICAuZm9yRWFjaChjZWxsID0+XG4gICAgICAgICAgZ3JhcGhpY3MuZHJhd1JlY3QoXG4gICAgICAgICAgICBjZWxsLmogKiBjZWxsV2lkdGgsXG4gICAgICAgICAgICBjZWxsLmkgKiBjZWxsSGVpZ2h0LFxuICAgICAgICAgICAgY2VsbFdpZHRoLFxuICAgICAgICAgICAgY2VsbEhlaWdodFxuICAgICAgICAgIClcbiAgICAgICAgKTtcbiAgICAgIGdyYXBoaWNzLmVuZEZpbGwoKTtcbiAgICAgIGdyYXBoaWNzLmJlZ2luRmlsbCgweDAwMDAwMCk7XG4gICAgICBkaWZmXG4gICAgICAgIC5maWx0ZXIoY2VsbCA9PiBjZWxsLm5leHRTdGF0ZSAhPT0gMSlcbiAgICAgICAgLmZvckVhY2goY2VsbCA9PlxuICAgICAgICAgIGdyYXBoaWNzLmRyYXdSZWN0KFxuICAgICAgICAgICAgY2VsbC5qICogY2VsbFdpZHRoLFxuICAgICAgICAgICAgY2VsbC5pICogY2VsbEhlaWdodCxcbiAgICAgICAgICAgIGNlbGxXaWR0aCxcbiAgICAgICAgICAgIGNlbGxIZWlnaHRcbiAgICAgICAgICApXG4gICAgICAgICk7XG5cbiAgICAgIGdyYXBoaWNzLmVuZEZpbGwoKTtcbiAgICAgIHJlbmRlcmVyLnJlbmRlcihzdGFnZSk7XG4gICAgfTtcbiAgfVxufVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvUmVuZGVyZXIuanNcbi8vIG1vZHVsZSBpZCA9IDNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gc3RhdHMuanMgLSBodHRwOi8vZ2l0aHViLmNvbS9tcmRvb2Ivc3RhdHMuanNcbihmdW5jdGlvbihmLGUpe1wib2JqZWN0XCI9PT10eXBlb2YgZXhwb3J0cyYmXCJ1bmRlZmluZWRcIiE9PXR5cGVvZiBtb2R1bGU/bW9kdWxlLmV4cG9ydHM9ZSgpOlwiZnVuY3Rpb25cIj09PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKGUpOmYuU3RhdHM9ZSgpfSkodGhpcyxmdW5jdGlvbigpe3ZhciBmPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gZShhKXtjLmFwcGVuZENoaWxkKGEuZG9tKTtyZXR1cm4gYX1mdW5jdGlvbiB1KGEpe2Zvcih2YXIgZD0wO2Q8Yy5jaGlsZHJlbi5sZW5ndGg7ZCsrKWMuY2hpbGRyZW5bZF0uc3R5bGUuZGlzcGxheT1kPT09YT9cImJsb2NrXCI6XCJub25lXCI7bD1hfXZhciBsPTAsYz1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO2Muc3R5bGUuY3NzVGV4dD1cInBvc2l0aW9uOmZpeGVkO3RvcDowO2xlZnQ6MDtjdXJzb3I6cG9pbnRlcjtvcGFjaXR5OjAuOTt6LWluZGV4OjEwMDAwXCI7Yy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIixmdW5jdGlvbihhKXthLnByZXZlbnREZWZhdWx0KCk7XG51KCsrbCVjLmNoaWxkcmVuLmxlbmd0aCl9LCExKTt2YXIgaz0ocGVyZm9ybWFuY2V8fERhdGUpLm5vdygpLGc9ayxhPTAscj1lKG5ldyBmLlBhbmVsKFwiRlBTXCIsXCIjMGZmXCIsXCIjMDAyXCIpKSxoPWUobmV3IGYuUGFuZWwoXCJNU1wiLFwiIzBmMFwiLFwiIzAyMFwiKSk7aWYoc2VsZi5wZXJmb3JtYW5jZSYmc2VsZi5wZXJmb3JtYW5jZS5tZW1vcnkpdmFyIHQ9ZShuZXcgZi5QYW5lbChcIk1CXCIsXCIjZjA4XCIsXCIjMjAxXCIpKTt1KDApO3JldHVybntSRVZJU0lPTjoxNixkb206YyxhZGRQYW5lbDplLHNob3dQYW5lbDp1LGJlZ2luOmZ1bmN0aW9uKCl7az0ocGVyZm9ybWFuY2V8fERhdGUpLm5vdygpfSxlbmQ6ZnVuY3Rpb24oKXthKys7dmFyIGM9KHBlcmZvcm1hbmNlfHxEYXRlKS5ub3coKTtoLnVwZGF0ZShjLWssMjAwKTtpZihjPmcrMUUzJiYoci51cGRhdGUoMUUzKmEvKGMtZyksMTAwKSxnPWMsYT0wLHQpKXt2YXIgZD1wZXJmb3JtYW5jZS5tZW1vcnk7dC51cGRhdGUoZC51c2VkSlNIZWFwU2l6ZS9cbjEwNDg1NzYsZC5qc0hlYXBTaXplTGltaXQvMTA0ODU3Nil9cmV0dXJuIGN9LHVwZGF0ZTpmdW5jdGlvbigpe2s9dGhpcy5lbmQoKX0sZG9tRWxlbWVudDpjLHNldE1vZGU6dX19O2YuUGFuZWw9ZnVuY3Rpb24oZSxmLGwpe3ZhciBjPUluZmluaXR5LGs9MCxnPU1hdGgucm91bmQsYT1nKHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvfHwxKSxyPTgwKmEsaD00OCphLHQ9MyphLHY9MiphLGQ9MyphLG09MTUqYSxuPTc0KmEscD0zMCphLHE9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtxLndpZHRoPXI7cS5oZWlnaHQ9aDtxLnN0eWxlLmNzc1RleHQ9XCJ3aWR0aDo4MHB4O2hlaWdodDo0OHB4XCI7dmFyIGI9cS5nZXRDb250ZXh0KFwiMmRcIik7Yi5mb250PVwiYm9sZCBcIis5KmErXCJweCBIZWx2ZXRpY2EsQXJpYWwsc2Fucy1zZXJpZlwiO2IudGV4dEJhc2VsaW5lPVwidG9wXCI7Yi5maWxsU3R5bGU9bDtiLmZpbGxSZWN0KDAsMCxyLGgpO2IuZmlsbFN0eWxlPWY7Yi5maWxsVGV4dChlLHQsdik7XG5iLmZpbGxSZWN0KGQsbSxuLHApO2IuZmlsbFN0eWxlPWw7Yi5nbG9iYWxBbHBoYT0uOTtiLmZpbGxSZWN0KGQsbSxuLHApO3JldHVybntkb206cSx1cGRhdGU6ZnVuY3Rpb24oaCx3KXtjPU1hdGgubWluKGMsaCk7az1NYXRoLm1heChrLGgpO2IuZmlsbFN0eWxlPWw7Yi5nbG9iYWxBbHBoYT0xO2IuZmlsbFJlY3QoMCwwLHIsbSk7Yi5maWxsU3R5bGU9ZjtiLmZpbGxUZXh0KGcoaCkrXCIgXCIrZStcIiAoXCIrZyhjKStcIi1cIitnKGspK1wiKVwiLHQsdik7Yi5kcmF3SW1hZ2UocSxkK2EsbSxuLWEscCxkLG0sbi1hLHApO2IuZmlsbFJlY3QoZCtuLWEsbSxhLHApO2IuZmlsbFN0eWxlPWw7Yi5nbG9iYWxBbHBoYT0uOTtiLmZpbGxSZWN0KGQrbi1hLG0sYSxnKCgxLWgvdykqcCkpfX19O3JldHVybiBmfSk7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2xpYi9zdGF0cy5taW4uanNcbi8vIG1vZHVsZSBpZCA9IDRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==