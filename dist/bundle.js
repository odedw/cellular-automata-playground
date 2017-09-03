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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Engine__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Renderer__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__lib_stats_min__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__lib_stats_min___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__lib_stats_min__);




const stats = new __WEBPACK_IMPORTED_MODULE_2__lib_stats_min___default.a();
stats.showPanel(0);
document.body.appendChild(stats.dom);

const pixelsPerCell = 3,
  canvas = document.getElementById('canvas'),
  cols = Math.ceil(canvas.clientWidth / pixelsPerCell),
  rows = Math.ceil(canvas.clientHeight / pixelsPerCell),
  renderer = new __WEBPACK_IMPORTED_MODULE_1__Renderer__["a" /* default */](canvas, cols, rows),
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
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__World__ = __webpack_require__(1);


class Engine {
  constructor(cols, rows, onTick, desiredFps, stats) {
    let engineTime = 0,
      frameNumber = 0,
      current = new __WEBPACK_IMPORTED_MODULE_0__World__["a" /* default */](rows, cols),
      next = new __WEBPACK_IMPORTED_MODULE_0__World__["a" /* default */](rows, cols);

    const computeNextState = () => {
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          let neighbors = current.neighbours(i, j);

          if (neighbors === 3) next.set(i, j, 1);
          else if (neighbors === 2) next.set(i, j, current.get(i, j));
          else next.set(i, j, 0);
        }
      }
      const temp = current;
      current = next;
      next = temp;
    };

    const tick = timeStamp => {
      stats.begin();
      const elapsed = timeStamp - engineTime;
      if (elapsed > 1000 / desiredFps) {
        computeNextState();
        frameNumber += 1;
        engineTime = timeStamp - elapsed % (1000 / desiredFps);
        onTick(current);
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
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Renderer {
  constructor(canvas, cols, rows) {
    canvas.width *= 10;
    canvas.height *= 10;
    const context = canvas.getContext('2d'),
      cellWidth = Math.ceil(canvas.width / cols),
      cellHeight = Math.ceil(canvas.height / rows);
    let mouseDown = false;

    const onDraw = event => {
      if (!mouseDown) return;

      const rect = canvas.getBoundingClientRect();
      const mousePos = {
        x: event.clientX * canvas.width / canvas.clientWidth,
        y: event.clientY * canvas.height / canvas.clientHeight
      };
      const pos = {
        i: ~~(mousePos.y / cellHeight),
        j: ~~(mousePos.x / cellWidth)
      };

      this.onDraw(pos.i, pos.j);
    };

    canvas.addEventListener('mousedown', evt => {
      mouseDown = true;
      onDraw(evt);
    });

    canvas.addEventListener('mousemove', onDraw);
    canvas.addEventListener('mouseup', evt => (mouseDown = false));

    const colorForCell = (state, neighbours) => {
      return state === 1 ? 'white' : '#282828';
    };

    this.render = world => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = 'white';
      const deadCells = [];
      context.beginPath();
      context.fillStyle = 'rgba(255, 255, 255, 255)';
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          const jPx = cellWidth * j;
          const iPx = cellHeight * i;
          if (world.get(i, j) === 1)
            context.fillRect(jPx, iPx, cellWidth, cellHeight);
          else deadCells.push[{ iPx, jPx }];
        }
      }
      context.fillStyle = 'rgba(40, 40, 40, 255)';
      deadCells.forEach(point =>
        context.fillRect(point.jPx, point.iPx, cellWidth, cellHeight)
      );
      context.closePath();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgODVkYWViZjY0YzU2MzNhMDkzMjIiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FwcC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvV29ybGQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0VuZ2luZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvUmVuZGVyZXIuanMiLCJ3ZWJwYWNrOi8vLy4vbGliL3N0YXRzLm1pbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7QUM3REE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxtQkFBbUIsZ0JBQWdCO0FBQ25DO0FBQ0E7QUFBQTtBQUFBOzs7Ozs7Ozs7QUMvQkE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EscUJBQXFCLFVBQVU7QUFDL0IsdUJBQXVCLFVBQVU7QUFDakM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7Ozs7Ozs7O0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQixVQUFVO0FBQy9CLHVCQUF1QixVQUFVO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCLFdBQVc7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBOzs7Ozs7O0FDM0RBO0FBQ0EsZUFBZSxzRkFBdUksa0JBQWtCLGlCQUFpQixjQUFjLHFCQUFxQixTQUFTLGNBQWMsWUFBWSxvQkFBb0IscURBQXFELElBQUksd0NBQXdDLGdDQUFnQyxNQUFNLE9BQU8sZUFBZSxZQUFZLGVBQWUsdUNBQXVDO0FBQ2xmLHlCQUF5QixLQUFLLG1IQUFtSCxzRkFBc0YsS0FBSyxPQUFPLDBEQUEwRCw0QkFBNEIsZ0JBQWdCLElBQUksZ0NBQWdDLGtCQUFrQixtREFBbUQseUJBQXlCO0FBQzNkLG1DQUFtQyxTQUFTLG1CQUFtQixhQUFhLDBCQUEwQix3QkFBd0Isd0pBQXdKLFVBQVUsV0FBVyw0QkFBNEIsYUFBYSx5QkFBeUIsbURBQW1ELHFCQUFxQixjQUFjLG9CQUFvQixjQUFjO0FBQ3JlLG9CQUFvQixjQUFjLGlCQUFpQixvQkFBb0IsT0FBTywyQkFBMkIsZ0JBQWdCLGdCQUFnQixjQUFjLGdCQUFnQixvQkFBb0IsY0FBYyxrREFBa0QscUNBQXFDLHdCQUF3QixjQUFjLGlCQUFpQixzQ0FBc0MsU0FBUyIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCA4NWRhZWJmNjRjNTYzM2EwOTMyMiIsImltcG9ydCBFbmdpbmUgZnJvbSAnLi9FbmdpbmUnO1xyXG5pbXBvcnQgUmVuZGVyZXIgZnJvbSAnLi9SZW5kZXJlcic7XHJcbmltcG9ydCBTdGF0cyBmcm9tICcuLi9saWIvc3RhdHMubWluJztcclxuXHJcbmNvbnN0IHN0YXRzID0gbmV3IFN0YXRzKCk7XHJcbnN0YXRzLnNob3dQYW5lbCgwKTtcclxuZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChzdGF0cy5kb20pO1xyXG5cclxuY29uc3QgcGl4ZWxzUGVyQ2VsbCA9IDMsXHJcbiAgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhbnZhcycpLFxyXG4gIGNvbHMgPSBNYXRoLmNlaWwoY2FudmFzLmNsaWVudFdpZHRoIC8gcGl4ZWxzUGVyQ2VsbCksXHJcbiAgcm93cyA9IE1hdGguY2VpbChjYW52YXMuY2xpZW50SGVpZ2h0IC8gcGl4ZWxzUGVyQ2VsbCksXHJcbiAgcmVuZGVyZXIgPSBuZXcgUmVuZGVyZXIoY2FudmFzLCBjb2xzLCByb3dzKSxcclxuICBlbmdpbmUgPSBuZXcgRW5naW5lKFxyXG4gICAgY29scywgLy9udW1iZXIgb2YgY29sdW1uc1xyXG4gICAgcm93cywgLy9udW1iZXIgb2Ygcm93c1xyXG4gICAgcmVuZGVyZXIucmVuZGVyLCAvL29uVGlja1xyXG4gICAgNjAsIC8vZGVzaXJlZCBmcHNcclxuICAgIHN0YXRzXHJcbiAgKTtcclxuXHJcbnJlbmRlcmVyLm9uRHJhdyA9IGVuZ2luZS5vbkRyYXc7XHJcbndpbmRvdy5vbmxvYWQgPSBlbmdpbmUuc3RhcnQ7XHJcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2FwcC5qc1xuLy8gbW9kdWxlIGlkID0gMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBXb3JsZCB7XG4gIGNvbnN0cnVjdG9yKHJvd3MsIGNvbHMpIHtcbiAgICBjb25zdCBhcnIgPSBuZXcgVWludDhBcnJheShuZXcgQXJyYXlCdWZmZXIocm93cyAqIGNvbHMpKSxcbiAgICAgIGluZGV4ID0gKGksIGopID0+IGkgKiBjb2xzICsgajtcblxuICAgIHRoaXMuZ2V0ID0gKGksIGopID0+XG4gICAgICBpID49IDAgJiYgaSA8IHJvd3MgJiYgaiA+PSAwICYmIGogPCBjb2xzID8gYXJyW2luZGV4KGksIGopXSA6IHVuZGVmaW5lZDtcblxuICAgIHRoaXMuc2V0ID0gKGksIGosIHZhbCkgPT4gKGFycltpbmRleChpLCBqKV0gPSB2YWwpO1xuXG4gICAgdGhpcy5jcm9zcyA9IChpLCBqKSA9PiB7XG4gICAgICBpZiAoaSAtIDEgPiAwKSBhcnJbaW5kZXgoaSAtIDEsIGopXSA9IDE7XG4gICAgICBpZiAoaiAtIDEgPiAwKSBhcnJbaW5kZXgoaSwgaiAtIDEpXSA9IDE7XG4gICAgICBhcnJbaW5kZXgoaSwgaildID0gMTtcbiAgICAgIGlmIChqICsgMSA+IGNvbHMpIGFycltpbmRleChpLCBqICsgMSldID0gMTtcbiAgICAgIGlmIChpICsgMSA8IHJvd3MpIGFycltpbmRleChpICsgMSwgaildID0gMTtcbiAgICB9O1xuXG4gICAgdGhpcy5uZWlnaGJvdXJzID0gKGksIGopID0+XG4gICAgICAodGhpcy5nZXQoaSAtIDEsIGogLSAxKSB8fCAwKSArXG4gICAgICAodGhpcy5nZXQoaSAtIDEsIGopIHx8IDApICtcbiAgICAgICh0aGlzLmdldChpIC0gMSwgaiArIDEpIHx8IDApICtcbiAgICAgICh0aGlzLmdldChpLCBqIC0gMSkgfHwgMCkgK1xuICAgICAgKHRoaXMuZ2V0KGksIGogKyAxKSB8fCAwKSArXG4gICAgICAodGhpcy5nZXQoaSArIDEsIGogLSAxKSB8fCAwKSArXG4gICAgICAodGhpcy5nZXQoaSArIDEsIGopIHx8IDApICtcbiAgICAgICh0aGlzLmdldChpICsgMSwgaiArIDEpIHx8IDApO1xuXG4gICAgLy9yYW5kb20gc3RhcnRcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFyci5sZW5ndGg7IGkrKykgYXJyW2ldID0gTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpKTtcbiAgfVxufVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvV29ybGQuanNcbi8vIG1vZHVsZSBpZCA9IDFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IFdvcmxkIGZyb20gJy4vV29ybGQnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFbmdpbmUge1xuICBjb25zdHJ1Y3Rvcihjb2xzLCByb3dzLCBvblRpY2ssIGRlc2lyZWRGcHMsIHN0YXRzKSB7XG4gICAgbGV0IGVuZ2luZVRpbWUgPSAwLFxuICAgICAgZnJhbWVOdW1iZXIgPSAwLFxuICAgICAgY3VycmVudCA9IG5ldyBXb3JsZChyb3dzLCBjb2xzKSxcbiAgICAgIG5leHQgPSBuZXcgV29ybGQocm93cywgY29scyk7XG5cbiAgICBjb25zdCBjb21wdXRlTmV4dFN0YXRlID0gKCkgPT4ge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByb3dzOyBpKyspIHtcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBjb2xzOyBqKyspIHtcbiAgICAgICAgICBsZXQgbmVpZ2hib3JzID0gY3VycmVudC5uZWlnaGJvdXJzKGksIGopO1xuXG4gICAgICAgICAgaWYgKG5laWdoYm9ycyA9PT0gMykgbmV4dC5zZXQoaSwgaiwgMSk7XG4gICAgICAgICAgZWxzZSBpZiAobmVpZ2hib3JzID09PSAyKSBuZXh0LnNldChpLCBqLCBjdXJyZW50LmdldChpLCBqKSk7XG4gICAgICAgICAgZWxzZSBuZXh0LnNldChpLCBqLCAwKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgY29uc3QgdGVtcCA9IGN1cnJlbnQ7XG4gICAgICBjdXJyZW50ID0gbmV4dDtcbiAgICAgIG5leHQgPSB0ZW1wO1xuICAgIH07XG5cbiAgICBjb25zdCB0aWNrID0gdGltZVN0YW1wID0+IHtcbiAgICAgIHN0YXRzLmJlZ2luKCk7XG4gICAgICBjb25zdCBlbGFwc2VkID0gdGltZVN0YW1wIC0gZW5naW5lVGltZTtcbiAgICAgIGlmIChlbGFwc2VkID4gMTAwMCAvIGRlc2lyZWRGcHMpIHtcbiAgICAgICAgY29tcHV0ZU5leHRTdGF0ZSgpO1xuICAgICAgICBmcmFtZU51bWJlciArPSAxO1xuICAgICAgICBlbmdpbmVUaW1lID0gdGltZVN0YW1wIC0gZWxhcHNlZCAlICgxMDAwIC8gZGVzaXJlZEZwcyk7XG4gICAgICAgIG9uVGljayhjdXJyZW50KTtcbiAgICAgIH1cbiAgICAgIHN0YXRzLmVuZCgpO1xuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aWNrKTtcbiAgICB9O1xuXG4gICAgdGhpcy5zdGFydCA9ICgpID0+IHtcbiAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGljayk7XG4gICAgfTtcblxuICAgIHRoaXMub25EcmF3ID0gKGksIGopID0+IHtcbiAgICAgIGN1cnJlbnQuY3Jvc3MoaSwgaik7XG4gICAgfTtcbiAgfVxufVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvRW5naW5lLmpzXG4vLyBtb2R1bGUgaWQgPSAyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlbmRlcmVyIHtcbiAgY29uc3RydWN0b3IoY2FudmFzLCBjb2xzLCByb3dzKSB7XG4gICAgY2FudmFzLndpZHRoICo9IDEwO1xuICAgIGNhbnZhcy5oZWlnaHQgKj0gMTA7XG4gICAgY29uc3QgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpLFxuICAgICAgY2VsbFdpZHRoID0gTWF0aC5jZWlsKGNhbnZhcy53aWR0aCAvIGNvbHMpLFxuICAgICAgY2VsbEhlaWdodCA9IE1hdGguY2VpbChjYW52YXMuaGVpZ2h0IC8gcm93cyk7XG4gICAgbGV0IG1vdXNlRG93biA9IGZhbHNlO1xuXG4gICAgY29uc3Qgb25EcmF3ID0gZXZlbnQgPT4ge1xuICAgICAgaWYgKCFtb3VzZURvd24pIHJldHVybjtcblxuICAgICAgY29uc3QgcmVjdCA9IGNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgIGNvbnN0IG1vdXNlUG9zID0ge1xuICAgICAgICB4OiBldmVudC5jbGllbnRYICogY2FudmFzLndpZHRoIC8gY2FudmFzLmNsaWVudFdpZHRoLFxuICAgICAgICB5OiBldmVudC5jbGllbnRZICogY2FudmFzLmhlaWdodCAvIGNhbnZhcy5jbGllbnRIZWlnaHRcbiAgICAgIH07XG4gICAgICBjb25zdCBwb3MgPSB7XG4gICAgICAgIGk6IH5+KG1vdXNlUG9zLnkgLyBjZWxsSGVpZ2h0KSxcbiAgICAgICAgajogfn4obW91c2VQb3MueCAvIGNlbGxXaWR0aClcbiAgICAgIH07XG5cbiAgICAgIHRoaXMub25EcmF3KHBvcy5pLCBwb3Muaik7XG4gICAgfTtcblxuICAgIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBldnQgPT4ge1xuICAgICAgbW91c2VEb3duID0gdHJ1ZTtcbiAgICAgIG9uRHJhdyhldnQpO1xuICAgIH0pO1xuXG4gICAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIG9uRHJhdyk7XG4gICAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBldnQgPT4gKG1vdXNlRG93biA9IGZhbHNlKSk7XG5cbiAgICBjb25zdCBjb2xvckZvckNlbGwgPSAoc3RhdGUsIG5laWdoYm91cnMpID0+IHtcbiAgICAgIHJldHVybiBzdGF0ZSA9PT0gMSA/ICd3aGl0ZScgOiAnIzI4MjgyOCc7XG4gICAgfTtcblxuICAgIHRoaXMucmVuZGVyID0gd29ybGQgPT4ge1xuICAgICAgY29udGV4dC5jbGVhclJlY3QoMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcbiAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gJ3doaXRlJztcbiAgICAgIGNvbnN0IGRlYWRDZWxscyA9IFtdO1xuICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcbiAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gJ3JnYmEoMjU1LCAyNTUsIDI1NSwgMjU1KSc7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJvd3M7IGkrKykge1xuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGNvbHM7IGorKykge1xuICAgICAgICAgIGNvbnN0IGpQeCA9IGNlbGxXaWR0aCAqIGo7XG4gICAgICAgICAgY29uc3QgaVB4ID0gY2VsbEhlaWdodCAqIGk7XG4gICAgICAgICAgaWYgKHdvcmxkLmdldChpLCBqKSA9PT0gMSlcbiAgICAgICAgICAgIGNvbnRleHQuZmlsbFJlY3QoalB4LCBpUHgsIGNlbGxXaWR0aCwgY2VsbEhlaWdodCk7XG4gICAgICAgICAgZWxzZSBkZWFkQ2VsbHMucHVzaFt7IGlQeCwgalB4IH1dO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBjb250ZXh0LmZpbGxTdHlsZSA9ICdyZ2JhKDQwLCA0MCwgNDAsIDI1NSknO1xuICAgICAgZGVhZENlbGxzLmZvckVhY2gocG9pbnQgPT5cbiAgICAgICAgY29udGV4dC5maWxsUmVjdChwb2ludC5qUHgsIHBvaW50LmlQeCwgY2VsbFdpZHRoLCBjZWxsSGVpZ2h0KVxuICAgICAgKTtcbiAgICAgIGNvbnRleHQuY2xvc2VQYXRoKCk7XG4gICAgfTtcbiAgfVxufVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvUmVuZGVyZXIuanNcbi8vIG1vZHVsZSBpZCA9IDNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gc3RhdHMuanMgLSBodHRwOi8vZ2l0aHViLmNvbS9tcmRvb2Ivc3RhdHMuanNcbihmdW5jdGlvbihmLGUpe1wib2JqZWN0XCI9PT10eXBlb2YgZXhwb3J0cyYmXCJ1bmRlZmluZWRcIiE9PXR5cGVvZiBtb2R1bGU/bW9kdWxlLmV4cG9ydHM9ZSgpOlwiZnVuY3Rpb25cIj09PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKGUpOmYuU3RhdHM9ZSgpfSkodGhpcyxmdW5jdGlvbigpe3ZhciBmPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gZShhKXtjLmFwcGVuZENoaWxkKGEuZG9tKTtyZXR1cm4gYX1mdW5jdGlvbiB1KGEpe2Zvcih2YXIgZD0wO2Q8Yy5jaGlsZHJlbi5sZW5ndGg7ZCsrKWMuY2hpbGRyZW5bZF0uc3R5bGUuZGlzcGxheT1kPT09YT9cImJsb2NrXCI6XCJub25lXCI7bD1hfXZhciBsPTAsYz1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO2Muc3R5bGUuY3NzVGV4dD1cInBvc2l0aW9uOmZpeGVkO3RvcDowO2xlZnQ6MDtjdXJzb3I6cG9pbnRlcjtvcGFjaXR5OjAuOTt6LWluZGV4OjEwMDAwXCI7Yy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIixmdW5jdGlvbihhKXthLnByZXZlbnREZWZhdWx0KCk7XG51KCsrbCVjLmNoaWxkcmVuLmxlbmd0aCl9LCExKTt2YXIgaz0ocGVyZm9ybWFuY2V8fERhdGUpLm5vdygpLGc9ayxhPTAscj1lKG5ldyBmLlBhbmVsKFwiRlBTXCIsXCIjMGZmXCIsXCIjMDAyXCIpKSxoPWUobmV3IGYuUGFuZWwoXCJNU1wiLFwiIzBmMFwiLFwiIzAyMFwiKSk7aWYoc2VsZi5wZXJmb3JtYW5jZSYmc2VsZi5wZXJmb3JtYW5jZS5tZW1vcnkpdmFyIHQ9ZShuZXcgZi5QYW5lbChcIk1CXCIsXCIjZjA4XCIsXCIjMjAxXCIpKTt1KDApO3JldHVybntSRVZJU0lPTjoxNixkb206YyxhZGRQYW5lbDplLHNob3dQYW5lbDp1LGJlZ2luOmZ1bmN0aW9uKCl7az0ocGVyZm9ybWFuY2V8fERhdGUpLm5vdygpfSxlbmQ6ZnVuY3Rpb24oKXthKys7dmFyIGM9KHBlcmZvcm1hbmNlfHxEYXRlKS5ub3coKTtoLnVwZGF0ZShjLWssMjAwKTtpZihjPmcrMUUzJiYoci51cGRhdGUoMUUzKmEvKGMtZyksMTAwKSxnPWMsYT0wLHQpKXt2YXIgZD1wZXJmb3JtYW5jZS5tZW1vcnk7dC51cGRhdGUoZC51c2VkSlNIZWFwU2l6ZS9cbjEwNDg1NzYsZC5qc0hlYXBTaXplTGltaXQvMTA0ODU3Nil9cmV0dXJuIGN9LHVwZGF0ZTpmdW5jdGlvbigpe2s9dGhpcy5lbmQoKX0sZG9tRWxlbWVudDpjLHNldE1vZGU6dX19O2YuUGFuZWw9ZnVuY3Rpb24oZSxmLGwpe3ZhciBjPUluZmluaXR5LGs9MCxnPU1hdGgucm91bmQsYT1nKHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvfHwxKSxyPTgwKmEsaD00OCphLHQ9MyphLHY9MiphLGQ9MyphLG09MTUqYSxuPTc0KmEscD0zMCphLHE9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtxLndpZHRoPXI7cS5oZWlnaHQ9aDtxLnN0eWxlLmNzc1RleHQ9XCJ3aWR0aDo4MHB4O2hlaWdodDo0OHB4XCI7dmFyIGI9cS5nZXRDb250ZXh0KFwiMmRcIik7Yi5mb250PVwiYm9sZCBcIis5KmErXCJweCBIZWx2ZXRpY2EsQXJpYWwsc2Fucy1zZXJpZlwiO2IudGV4dEJhc2VsaW5lPVwidG9wXCI7Yi5maWxsU3R5bGU9bDtiLmZpbGxSZWN0KDAsMCxyLGgpO2IuZmlsbFN0eWxlPWY7Yi5maWxsVGV4dChlLHQsdik7XG5iLmZpbGxSZWN0KGQsbSxuLHApO2IuZmlsbFN0eWxlPWw7Yi5nbG9iYWxBbHBoYT0uOTtiLmZpbGxSZWN0KGQsbSxuLHApO3JldHVybntkb206cSx1cGRhdGU6ZnVuY3Rpb24oaCx3KXtjPU1hdGgubWluKGMsaCk7az1NYXRoLm1heChrLGgpO2IuZmlsbFN0eWxlPWw7Yi5nbG9iYWxBbHBoYT0xO2IuZmlsbFJlY3QoMCwwLHIsbSk7Yi5maWxsU3R5bGU9ZjtiLmZpbGxUZXh0KGcoaCkrXCIgXCIrZStcIiAoXCIrZyhjKStcIi1cIitnKGspK1wiKVwiLHQsdik7Yi5kcmF3SW1hZ2UocSxkK2EsbSxuLWEscCxkLG0sbi1hLHApO2IuZmlsbFJlY3QoZCtuLWEsbSxhLHApO2IuZmlsbFN0eWxlPWw7Yi5nbG9iYWxBbHBoYT0uOTtiLmZpbGxSZWN0KGQrbi1hLG0sYSxnKCgxLWgvdykqcCkpfX19O3JldHVybiBmfSk7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2xpYi9zdGF0cy5taW4uanNcbi8vIG1vZHVsZSBpZCA9IDRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==