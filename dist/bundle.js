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



const canvas = document.getElementById('canvas'),
  cols = 300,
  rows = Math.ceil(canvas.clientHeight / (canvas.clientWidth / 100)),
  renderer = new __WEBPACK_IMPORTED_MODULE_1__Renderer__["a" /* default */](canvas, cols, rows),
  engine = new __WEBPACK_IMPORTED_MODULE_0__Engine__["a" /* default */](
    canvas.clientWidth, //width
    canvas.clientHeight, //height
    cols, //number of columns
    rows, //number of rows
    renderer.render, //onTick
    60 //desired fps
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
  constructor(width, height, cols, rows, onTick, desiredFps) {
    let engineTime = 0,
      frameNumber = 0,
      current = new __WEBPACK_IMPORTED_MODULE_0__World__["a" /* default */](rows, cols),
      next = new __WEBPACK_IMPORTED_MODULE_0__World__["a" /* default */](rows, cols);

    const cellSize = canvas.clientWidth / cols;

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
      window.requestAnimationFrame(tick);

      const elapsed = timeStamp - engineTime;
      if (elapsed > 1000 / desiredFps) {
        computeNextState();
        frameNumber += 1;
        engineTime = timeStamp - elapsed % (1000 / desiredFps);
        onTick(current);
      }
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
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          const jPx = cellWidth * j;
          const iPx = cellHeight * i;
          context.fillStyle = colorForCell(
            world.get(i, j),
            world.neighbours(i, j)
          );
          context.fillRect(jPx, iPx, cellWidth, cellHeight);
        }
      }
    };
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Renderer;



/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMjQ0MzcxZGIwODJjNWU4ODI3MjciLCJ3ZWJwYWNrOi8vLy4vc3JjL2FwcC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvV29ybGQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0VuZ2luZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvUmVuZGVyZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7OztBQzdEQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7OztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLG1CQUFtQixnQkFBZ0I7QUFDbkM7QUFDQTtBQUFBO0FBQUE7Ozs7Ozs7OztBQy9CQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSxxQkFBcUIsVUFBVTtBQUMvQix1QkFBdUIsVUFBVTtBQUNqQzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTs7Ozs7Ozs7QUM5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLFVBQVU7QUFDL0IsdUJBQXVCLFVBQVU7QUFDakM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQSIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCAyNDQzNzFkYjA4MmM1ZTg4MjcyNyIsImltcG9ydCBFbmdpbmUgZnJvbSAnLi9FbmdpbmUnO1xyXG5pbXBvcnQgUmVuZGVyZXIgZnJvbSAnLi9SZW5kZXJlcic7XHJcblxyXG5jb25zdCBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FudmFzJyksXHJcbiAgY29scyA9IDMwMCxcclxuICByb3dzID0gTWF0aC5jZWlsKGNhbnZhcy5jbGllbnRIZWlnaHQgLyAoY2FudmFzLmNsaWVudFdpZHRoIC8gMTAwKSksXHJcbiAgcmVuZGVyZXIgPSBuZXcgUmVuZGVyZXIoY2FudmFzLCBjb2xzLCByb3dzKSxcclxuICBlbmdpbmUgPSBuZXcgRW5naW5lKFxyXG4gICAgY2FudmFzLmNsaWVudFdpZHRoLCAvL3dpZHRoXHJcbiAgICBjYW52YXMuY2xpZW50SGVpZ2h0LCAvL2hlaWdodFxyXG4gICAgY29scywgLy9udW1iZXIgb2YgY29sdW1uc1xyXG4gICAgcm93cywgLy9udW1iZXIgb2Ygcm93c1xyXG4gICAgcmVuZGVyZXIucmVuZGVyLCAvL29uVGlja1xyXG4gICAgNjAgLy9kZXNpcmVkIGZwc1xyXG4gICk7XHJcblxyXG5yZW5kZXJlci5vbkRyYXcgPSBlbmdpbmUub25EcmF3O1xyXG53aW5kb3cub25sb2FkID0gZW5naW5lLnN0YXJ0O1xyXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9hcHAuanNcbi8vIG1vZHVsZSBpZCA9IDBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgV29ybGQge1xuICBjb25zdHJ1Y3Rvcihyb3dzLCBjb2xzKSB7XG4gICAgY29uc3QgYXJyID0gbmV3IFVpbnQ4QXJyYXkobmV3IEFycmF5QnVmZmVyKHJvd3MgKiBjb2xzKSksXG4gICAgICBpbmRleCA9IChpLCBqKSA9PiBpICogY29scyArIGo7XG5cbiAgICB0aGlzLmdldCA9IChpLCBqKSA9PlxuICAgICAgaSA+PSAwICYmIGkgPCByb3dzICYmIGogPj0gMCAmJiBqIDwgY29scyA/IGFycltpbmRleChpLCBqKV0gOiB1bmRlZmluZWQ7XG5cbiAgICB0aGlzLnNldCA9IChpLCBqLCB2YWwpID0+IChhcnJbaW5kZXgoaSwgaildID0gdmFsKTtcblxuICAgIHRoaXMuY3Jvc3MgPSAoaSwgaikgPT4ge1xuICAgICAgaWYgKGkgLSAxID4gMCkgYXJyW2luZGV4KGkgLSAxLCBqKV0gPSAxO1xuICAgICAgaWYgKGogLSAxID4gMCkgYXJyW2luZGV4KGksIGogLSAxKV0gPSAxO1xuICAgICAgYXJyW2luZGV4KGksIGopXSA9IDE7XG4gICAgICBpZiAoaiArIDEgPiBjb2xzKSBhcnJbaW5kZXgoaSwgaiArIDEpXSA9IDE7XG4gICAgICBpZiAoaSArIDEgPCByb3dzKSBhcnJbaW5kZXgoaSArIDEsIGopXSA9IDE7XG4gICAgfTtcblxuICAgIHRoaXMubmVpZ2hib3VycyA9IChpLCBqKSA9PlxuICAgICAgKHRoaXMuZ2V0KGkgLSAxLCBqIC0gMSkgfHwgMCkgK1xuICAgICAgKHRoaXMuZ2V0KGkgLSAxLCBqKSB8fCAwKSArXG4gICAgICAodGhpcy5nZXQoaSAtIDEsIGogKyAxKSB8fCAwKSArXG4gICAgICAodGhpcy5nZXQoaSwgaiAtIDEpIHx8IDApICtcbiAgICAgICh0aGlzLmdldChpLCBqICsgMSkgfHwgMCkgK1xuICAgICAgKHRoaXMuZ2V0KGkgKyAxLCBqIC0gMSkgfHwgMCkgK1xuICAgICAgKHRoaXMuZ2V0KGkgKyAxLCBqKSB8fCAwKSArXG4gICAgICAodGhpcy5nZXQoaSArIDEsIGogKyAxKSB8fCAwKTtcblxuICAgIC8vcmFuZG9tIHN0YXJ0XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyBpKyspIGFycltpXSA9IE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSk7XG4gIH1cbn1cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL1dvcmxkLmpzXG4vLyBtb2R1bGUgaWQgPSAxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCBXb3JsZCBmcm9tICcuL1dvcmxkJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRW5naW5lIHtcbiAgY29uc3RydWN0b3Iod2lkdGgsIGhlaWdodCwgY29scywgcm93cywgb25UaWNrLCBkZXNpcmVkRnBzKSB7XG4gICAgbGV0IGVuZ2luZVRpbWUgPSAwLFxuICAgICAgZnJhbWVOdW1iZXIgPSAwLFxuICAgICAgY3VycmVudCA9IG5ldyBXb3JsZChyb3dzLCBjb2xzKSxcbiAgICAgIG5leHQgPSBuZXcgV29ybGQocm93cywgY29scyk7XG5cbiAgICBjb25zdCBjZWxsU2l6ZSA9IGNhbnZhcy5jbGllbnRXaWR0aCAvIGNvbHM7XG5cbiAgICBjb25zdCBjb21wdXRlTmV4dFN0YXRlID0gKCkgPT4ge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByb3dzOyBpKyspIHtcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBjb2xzOyBqKyspIHtcbiAgICAgICAgICBsZXQgbmVpZ2hib3JzID0gY3VycmVudC5uZWlnaGJvdXJzKGksIGopO1xuXG4gICAgICAgICAgaWYgKG5laWdoYm9ycyA9PT0gMykgbmV4dC5zZXQoaSwgaiwgMSk7XG4gICAgICAgICAgZWxzZSBpZiAobmVpZ2hib3JzID09PSAyKSBuZXh0LnNldChpLCBqLCBjdXJyZW50LmdldChpLCBqKSk7XG4gICAgICAgICAgZWxzZSBuZXh0LnNldChpLCBqLCAwKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgY29uc3QgdGVtcCA9IGN1cnJlbnQ7XG4gICAgICBjdXJyZW50ID0gbmV4dDtcbiAgICAgIG5leHQgPSB0ZW1wO1xuICAgIH07XG5cbiAgICBjb25zdCB0aWNrID0gdGltZVN0YW1wID0+IHtcbiAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGljayk7XG5cbiAgICAgIGNvbnN0IGVsYXBzZWQgPSB0aW1lU3RhbXAgLSBlbmdpbmVUaW1lO1xuICAgICAgaWYgKGVsYXBzZWQgPiAxMDAwIC8gZGVzaXJlZEZwcykge1xuICAgICAgICBjb21wdXRlTmV4dFN0YXRlKCk7XG4gICAgICAgIGZyYW1lTnVtYmVyICs9IDE7XG4gICAgICAgIGVuZ2luZVRpbWUgPSB0aW1lU3RhbXAgLSBlbGFwc2VkICUgKDEwMDAgLyBkZXNpcmVkRnBzKTtcbiAgICAgICAgb25UaWNrKGN1cnJlbnQpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB0aGlzLnN0YXJ0ID0gKCkgPT4ge1xuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aWNrKTtcbiAgICB9O1xuXG4gICAgdGhpcy5vbkRyYXcgPSAoaSwgaikgPT4ge1xuICAgICAgY3VycmVudC5jcm9zcyhpLCBqKTtcbiAgICB9O1xuICB9XG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9FbmdpbmUuanNcbi8vIG1vZHVsZSBpZCA9IDJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVuZGVyZXIge1xuICBjb25zdHJ1Y3RvcihjYW52YXMsIGNvbHMsIHJvd3MpIHtcbiAgICBjYW52YXMud2lkdGggKj0gMTA7XG4gICAgY2FudmFzLmhlaWdodCAqPSAxMDtcbiAgICBjb25zdCBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyksXG4gICAgICBjZWxsV2lkdGggPSBNYXRoLmNlaWwoY2FudmFzLndpZHRoIC8gY29scyksXG4gICAgICBjZWxsSGVpZ2h0ID0gTWF0aC5jZWlsKGNhbnZhcy5oZWlnaHQgLyByb3dzKTtcbiAgICBsZXQgbW91c2VEb3duID0gZmFsc2U7XG5cbiAgICBjb25zdCBvbkRyYXcgPSBldmVudCA9PiB7XG4gICAgICBpZiAoIW1vdXNlRG93bikgcmV0dXJuO1xuXG4gICAgICBjb25zdCByZWN0ID0gY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgY29uc3QgbW91c2VQb3MgPSB7XG4gICAgICAgIHg6IGV2ZW50LmNsaWVudFggKiBjYW52YXMud2lkdGggLyBjYW52YXMuY2xpZW50V2lkdGgsXG4gICAgICAgIHk6IGV2ZW50LmNsaWVudFkgKiBjYW52YXMuaGVpZ2h0IC8gY2FudmFzLmNsaWVudEhlaWdodFxuICAgICAgfTtcbiAgICAgIGNvbnN0IHBvcyA9IHtcbiAgICAgICAgaTogfn4obW91c2VQb3MueSAvIGNlbGxIZWlnaHQpLFxuICAgICAgICBqOiB+fihtb3VzZVBvcy54IC8gY2VsbFdpZHRoKVxuICAgICAgfTtcblxuICAgICAgdGhpcy5vbkRyYXcocG9zLmksIHBvcy5qKTtcbiAgICB9O1xuXG4gICAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGV2dCA9PiB7XG4gICAgICBtb3VzZURvd24gPSB0cnVlO1xuICAgICAgb25EcmF3KGV2dCk7XG4gICAgfSk7XG5cbiAgICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgb25EcmF3KTtcbiAgICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIGV2dCA9PiAobW91c2VEb3duID0gZmFsc2UpKTtcblxuICAgIGNvbnN0IGNvbG9yRm9yQ2VsbCA9IChzdGF0ZSwgbmVpZ2hib3VycykgPT4ge1xuICAgICAgcmV0dXJuIHN0YXRlID09PSAxID8gJ3doaXRlJyA6ICcjMjgyODI4JztcbiAgICB9O1xuXG4gICAgdGhpcy5yZW5kZXIgPSB3b3JsZCA9PiB7XG4gICAgICBjb250ZXh0LmNsZWFyUmVjdCgwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpO1xuICAgICAgY29udGV4dC5maWxsU3R5bGUgPSAnd2hpdGUnO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByb3dzOyBpKyspIHtcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBjb2xzOyBqKyspIHtcbiAgICAgICAgICBjb25zdCBqUHggPSBjZWxsV2lkdGggKiBqO1xuICAgICAgICAgIGNvbnN0IGlQeCA9IGNlbGxIZWlnaHQgKiBpO1xuICAgICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gY29sb3JGb3JDZWxsKFxuICAgICAgICAgICAgd29ybGQuZ2V0KGksIGopLFxuICAgICAgICAgICAgd29ybGQubmVpZ2hib3VycyhpLCBqKVxuICAgICAgICAgICk7XG4gICAgICAgICAgY29udGV4dC5maWxsUmVjdChqUHgsIGlQeCwgY2VsbFdpZHRoLCBjZWxsSGVpZ2h0KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gIH1cbn1cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL1JlbmRlcmVyLmpzXG4vLyBtb2R1bGUgaWQgPSAzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJzb3VyY2VSb290IjoiIn0=