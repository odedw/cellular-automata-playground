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

const pixelsPerCell = 4,
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
    const graphics = new PIXI.Graphics();
    stage.addChild(graphics);
    renderer.render(stage);

    let mouseDown = false;

    // const onDraw = event => {
    //   if (!mouseDown) return;

    //   const rect = canvas.getBoundingClientRect();
    //   const mousePos = {
    //     x: event.clientX * canvas.width / canvas.clientWidth,
    //     y: event.clientY * canvas.height / canvas.clientHeight
    //   };
    //   const pos = {
    //     i: ~~(mousePos.y / cellHeight),
    //     j: ~~(mousePos.x / cellWidth)
    //   };

    //   this.onDraw(pos.i, pos.j);
    // };

    // canvas.addEventListener('mousedown', evt => {
    //   mouseDown = true;
    //   onDraw(evt);
    // });

    // canvas.addEventListener('mousemove', onDraw);
    // canvas.addEventListener('mouseup', evt => (mouseDown = false));

    this.render = (world, diff) => {
      // context.clearRect(0, 0, canvas.width, canvas.height);
      graphics.beginFill(0xffffff);
      // context.beginPath();
      // context.fillStyle = 'rgba(255, 255, 255, 255)';
      diff.filter(cell => cell.nextState === 1).forEach(cell =>
        graphics.drawRect(
          //     context.fillRect(
          cell.j * cellWidth,
          cell.i * cellHeight,
          cellWidth,
          cellHeight
        )
      );
      graphics.endFill();
      graphics.beginFill(0x000000);
      // context.fillStyle = 'rgba(40, 40, 40, 255)';
      diff.filter(cell => cell.nextState !== 1).forEach(cell =>
        graphics.drawRect(
          // context.fillRect(
          cell.j * cellWidth,
          cell.i * cellHeight,
          cellWidth,
          cellHeight
        )
      );

      graphics.endFill();
      renderer.render(stage);

      // context.closePath();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNjQwMDBlYmZjZDcxOTdkNjczZDUiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FwcC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvRW5naW5lLmpzIiwid2VicGFjazovLy8uL3NyYy9Xb3JsZC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvUmVuZGVyZXIuanMiLCJ3ZWJwYWNrOi8vLy4vbGliL3N0YXRzLm1pbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7QUM3REE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7O0FDdEJBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIsVUFBVTtBQUMvQix1QkFBdUIsVUFBVTtBQUNqQztBQUNBOztBQUVBO0FBQ0E7O0FBRUEscURBQXFELGtCQUFrQjtBQUN2RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBOzs7Ozs7OztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLG1CQUFtQixnQkFBZ0I7QUFDbkM7QUFDQTtBQUFBO0FBQUE7Ozs7Ozs7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7O0FBRVI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBOzs7Ozs7O0FDN0VBO0FBQ0EsZUFBZSxzRkFBdUksa0JBQWtCLGlCQUFpQixjQUFjLHFCQUFxQixTQUFTLGNBQWMsWUFBWSxvQkFBb0IscURBQXFELElBQUksd0NBQXdDLGdDQUFnQyxNQUFNLE9BQU8sZUFBZSxZQUFZLGVBQWUsdUNBQXVDO0FBQ2xmLHlCQUF5QixLQUFLLG1IQUFtSCxzRkFBc0YsS0FBSyxPQUFPLDBEQUEwRCw0QkFBNEIsZ0JBQWdCLElBQUksZ0NBQWdDLGtCQUFrQixtREFBbUQseUJBQXlCO0FBQzNkLG1DQUFtQyxTQUFTLG1CQUFtQixhQUFhLDBCQUEwQix3QkFBd0Isd0pBQXdKLFVBQVUsV0FBVyw0QkFBNEIsYUFBYSx5QkFBeUIsbURBQW1ELHFCQUFxQixjQUFjLG9CQUFvQixjQUFjO0FBQ3JlLG9CQUFvQixjQUFjLGlCQUFpQixvQkFBb0IsT0FBTywyQkFBMkIsZ0JBQWdCLGdCQUFnQixjQUFjLGdCQUFnQixvQkFBb0IsY0FBYyxrREFBa0QscUNBQXFDLHdCQUF3QixjQUFjLGlCQUFpQixzQ0FBc0MsU0FBUyIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCA2NDAwMGViZmNkNzE5N2Q2NzNkNSIsImltcG9ydCBFbmdpbmUgZnJvbSAnLi9FbmdpbmUnO1xyXG5pbXBvcnQgUmVuZGVyZXIgZnJvbSAnLi9SZW5kZXJlcic7XHJcbmltcG9ydCBTdGF0cyBmcm9tICcuLi9saWIvc3RhdHMubWluJztcclxuLy8gaW1wb3J0IFBJWEkgZnJvbSAnLi4vbGliL3BpeGkubWluJztcclxuXHJcbmNvbnN0IHN0YXRzID0gbmV3IFN0YXRzKCk7XHJcbnN0YXRzLnNob3dQYW5lbCgwKTtcclxuZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChzdGF0cy5kb20pO1xyXG5cclxuY29uc3QgcGl4ZWxzUGVyQ2VsbCA9IDQsXHJcbiAgY29scyA9IE1hdGguY2VpbCh3aW5kb3cuaW5uZXJXaWR0aCAvIHBpeGVsc1BlckNlbGwpLFxyXG4gIHJvd3MgPSBNYXRoLmNlaWwod2luZG93LmlubmVySGVpZ2h0IC8gcGl4ZWxzUGVyQ2VsbCksXHJcbiAgcmVuZGVyZXIgPSBuZXcgUmVuZGVyZXIoY29scywgcm93cywgcGl4ZWxzUGVyQ2VsbCwgcGl4ZWxzUGVyQ2VsbCksXHJcbiAgZW5naW5lID0gbmV3IEVuZ2luZShcclxuICAgIGNvbHMsIC8vbnVtYmVyIG9mIGNvbHVtbnNcclxuICAgIHJvd3MsIC8vbnVtYmVyIG9mIHJvd3NcclxuICAgIHJlbmRlcmVyLnJlbmRlciwgLy9vblRpY2tcclxuICAgIDYwLCAvL2Rlc2lyZWQgZnBzXHJcbiAgICBzdGF0c1xyXG4gICk7XHJcblxyXG5yZW5kZXJlci5vbkRyYXcgPSBlbmdpbmUub25EcmF3O1xyXG53aW5kb3cub25sb2FkID0gZW5naW5lLnN0YXJ0O1xyXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9hcHAuanNcbi8vIG1vZHVsZSBpZCA9IDBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IFdvcmxkIGZyb20gJy4vV29ybGQnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFbmdpbmUge1xuICBjb25zdHJ1Y3Rvcihjb2xzLCByb3dzLCBvblRpY2ssIGRlc2lyZWRGcHMsIHN0YXRzKSB7XG4gICAgbGV0IGVuZ2luZVRpbWUgPSAwLFxuICAgICAgZnJhbWVOdW1iZXIgPSAwLFxuICAgICAgY3VycmVudCA9IG5ldyBXb3JsZChyb3dzLCBjb2xzKSxcbiAgICAgIG5leHQgPSBuZXcgV29ybGQocm93cywgY29scyk7XG5cbiAgICBjb25zdCBjb21wdXRlTmV4dFN0YXRlID0gKCkgPT4ge1xuICAgICAgbGV0IG5leHRTdGF0ZSA9IDA7XG4gICAgICBjb25zdCBkaWZmID0gW107XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJvd3M7IGkrKykge1xuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGNvbHM7IGorKykge1xuICAgICAgICAgIGxldCBuZWlnaGJvcnMgPSBjdXJyZW50Lm5laWdoYm91cnMoaSwgaiksXG4gICAgICAgICAgICBjdXJyZW50U3RhdGUgPSBjdXJyZW50LmdldChpLCBqKTtcblxuICAgICAgICAgIG5leHRTdGF0ZSA9IG5laWdoYm9ycyA9PT0gMyA/IDEgOiBuZWlnaGJvcnMgPT0gMiA/IGN1cnJlbnRTdGF0ZSA6IDA7XG4gICAgICAgICAgbmV4dC5zZXQoaSwgaiwgbmV4dFN0YXRlKTtcblxuICAgICAgICAgIGlmIChjdXJyZW50U3RhdGUgIT09IG5leHRTdGF0ZSkgZGlmZi5wdXNoKHsgaSwgaiwgbmV4dFN0YXRlIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBjb25zdCB0ZW1wID0gY3VycmVudDtcbiAgICAgIGN1cnJlbnQgPSBuZXh0O1xuICAgICAgbmV4dCA9IHRlbXA7XG4gICAgICByZXR1cm4gZGlmZjtcbiAgICB9O1xuXG4gICAgY29uc3QgdGljayA9IHRpbWVTdGFtcCA9PiB7XG4gICAgICBzdGF0cy5iZWdpbigpO1xuICAgICAgY29uc3QgZWxhcHNlZCA9IHRpbWVTdGFtcCAtIGVuZ2luZVRpbWU7XG4gICAgICBpZiAoZWxhcHNlZCA+IDEwMDAgLyBkZXNpcmVkRnBzKSB7XG4gICAgICAgIGNvbnN0IGRpZmYgPSBjb21wdXRlTmV4dFN0YXRlKCk7XG4gICAgICAgIGZyYW1lTnVtYmVyICs9IDE7XG4gICAgICAgIGVuZ2luZVRpbWUgPSB0aW1lU3RhbXAgLSBlbGFwc2VkICUgKDEwMDAgLyBkZXNpcmVkRnBzKTtcbiAgICAgICAgb25UaWNrKGN1cnJlbnQsIGRpZmYpO1xuICAgICAgfVxuICAgICAgc3RhdHMuZW5kKCk7XG4gICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRpY2spO1xuICAgIH07XG5cbiAgICB0aGlzLnN0YXJ0ID0gKCkgPT4ge1xuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aWNrKTtcbiAgICB9O1xuXG4gICAgdGhpcy5vbkRyYXcgPSAoaSwgaikgPT4ge1xuICAgICAgY3VycmVudC5jcm9zcyhpLCBqKTtcbiAgICB9O1xuICB9XG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9FbmdpbmUuanNcbi8vIG1vZHVsZSBpZCA9IDFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgV29ybGQge1xuICBjb25zdHJ1Y3Rvcihyb3dzLCBjb2xzKSB7XG4gICAgY29uc3QgYXJyID0gbmV3IFVpbnQ4QXJyYXkobmV3IEFycmF5QnVmZmVyKHJvd3MgKiBjb2xzKSksXG4gICAgICBpbmRleCA9IChpLCBqKSA9PiBpICogY29scyArIGo7XG5cbiAgICB0aGlzLmdldCA9IChpLCBqKSA9PlxuICAgICAgaSA+PSAwICYmIGkgPCByb3dzICYmIGogPj0gMCAmJiBqIDwgY29scyA/IGFycltpbmRleChpLCBqKV0gOiB1bmRlZmluZWQ7XG5cbiAgICB0aGlzLnNldCA9IChpLCBqLCB2YWwpID0+IChhcnJbaW5kZXgoaSwgaildID0gdmFsKTtcblxuICAgIHRoaXMuY3Jvc3MgPSAoaSwgaikgPT4ge1xuICAgICAgaWYgKGkgLSAxID4gMCkgYXJyW2luZGV4KGkgLSAxLCBqKV0gPSAxO1xuICAgICAgaWYgKGogLSAxID4gMCkgYXJyW2luZGV4KGksIGogLSAxKV0gPSAxO1xuICAgICAgYXJyW2luZGV4KGksIGopXSA9IDE7XG4gICAgICBpZiAoaiArIDEgPiBjb2xzKSBhcnJbaW5kZXgoaSwgaiArIDEpXSA9IDE7XG4gICAgICBpZiAoaSArIDEgPCByb3dzKSBhcnJbaW5kZXgoaSArIDEsIGopXSA9IDE7XG4gICAgfTtcblxuICAgIHRoaXMubmVpZ2hib3VycyA9IChpLCBqKSA9PlxuICAgICAgKHRoaXMuZ2V0KGkgLSAxLCBqIC0gMSkgfHwgMCkgK1xuICAgICAgKHRoaXMuZ2V0KGkgLSAxLCBqKSB8fCAwKSArXG4gICAgICAodGhpcy5nZXQoaSAtIDEsIGogKyAxKSB8fCAwKSArXG4gICAgICAodGhpcy5nZXQoaSwgaiAtIDEpIHx8IDApICtcbiAgICAgICh0aGlzLmdldChpLCBqICsgMSkgfHwgMCkgK1xuICAgICAgKHRoaXMuZ2V0KGkgKyAxLCBqIC0gMSkgfHwgMCkgK1xuICAgICAgKHRoaXMuZ2V0KGkgKyAxLCBqKSB8fCAwKSArXG4gICAgICAodGhpcy5nZXQoaSArIDEsIGogKyAxKSB8fCAwKTtcblxuICAgIC8vcmFuZG9tIHN0YXJ0XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyBpKyspIGFycltpXSA9IE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSk7XG4gIH1cbn1cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL1dvcmxkLmpzXG4vLyBtb2R1bGUgaWQgPSAyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlbmRlcmVyIHtcbiAgY29uc3RydWN0b3IoY29scywgcm93cywgY2VsbFdpZHRoLCBjZWxsSGVpZ2h0KSB7XG4gICAgY29uc3QgcmVuZGVyZXIgPSBQSVhJLmF1dG9EZXRlY3RSZW5kZXJlcigyNTYsIDI1Niwge1xuICAgICAgYW50aWFsaWFzOiBmYWxzZSxcbiAgICAgIHRyYW5zcGFyZW50OiBmYWxzZSxcbiAgICAgIHJlc29sdXRpb246IDFcbiAgICB9KTtcbiAgICByZW5kZXJlci52aWV3LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICByZW5kZXJlci52aWV3LnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgIHJlbmRlcmVyLmF1dG9SZXNpemUgPSB0cnVlO1xuICAgIHJlbmRlcmVyLnJlc2l6ZSh3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KTtcbiAgICByZW5kZXJlci5iYWNrZ3JvdW5kQ29sb3IgPSAweDAwMDAwMDtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHJlbmRlcmVyLnZpZXcpO1xuICAgIGNvbnN0IHN0YWdlID0gbmV3IFBJWEkuQ29udGFpbmVyKCk7XG4gICAgY29uc3QgZ3JhcGhpY3MgPSBuZXcgUElYSS5HcmFwaGljcygpO1xuICAgIHN0YWdlLmFkZENoaWxkKGdyYXBoaWNzKTtcbiAgICByZW5kZXJlci5yZW5kZXIoc3RhZ2UpO1xuXG4gICAgbGV0IG1vdXNlRG93biA9IGZhbHNlO1xuXG4gICAgLy8gY29uc3Qgb25EcmF3ID0gZXZlbnQgPT4ge1xuICAgIC8vICAgaWYgKCFtb3VzZURvd24pIHJldHVybjtcblxuICAgIC8vICAgY29uc3QgcmVjdCA9IGNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAvLyAgIGNvbnN0IG1vdXNlUG9zID0ge1xuICAgIC8vICAgICB4OiBldmVudC5jbGllbnRYICogY2FudmFzLndpZHRoIC8gY2FudmFzLmNsaWVudFdpZHRoLFxuICAgIC8vICAgICB5OiBldmVudC5jbGllbnRZICogY2FudmFzLmhlaWdodCAvIGNhbnZhcy5jbGllbnRIZWlnaHRcbiAgICAvLyAgIH07XG4gICAgLy8gICBjb25zdCBwb3MgPSB7XG4gICAgLy8gICAgIGk6IH5+KG1vdXNlUG9zLnkgLyBjZWxsSGVpZ2h0KSxcbiAgICAvLyAgICAgajogfn4obW91c2VQb3MueCAvIGNlbGxXaWR0aClcbiAgICAvLyAgIH07XG5cbiAgICAvLyAgIHRoaXMub25EcmF3KHBvcy5pLCBwb3Muaik7XG4gICAgLy8gfTtcblxuICAgIC8vIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBldnQgPT4ge1xuICAgIC8vICAgbW91c2VEb3duID0gdHJ1ZTtcbiAgICAvLyAgIG9uRHJhdyhldnQpO1xuICAgIC8vIH0pO1xuXG4gICAgLy8gY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIG9uRHJhdyk7XG4gICAgLy8gY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBldnQgPT4gKG1vdXNlRG93biA9IGZhbHNlKSk7XG5cbiAgICB0aGlzLnJlbmRlciA9ICh3b3JsZCwgZGlmZikgPT4ge1xuICAgICAgLy8gY29udGV4dC5jbGVhclJlY3QoMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcbiAgICAgIGdyYXBoaWNzLmJlZ2luRmlsbCgweGZmZmZmZik7XG4gICAgICAvLyBjb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgICAgLy8gY29udGV4dC5maWxsU3R5bGUgPSAncmdiYSgyNTUsIDI1NSwgMjU1LCAyNTUpJztcbiAgICAgIGRpZmYuZmlsdGVyKGNlbGwgPT4gY2VsbC5uZXh0U3RhdGUgPT09IDEpLmZvckVhY2goY2VsbCA9PlxuICAgICAgICBncmFwaGljcy5kcmF3UmVjdChcbiAgICAgICAgICAvLyAgICAgY29udGV4dC5maWxsUmVjdChcbiAgICAgICAgICBjZWxsLmogKiBjZWxsV2lkdGgsXG4gICAgICAgICAgY2VsbC5pICogY2VsbEhlaWdodCxcbiAgICAgICAgICBjZWxsV2lkdGgsXG4gICAgICAgICAgY2VsbEhlaWdodFxuICAgICAgICApXG4gICAgICApO1xuICAgICAgZ3JhcGhpY3MuZW5kRmlsbCgpO1xuICAgICAgZ3JhcGhpY3MuYmVnaW5GaWxsKDB4MDAwMDAwKTtcbiAgICAgIC8vIGNvbnRleHQuZmlsbFN0eWxlID0gJ3JnYmEoNDAsIDQwLCA0MCwgMjU1KSc7XG4gICAgICBkaWZmLmZpbHRlcihjZWxsID0+IGNlbGwubmV4dFN0YXRlICE9PSAxKS5mb3JFYWNoKGNlbGwgPT5cbiAgICAgICAgZ3JhcGhpY3MuZHJhd1JlY3QoXG4gICAgICAgICAgLy8gY29udGV4dC5maWxsUmVjdChcbiAgICAgICAgICBjZWxsLmogKiBjZWxsV2lkdGgsXG4gICAgICAgICAgY2VsbC5pICogY2VsbEhlaWdodCxcbiAgICAgICAgICBjZWxsV2lkdGgsXG4gICAgICAgICAgY2VsbEhlaWdodFxuICAgICAgICApXG4gICAgICApO1xuXG4gICAgICBncmFwaGljcy5lbmRGaWxsKCk7XG4gICAgICByZW5kZXJlci5yZW5kZXIoc3RhZ2UpO1xuXG4gICAgICAvLyBjb250ZXh0LmNsb3NlUGF0aCgpO1xuICAgIH07XG4gIH1cbn1cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL1JlbmRlcmVyLmpzXG4vLyBtb2R1bGUgaWQgPSAzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIHN0YXRzLmpzIC0gaHR0cDovL2dpdGh1Yi5jb20vbXJkb29iL3N0YXRzLmpzXG4oZnVuY3Rpb24oZixlKXtcIm9iamVjdFwiPT09dHlwZW9mIGV4cG9ydHMmJlwidW5kZWZpbmVkXCIhPT10eXBlb2YgbW9kdWxlP21vZHVsZS5leHBvcnRzPWUoKTpcImZ1bmN0aW9uXCI9PT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShlKTpmLlN0YXRzPWUoKX0pKHRoaXMsZnVuY3Rpb24oKXt2YXIgZj1mdW5jdGlvbigpe2Z1bmN0aW9uIGUoYSl7Yy5hcHBlbmRDaGlsZChhLmRvbSk7cmV0dXJuIGF9ZnVuY3Rpb24gdShhKXtmb3IodmFyIGQ9MDtkPGMuY2hpbGRyZW4ubGVuZ3RoO2QrKyljLmNoaWxkcmVuW2RdLnN0eWxlLmRpc3BsYXk9ZD09PWE/XCJibG9ja1wiOlwibm9uZVwiO2w9YX12YXIgbD0wLGM9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtjLnN0eWxlLmNzc1RleHQ9XCJwb3NpdGlvbjpmaXhlZDt0b3A6MDtsZWZ0OjA7Y3Vyc29yOnBvaW50ZXI7b3BhY2l0eTowLjk7ei1pbmRleDoxMDAwMFwiO2MuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsZnVuY3Rpb24oYSl7YS5wcmV2ZW50RGVmYXVsdCgpO1xudSgrK2wlYy5jaGlsZHJlbi5sZW5ndGgpfSwhMSk7dmFyIGs9KHBlcmZvcm1hbmNlfHxEYXRlKS5ub3coKSxnPWssYT0wLHI9ZShuZXcgZi5QYW5lbChcIkZQU1wiLFwiIzBmZlwiLFwiIzAwMlwiKSksaD1lKG5ldyBmLlBhbmVsKFwiTVNcIixcIiMwZjBcIixcIiMwMjBcIikpO2lmKHNlbGYucGVyZm9ybWFuY2UmJnNlbGYucGVyZm9ybWFuY2UubWVtb3J5KXZhciB0PWUobmV3IGYuUGFuZWwoXCJNQlwiLFwiI2YwOFwiLFwiIzIwMVwiKSk7dSgwKTtyZXR1cm57UkVWSVNJT046MTYsZG9tOmMsYWRkUGFuZWw6ZSxzaG93UGFuZWw6dSxiZWdpbjpmdW5jdGlvbigpe2s9KHBlcmZvcm1hbmNlfHxEYXRlKS5ub3coKX0sZW5kOmZ1bmN0aW9uKCl7YSsrO3ZhciBjPShwZXJmb3JtYW5jZXx8RGF0ZSkubm93KCk7aC51cGRhdGUoYy1rLDIwMCk7aWYoYz5nKzFFMyYmKHIudXBkYXRlKDFFMyphLyhjLWcpLDEwMCksZz1jLGE9MCx0KSl7dmFyIGQ9cGVyZm9ybWFuY2UubWVtb3J5O3QudXBkYXRlKGQudXNlZEpTSGVhcFNpemUvXG4xMDQ4NTc2LGQuanNIZWFwU2l6ZUxpbWl0LzEwNDg1NzYpfXJldHVybiBjfSx1cGRhdGU6ZnVuY3Rpb24oKXtrPXRoaXMuZW5kKCl9LGRvbUVsZW1lbnQ6YyxzZXRNb2RlOnV9fTtmLlBhbmVsPWZ1bmN0aW9uKGUsZixsKXt2YXIgYz1JbmZpbml0eSxrPTAsZz1NYXRoLnJvdW5kLGE9Zyh3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpb3x8MSkscj04MCphLGg9NDgqYSx0PTMqYSx2PTIqYSxkPTMqYSxtPTE1KmEsbj03NCphLHA9MzAqYSxxPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7cS53aWR0aD1yO3EuaGVpZ2h0PWg7cS5zdHlsZS5jc3NUZXh0PVwid2lkdGg6ODBweDtoZWlnaHQ6NDhweFwiO3ZhciBiPXEuZ2V0Q29udGV4dChcIjJkXCIpO2IuZm9udD1cImJvbGQgXCIrOSphK1wicHggSGVsdmV0aWNhLEFyaWFsLHNhbnMtc2VyaWZcIjtiLnRleHRCYXNlbGluZT1cInRvcFwiO2IuZmlsbFN0eWxlPWw7Yi5maWxsUmVjdCgwLDAscixoKTtiLmZpbGxTdHlsZT1mO2IuZmlsbFRleHQoZSx0LHYpO1xuYi5maWxsUmVjdChkLG0sbixwKTtiLmZpbGxTdHlsZT1sO2IuZ2xvYmFsQWxwaGE9Ljk7Yi5maWxsUmVjdChkLG0sbixwKTtyZXR1cm57ZG9tOnEsdXBkYXRlOmZ1bmN0aW9uKGgsdyl7Yz1NYXRoLm1pbihjLGgpO2s9TWF0aC5tYXgoayxoKTtiLmZpbGxTdHlsZT1sO2IuZ2xvYmFsQWxwaGE9MTtiLmZpbGxSZWN0KDAsMCxyLG0pO2IuZmlsbFN0eWxlPWY7Yi5maWxsVGV4dChnKGgpK1wiIFwiK2UrXCIgKFwiK2coYykrXCItXCIrZyhrKStcIilcIix0LHYpO2IuZHJhd0ltYWdlKHEsZCthLG0sbi1hLHAsZCxtLG4tYSxwKTtiLmZpbGxSZWN0KGQrbi1hLG0sYSxwKTtiLmZpbGxTdHlsZT1sO2IuZ2xvYmFsQWxwaGE9Ljk7Yi5maWxsUmVjdChkK24tYSxtLGEsZygoMS1oL3cpKnApKX19fTtyZXR1cm4gZn0pO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9saWIvc3RhdHMubWluLmpzXG4vLyBtb2R1bGUgaWQgPSA0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJzb3VyY2VSb290IjoiIn0=