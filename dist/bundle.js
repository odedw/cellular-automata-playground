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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__CanvasRenderer__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__lib_stats_min__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__lib_stats_min___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__lib_stats_min__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Options__ = __webpack_require__(5);





const stats = new __WEBPACK_IMPORTED_MODULE_2__lib_stats_min___default.a();
stats.showPanel(1);
// document.body.appendChild(stats.dom);

const pixelsPerCell = 4,
  cols = Math.ceil(window.innerWidth / pixelsPerCell),
  rows = Math.ceil(window.innerHeight / pixelsPerCell),
  renderer = new __WEBPACK_IMPORTED_MODULE_1__CanvasRenderer__["a" /* default */](cols, rows, pixelsPerCell, pixelsPerCell),
  engine = new __WEBPACK_IMPORTED_MODULE_0__Engine__["a" /* default */](
    cols, //number of columns
    rows, //number of rows
    renderer.render, //onTick
    60, //desired fps
    stats
  );
renderer.onDraw = engine.onDraw;
window.onload = () => {
  const gui = new dat.GUI();
  const options = new __WEBPACK_IMPORTED_MODULE_3__Options__["a" /* default */](
    gui,
    options => {
      renderer.reset(options);
      engine.start(options);
    },
    engine.pause,
    engine.play
  );
  options.reset();
};


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__World__ = __webpack_require__(2);


class Engine {
  constructor(cols, rows, onTick, desiredFps, stats) {
    let engineTime = 0,
      current,
      next,
      birth = '',
      survival = '',
      randomStart = false,
      birthMap = new Array(8),
      survivalMap = new Array(8),
      msTillNextFrame = 0,
      lastTickTime = 0,
      total = rows * cols,
      isRunning = false;

    const msPerFrame = 1000 / desiredFps;

    const computeNextState = () => {
      let nextState = 0;
      const diff = new Set();
      for (let i = 0; i < total; i++) {
        let neighbors = current.neighbours(i),
          currentState = current.get(i);

        nextState =
          currentState === 1 ? survivalMap[neighbors] : birthMap[neighbors];
        next.set(i, nextState);

        if (currentState !== nextState) {
          diff.add(i);
          const neighboursIndices = current.neighboursIndices[i];
          for (let j = 0; j < neighboursIndices.length; j++) {
            diff.add(neighboursIndices[j]);
          }
        }
      }
      const temp = current;
      current = next;
      next = temp;
      return diff;
    };

    const tick = () => {
      const startTime = performance.now(),
        msElapsed = startTime - lastTickTime;
      msTillNextFrame -= msElapsed;
      if (msTillNextFrame <= 0) {
        stats.begin();
        const diff = computeNextState();
        onTick(current, diff);
        stats.end();
        lastTickTime = performance.now();
        const timeForFrame = lastTickTime - startTime;
        msTillNextFrame = msPerFrame - timeForFrame;
      } else {
        lastTickTime = performance.now();
      }

      if (isRunning) window.requestAnimationFrame(tick);
    };

    const setOptions = options => {
      birth = options.birth || '2';
      survival = options.survival || '23';
      for (let i = 0; i < 8; i++) {
        birthMap[i] = birth.indexOf(i) >= 0 ? 1 : 0;
        survivalMap[i] = survival.indexOf(i) >= 0 ? 1 : 0;
      }

      randomStart = options.randomStart;
    };

    this.start = options => {
      setOptions(options);
      current = new __WEBPACK_IMPORTED_MODULE_0__World__["a" /* default */](rows, cols, randomStart);
      next = new __WEBPACK_IMPORTED_MODULE_0__World__["a" /* default */](rows, cols);
      isRunning = true;
      window.requestAnimationFrame(tick);
    };

    this.pause = () => {
      isRunning = false;
    };

    this.play = () => {
      isRunning = true;
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
  constructor(rows, cols, randomStart) {
    this.cells = new Uint8Array(new ArrayBuffer(rows * cols));
    const index = (i, j) => i * cols + j;
    this.neighboursIndices = new Array(cols * rows);
    this.get = i =>
      i >= 0 && i < this.cells.length ? this.cells[i] : undefined;

    this.set = (i, val) => (this.cells[i] = val);

    this.cross = (i, j) => {
      if (i - 1 > 0) this.cells[index(i - 1, j)] = 1;
      if (j - 1 > 0) this.cells[index(i, j - 1)] = 1;
      this.cells[index(i, j)] = 1;
      if (j + 1 > cols) this.cells[index(i, j + 1)] = 1;
      if (i + 1 < rows) this.cells[index(i + 1, j)] = 1;
    };

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        this.neighboursIndices[index(i, j)] = [];
        if (i - 1 >= 0 && j - 1 >= 0)
          this.neighboursIndices[index(i, j)].push(index(i - 1, j - 1));
        if (i - 1 >= 0)
          this.neighboursIndices[index(i, j)].push(index(i - 1, j));
        if (i - 1 >= 0 && j + 1 < cols)
          this.neighboursIndices[index(i, j)].push(index(i - 1, j + 1));

        if (j - 1 >= 0)
          this.neighboursIndices[index(i, j)].push(index(i, j - 1));
        if (j + 1 < cols)
          this.neighboursIndices[index(i, j)].push(index(i, j + 1));

        if (i + 1 < rows && j - 1 >= 0)
          this.neighboursIndices[index(i, j)].push(index(i + 1, j - 1));
        if (i + 1 < rows)
          this.neighboursIndices[index(i, j)].push(index(i + 1, j));
        if (i + 1 < rows && j + 1 < cols)
          this.neighboursIndices[index(i, j)].push(index(i + 1, j + 1));
      }
    }
    const count = (a, b) => a + this.cells[b];
    this.neighbours = i => this.neighboursIndices[i].reduce(count, 0);

    if (randomStart)
      for (let i = 0; i < this.cells.length; i++)
        this.cells[i] = Math.round(Math.random());
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = World;



/***/ }),
/* 3 */,
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

// stats.js - http://github.com/mrdoob/stats.js
(function(f,e){ true?module.exports=e():"function"===typeof define&&define.amd?define(e):f.Stats=e()})(this,function(){var f=function(){function e(a){c.appendChild(a.dom);return a}function u(a){for(var d=0;d<c.children.length;d++)c.children[d].style.display=d===a?"block":"none";l=a}var l=0,c=document.createElement("div");c.style.cssText="position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000";c.addEventListener("click",function(a){a.preventDefault();
u(++l%c.children.length)},!1);var k=(performance||Date).now(),g=k,a=0,r=e(new f.Panel("FPS","#0ff","#002")),h=e(new f.Panel("MS","#0f0","#020"));if(self.performance&&self.performance.memory)var t=e(new f.Panel("MB","#f08","#201"));u(0);return{REVISION:16,dom:c,addPanel:e,showPanel:u,begin:function(){k=(performance||Date).now()},end:function(){a++;var c=(performance||Date).now();h.update(c-k,200);if(c>g+1E3&&(r.update(1E3*a/(c-g),100),g=c,a=0,t)){var d=performance.memory;t.update(d.usedJSHeapSize/
1048576,d.jsHeapSizeLimit/1048576)}return c},update:function(){k=this.end()},domElement:c,setMode:u}};f.Panel=function(e,f,l){var c=Infinity,k=0,g=Math.round,a=g(window.devicePixelRatio||1),r=80*a,h=48*a,t=3*a,v=2*a,d=3*a,m=15*a,n=74*a,p=30*a,q=document.createElement("canvas");q.width=r;q.height=h;q.style.cssText="width:80px;height:48px";var b=q.getContext("2d");b.font="bold "+9*a+"px Helvetica,Arial,sans-serif";b.textBaseline="top";b.fillStyle=l;b.fillRect(0,0,r,h);b.fillStyle=f;b.fillText(e,t,v);
b.fillRect(d,m,n,p);b.fillStyle=l;b.globalAlpha=.9;b.fillRect(d,m,n,p);return{dom:q,update:function(h,w){c=Math.min(c,h);k=Math.max(k,h);b.fillStyle=l;b.globalAlpha=1;b.fillRect(0,0,r,m);b.fillStyle=f;b.fillText(g(h)+" "+e+" ("+g(c)+"-"+g(k)+")",t,v);b.drawImage(q,d+a,m,n-a,p,d,m,n-a,p);b.fillRect(d+n-a,m,a,p);b.fillStyle=l;b.globalAlpha=.9;b.fillRect(d+n-a,m,a,g((1-h/w)*p))}}};return f});


/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Options {
  constructor(gui, reset, pause, play) {
    this.birth = '3';
    this.survival = '23';
    this.randomStart = true;
    this.reset = () => reset(this);
    this.pause = pause;
    this.play = play;
    gui.add(this, 'birth');
    gui.add(this, 'survival');
    gui.add(this, 'randomStart');
    gui.add(this, 'reset');
    gui.closed = true;

    const colorsFolders = gui.addFolder('Colors (number of neighbours)');
    this.colors = [
      '',
      '#FFFFFF',
      '#FFFFFF',
      '#FFFFFF',
      '#FFFFFF',
      '#FFFFFF',
      '#FFFFFF',
      '#FFFFFF',
      '#FFFFFF'
    ];
    this.colors.dead = '#000000';
    colorsFolders.addColor(this.colors, '1');
    colorsFolders.addColor(this.colors, '2');
    colorsFolders.addColor(this.colors, '3');
    colorsFolders.addColor(this.colors, '4');
    colorsFolders.addColor(this.colors, '5');
    colorsFolders.addColor(this.colors, '6');
    colorsFolders.addColor(this.colors, '7');
    colorsFolders.addColor(this.colors, '8');
    colorsFolders.addColor(this.colors, 'dead');
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Options;



/***/ }),
/* 6 */,
/* 7 */,
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Renderer {
  constructor(cols, rows, cellWidth, cellHeight) {
    const canvas = document.createElement('canvas'),
      context = canvas.getContext('2d');
    document.body.appendChild(canvas);
    canvas.width = window.innerWidth;
    canvas.height = document.body.offsetHeight;
    const image = context.createImageData(canvas.width, canvas.height),
      imageData = new Int32Array(image.data.buffer),
      resetData = () => {
        for (var i = 0; i < canvas.width * canvas.height; i++) {
          imageData[i] = 0xff << 24;
        }
      };

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

    const liveColor = 0xff | (0xff << 8) | (0xff << 16) | (0xff << 24),
      deadColor = 0x00 | (0x00 << 8) | (0x00 << 16) | (0xff << 24);

    const hexToRgb = hex => {
      const result =
        /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex) || '#000000';
      return (
        parseInt(result[1], 16) |
        (parseInt(result[2], 16) << 8) |
        (parseInt(result[3], 16) << 16) |
        (0xff << 24)
      );
    };
    const fillSquare = (x, y, color) => {
      var width = cellWidth,
        height = cellHeight;

      if (x * cellWidth + width > canvas.width) {
        width = canvas.width - x * cellWidth;
      }

      if (y * cellHeight + height > canvas.height) {
        height = canvas.height - y * cellHeight;
      }

      if (width <= 0 || height <= 0) {
        return;
      }

      var pointer = x * cellWidth + y * canvas.width * cellHeight,
        rowWidth = canvas.width - width;

      for (var i = 0; i < height; i++) {
        for (var j = 0; j < width; j++) {
          imageData[pointer] = color;

          pointer++;
        }
        pointer += rowWidth;
      }
    };

    this.render = (world, diff) => {
      for (let index of diff) {
        fillSquare(
          index % cols,
          Math.floor(index / cols),
          world.cells[index] === 1
            ? this.colors[world.neighbours(index)]
            : // ? liveColor
              deadColor
        );
      }
      context.putImageData(image, 0, 0);
    };

    this.reset = options => {
      resetData();
      this.colors = options.colors.map(hexToRgb);
      context.putImageData(image, 0, 0);
    };
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Renderer;



/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgOTA5MDMyNGM5NWE5NjM5NTYwZDMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FwcC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvRW5naW5lLmpzIiwid2VicGFjazovLy8uL3NyYy9Xb3JsZC5qcyIsIndlYnBhY2s6Ly8vLi9saWIvc3RhdHMubWluLmpzIiwid2VicGFjazovLy8uL3NyYy9PcHRpb25zLmpzIiwid2VicGFjazovLy8uL3NyYy9DYW52YXNSZW5kZXJlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7O0FDN0RBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7QUNqQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIsV0FBVztB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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQSIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCA5MDkwMzI0Yzk1YTk2Mzk1NjBkMyIsImltcG9ydCBFbmdpbmUgZnJvbSAnLi9FbmdpbmUnO1xyXG5pbXBvcnQgUmVuZGVyZXIgZnJvbSAnLi9DYW52YXNSZW5kZXJlcic7XHJcbmltcG9ydCBTdGF0cyBmcm9tICcuLi9saWIvc3RhdHMubWluJztcclxuaW1wb3J0IE9wdGlvbnMgZnJvbSAnLi9PcHRpb25zJztcclxuXHJcbmNvbnN0IHN0YXRzID0gbmV3IFN0YXRzKCk7XHJcbnN0YXRzLnNob3dQYW5lbCgxKTtcclxuLy8gZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChzdGF0cy5kb20pO1xyXG5cclxuY29uc3QgcGl4ZWxzUGVyQ2VsbCA9IDQsXHJcbiAgY29scyA9IE1hdGguY2VpbCh3aW5kb3cuaW5uZXJXaWR0aCAvIHBpeGVsc1BlckNlbGwpLFxyXG4gIHJvd3MgPSBNYXRoLmNlaWwod2luZG93LmlubmVySGVpZ2h0IC8gcGl4ZWxzUGVyQ2VsbCksXHJcbiAgcmVuZGVyZXIgPSBuZXcgUmVuZGVyZXIoY29scywgcm93cywgcGl4ZWxzUGVyQ2VsbCwgcGl4ZWxzUGVyQ2VsbCksXHJcbiAgZW5naW5lID0gbmV3IEVuZ2luZShcclxuICAgIGNvbHMsIC8vbnVtYmVyIG9mIGNvbHVtbnNcclxuICAgIHJvd3MsIC8vbnVtYmVyIG9mIHJvd3NcclxuICAgIHJlbmRlcmVyLnJlbmRlciwgLy9vblRpY2tcclxuICAgIDYwLCAvL2Rlc2lyZWQgZnBzXHJcbiAgICBzdGF0c1xyXG4gICk7XHJcbnJlbmRlcmVyLm9uRHJhdyA9IGVuZ2luZS5vbkRyYXc7XHJcbndpbmRvdy5vbmxvYWQgPSAoKSA9PiB7XHJcbiAgY29uc3QgZ3VpID0gbmV3IGRhdC5HVUkoKTtcclxuICBjb25zdCBvcHRpb25zID0gbmV3IE9wdGlvbnMoXHJcbiAgICBndWksXHJcbiAgICBvcHRpb25zID0+IHtcclxuICAgICAgcmVuZGVyZXIucmVzZXQob3B0aW9ucyk7XHJcbiAgICAgIGVuZ2luZS5zdGFydChvcHRpb25zKTtcclxuICAgIH0sXHJcbiAgICBlbmdpbmUucGF1c2UsXHJcbiAgICBlbmdpbmUucGxheVxyXG4gICk7XHJcbiAgb3B0aW9ucy5yZXNldCgpO1xyXG59O1xyXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9hcHAuanNcbi8vIG1vZHVsZSBpZCA9IDBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IFdvcmxkIGZyb20gJy4vV29ybGQnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFbmdpbmUge1xuICBjb25zdHJ1Y3Rvcihjb2xzLCByb3dzLCBvblRpY2ssIGRlc2lyZWRGcHMsIHN0YXRzKSB7XG4gICAgbGV0IGVuZ2luZVRpbWUgPSAwLFxuICAgICAgY3VycmVudCxcbiAgICAgIG5leHQsXG4gICAgICBiaXJ0aCA9ICcnLFxuICAgICAgc3Vydml2YWwgPSAnJyxcbiAgICAgIHJhbmRvbVN0YXJ0ID0gZmFsc2UsXG4gICAgICBiaXJ0aE1hcCA9IG5ldyBBcnJheSg4KSxcbiAgICAgIHN1cnZpdmFsTWFwID0gbmV3IEFycmF5KDgpLFxuICAgICAgbXNUaWxsTmV4dEZyYW1lID0gMCxcbiAgICAgIGxhc3RUaWNrVGltZSA9IDAsXG4gICAgICB0b3RhbCA9IHJvd3MgKiBjb2xzLFxuICAgICAgaXNSdW5uaW5nID0gZmFsc2U7XG5cbiAgICBjb25zdCBtc1BlckZyYW1lID0gMTAwMCAvIGRlc2lyZWRGcHM7XG5cbiAgICBjb25zdCBjb21wdXRlTmV4dFN0YXRlID0gKCkgPT4ge1xuICAgICAgbGV0IG5leHRTdGF0ZSA9IDA7XG4gICAgICBjb25zdCBkaWZmID0gbmV3IFNldCgpO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0b3RhbDsgaSsrKSB7XG4gICAgICAgIGxldCBuZWlnaGJvcnMgPSBjdXJyZW50Lm5laWdoYm91cnMoaSksXG4gICAgICAgICAgY3VycmVudFN0YXRlID0gY3VycmVudC5nZXQoaSk7XG5cbiAgICAgICAgbmV4dFN0YXRlID1cbiAgICAgICAgICBjdXJyZW50U3RhdGUgPT09IDEgPyBzdXJ2aXZhbE1hcFtuZWlnaGJvcnNdIDogYmlydGhNYXBbbmVpZ2hib3JzXTtcbiAgICAgICAgbmV4dC5zZXQoaSwgbmV4dFN0YXRlKTtcblxuICAgICAgICBpZiAoY3VycmVudFN0YXRlICE9PSBuZXh0U3RhdGUpIHtcbiAgICAgICAgICBkaWZmLmFkZChpKTtcbiAgICAgICAgICBjb25zdCBuZWlnaGJvdXJzSW5kaWNlcyA9IGN1cnJlbnQubmVpZ2hib3Vyc0luZGljZXNbaV07XG4gICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBuZWlnaGJvdXJzSW5kaWNlcy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgZGlmZi5hZGQobmVpZ2hib3Vyc0luZGljZXNbal0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgY29uc3QgdGVtcCA9IGN1cnJlbnQ7XG4gICAgICBjdXJyZW50ID0gbmV4dDtcbiAgICAgIG5leHQgPSB0ZW1wO1xuICAgICAgcmV0dXJuIGRpZmY7XG4gICAgfTtcblxuICAgIGNvbnN0IHRpY2sgPSAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFydFRpbWUgPSBwZXJmb3JtYW5jZS5ub3coKSxcbiAgICAgICAgbXNFbGFwc2VkID0gc3RhcnRUaW1lIC0gbGFzdFRpY2tUaW1lO1xuICAgICAgbXNUaWxsTmV4dEZyYW1lIC09IG1zRWxhcHNlZDtcbiAgICAgIGlmIChtc1RpbGxOZXh0RnJhbWUgPD0gMCkge1xuICAgICAgICBzdGF0cy5iZWdpbigpO1xuICAgICAgICBjb25zdCBkaWZmID0gY29tcHV0ZU5leHRTdGF0ZSgpO1xuICAgICAgICBvblRpY2soY3VycmVudCwgZGlmZik7XG4gICAgICAgIHN0YXRzLmVuZCgpO1xuICAgICAgICBsYXN0VGlja1RpbWUgPSBwZXJmb3JtYW5jZS5ub3coKTtcbiAgICAgICAgY29uc3QgdGltZUZvckZyYW1lID0gbGFzdFRpY2tUaW1lIC0gc3RhcnRUaW1lO1xuICAgICAgICBtc1RpbGxOZXh0RnJhbWUgPSBtc1BlckZyYW1lIC0gdGltZUZvckZyYW1lO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGFzdFRpY2tUaW1lID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChpc1J1bm5pbmcpIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGljayk7XG4gICAgfTtcblxuICAgIGNvbnN0IHNldE9wdGlvbnMgPSBvcHRpb25zID0+IHtcbiAgICAgIGJpcnRoID0gb3B0aW9ucy5iaXJ0aCB8fCAnMic7XG4gICAgICBzdXJ2aXZhbCA9IG9wdGlvbnMuc3Vydml2YWwgfHwgJzIzJztcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgODsgaSsrKSB7XG4gICAgICAgIGJpcnRoTWFwW2ldID0gYmlydGguaW5kZXhPZihpKSA+PSAwID8gMSA6IDA7XG4gICAgICAgIHN1cnZpdmFsTWFwW2ldID0gc3Vydml2YWwuaW5kZXhPZihpKSA+PSAwID8gMSA6IDA7XG4gICAgICB9XG5cbiAgICAgIHJhbmRvbVN0YXJ0ID0gb3B0aW9ucy5yYW5kb21TdGFydDtcbiAgICB9O1xuXG4gICAgdGhpcy5zdGFydCA9IG9wdGlvbnMgPT4ge1xuICAgICAgc2V0T3B0aW9ucyhvcHRpb25zKTtcbiAgICAgIGN1cnJlbnQgPSBuZXcgV29ybGQocm93cywgY29scywgcmFuZG9tU3RhcnQpO1xuICAgICAgbmV4dCA9IG5ldyBXb3JsZChyb3dzLCBjb2xzKTtcbiAgICAgIGlzUnVubmluZyA9IHRydWU7XG4gICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRpY2spO1xuICAgIH07XG5cbiAgICB0aGlzLnBhdXNlID0gKCkgPT4ge1xuICAgICAgaXNSdW5uaW5nID0gZmFsc2U7XG4gICAgfTtcblxuICAgIHRoaXMucGxheSA9ICgpID0+IHtcbiAgICAgIGlzUnVubmluZyA9IHRydWU7XG4gICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRpY2spO1xuICAgIH07XG5cbiAgICB0aGlzLm9uRHJhdyA9IChpLCBqKSA9PiB7XG4gICAgICBjdXJyZW50LmNyb3NzKGksIGopO1xuICAgIH07XG4gIH1cbn1cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL0VuZ2luZS5qc1xuLy8gbW9kdWxlIGlkID0gMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBXb3JsZCB7XG4gIGNvbnN0cnVjdG9yKHJvd3MsIGNvbHMsIHJhbmRvbVN0YXJ0KSB7XG4gICAgdGhpcy5jZWxscyA9IG5ldyBVaW50OEFycmF5KG5ldyBBcnJheUJ1ZmZlcihyb3dzICogY29scykpO1xuICAgIGNvbnN0IGluZGV4ID0gKGksIGopID0+IGkgKiBjb2xzICsgajtcbiAgICB0aGlzLm5laWdoYm91cnNJbmRpY2VzID0gbmV3IEFycmF5KGNvbHMgKiByb3dzKTtcbiAgICB0aGlzLmdldCA9IGkgPT5cbiAgICAgIGkgPj0gMCAmJiBpIDwgdGhpcy5jZWxscy5sZW5ndGggPyB0aGlzLmNlbGxzW2ldIDogdW5kZWZpbmVkO1xuXG4gICAgdGhpcy5zZXQgPSAoaSwgdmFsKSA9PiAodGhpcy5jZWxsc1tpXSA9IHZhbCk7XG5cbiAgICB0aGlzLmNyb3NzID0gKGksIGopID0+IHtcbiAgICAgIGlmIChpIC0gMSA+IDApIHRoaXMuY2VsbHNbaW5kZXgoaSAtIDEsIGopXSA9IDE7XG4gICAgICBpZiAoaiAtIDEgPiAwKSB0aGlzLmNlbGxzW2luZGV4KGksIGogLSAxKV0gPSAxO1xuICAgICAgdGhpcy5jZWxsc1tpbmRleChpLCBqKV0gPSAxO1xuICAgICAgaWYgKGogKyAxID4gY29scykgdGhpcy5jZWxsc1tpbmRleChpLCBqICsgMSldID0gMTtcbiAgICAgIGlmIChpICsgMSA8IHJvd3MpIHRoaXMuY2VsbHNbaW5kZXgoaSArIDEsIGopXSA9IDE7XG4gICAgfTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcm93czsgaSsrKSB7XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGNvbHM7IGorKykge1xuICAgICAgICB0aGlzLm5laWdoYm91cnNJbmRpY2VzW2luZGV4KGksIGopXSA9IFtdO1xuICAgICAgICBpZiAoaSAtIDEgPj0gMCAmJiBqIC0gMSA+PSAwKVxuICAgICAgICAgIHRoaXMubmVpZ2hib3Vyc0luZGljZXNbaW5kZXgoaSwgaildLnB1c2goaW5kZXgoaSAtIDEsIGogLSAxKSk7XG4gICAgICAgIGlmIChpIC0gMSA+PSAwKVxuICAgICAgICAgIHRoaXMubmVpZ2hib3Vyc0luZGljZXNbaW5kZXgoaSwgaildLnB1c2goaW5kZXgoaSAtIDEsIGopKTtcbiAgICAgICAgaWYgKGkgLSAxID49IDAgJiYgaiArIDEgPCBjb2xzKVxuICAgICAgICAgIHRoaXMubmVpZ2hib3Vyc0luZGljZXNbaW5kZXgoaSwgaildLnB1c2goaW5kZXgoaSAtIDEsIGogKyAxKSk7XG5cbiAgICAgICAgaWYgKGogLSAxID49IDApXG4gICAgICAgICAgdGhpcy5uZWlnaGJvdXJzSW5kaWNlc1tpbmRleChpLCBqKV0ucHVzaChpbmRleChpLCBqIC0gMSkpO1xuICAgICAgICBpZiAoaiArIDEgPCBjb2xzKVxuICAgICAgICAgIHRoaXMubmVpZ2hib3Vyc0luZGljZXNbaW5kZXgoaSwgaildLnB1c2goaW5kZXgoaSwgaiArIDEpKTtcblxuICAgICAgICBpZiAoaSArIDEgPCByb3dzICYmIGogLSAxID49IDApXG4gICAgICAgICAgdGhpcy5uZWlnaGJvdXJzSW5kaWNlc1tpbmRleChpLCBqKV0ucHVzaChpbmRleChpICsgMSwgaiAtIDEpKTtcbiAgICAgICAgaWYgKGkgKyAxIDwgcm93cylcbiAgICAgICAgICB0aGlzLm5laWdoYm91cnNJbmRpY2VzW2luZGV4KGksIGopXS5wdXNoKGluZGV4KGkgKyAxLCBqKSk7XG4gICAgICAgIGlmIChpICsgMSA8IHJvd3MgJiYgaiArIDEgPCBjb2xzKVxuICAgICAgICAgIHRoaXMubmVpZ2hib3Vyc0luZGljZXNbaW5kZXgoaSwgaildLnB1c2goaW5kZXgoaSArIDEsIGogKyAxKSk7XG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IGNvdW50ID0gKGEsIGIpID0+IGEgKyB0aGlzLmNlbGxzW2JdO1xuICAgIHRoaXMubmVpZ2hib3VycyA9IGkgPT4gdGhpcy5uZWlnaGJvdXJzSW5kaWNlc1tpXS5yZWR1Y2UoY291bnQsIDApO1xuXG4gICAgaWYgKHJhbmRvbVN0YXJ0KVxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNlbGxzLmxlbmd0aDsgaSsrKVxuICAgICAgICB0aGlzLmNlbGxzW2ldID0gTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpKTtcbiAgfVxufVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvV29ybGQuanNcbi8vIG1vZHVsZSBpZCA9IDJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gc3RhdHMuanMgLSBodHRwOi8vZ2l0aHViLmNvbS9tcmRvb2Ivc3RhdHMuanNcbihmdW5jdGlvbihmLGUpe1wib2JqZWN0XCI9PT10eXBlb2YgZXhwb3J0cyYmXCJ1bmRlZmluZWRcIiE9PXR5cGVvZiBtb2R1bGU/bW9kdWxlLmV4cG9ydHM9ZSgpOlwiZnVuY3Rpb25cIj09PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKGUpOmYuU3RhdHM9ZSgpfSkodGhpcyxmdW5jdGlvbigpe3ZhciBmPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gZShhKXtjLmFwcGVuZENoaWxkKGEuZG9tKTtyZXR1cm4gYX1mdW5jdGlvbiB1KGEpe2Zvcih2YXIgZD0wO2Q8Yy5jaGlsZHJlbi5sZW5ndGg7ZCsrKWMuY2hpbGRyZW5bZF0uc3R5bGUuZGlzcGxheT1kPT09YT9cImJsb2NrXCI6XCJub25lXCI7bD1hfXZhciBsPTAsYz1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO2Muc3R5bGUuY3NzVGV4dD1cInBvc2l0aW9uOmZpeGVkO3RvcDowO2xlZnQ6MDtjdXJzb3I6cG9pbnRlcjtvcGFjaXR5OjAuOTt6LWluZGV4OjEwMDAwXCI7Yy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIixmdW5jdGlvbihhKXthLnByZXZlbnREZWZhdWx0KCk7XG51KCsrbCVjLmNoaWxkcmVuLmxlbmd0aCl9LCExKTt2YXIgaz0ocGVyZm9ybWFuY2V8fERhdGUpLm5vdygpLGc9ayxhPTAscj1lKG5ldyBmLlBhbmVsKFwiRlBTXCIsXCIjMGZmXCIsXCIjMDAyXCIpKSxoPWUobmV3IGYuUGFuZWwoXCJNU1wiLFwiIzBmMFwiLFwiIzAyMFwiKSk7aWYoc2VsZi5wZXJmb3JtYW5jZSYmc2VsZi5wZXJmb3JtYW5jZS5tZW1vcnkpdmFyIHQ9ZShuZXcgZi5QYW5lbChcIk1CXCIsXCIjZjA4XCIsXCIjMjAxXCIpKTt1KDApO3JldHVybntSRVZJU0lPTjoxNixkb206YyxhZGRQYW5lbDplLHNob3dQYW5lbDp1LGJlZ2luOmZ1bmN0aW9uKCl7az0ocGVyZm9ybWFuY2V8fERhdGUpLm5vdygpfSxlbmQ6ZnVuY3Rpb24oKXthKys7dmFyIGM9KHBlcmZvcm1hbmNlfHxEYXRlKS5ub3coKTtoLnVwZGF0ZShjLWssMjAwKTtpZihjPmcrMUUzJiYoci51cGRhdGUoMUUzKmEvKGMtZyksMTAwKSxnPWMsYT0wLHQpKXt2YXIgZD1wZXJmb3JtYW5jZS5tZW1vcnk7dC51cGRhdGUoZC51c2VkSlNIZWFwU2l6ZS9cbjEwNDg1NzYsZC5qc0hlYXBTaXplTGltaXQvMTA0ODU3Nil9cmV0dXJuIGN9LHVwZGF0ZTpmdW5jdGlvbigpe2s9dGhpcy5lbmQoKX0sZG9tRWxlbWVudDpjLHNldE1vZGU6dX19O2YuUGFuZWw9ZnVuY3Rpb24oZSxmLGwpe3ZhciBjPUluZmluaXR5LGs9MCxnPU1hdGgucm91bmQsYT1nKHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvfHwxKSxyPTgwKmEsaD00OCphLHQ9MyphLHY9MiphLGQ9MyphLG09MTUqYSxuPTc0KmEscD0zMCphLHE9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtxLndpZHRoPXI7cS5oZWlnaHQ9aDtxLnN0eWxlLmNzc1RleHQ9XCJ3aWR0aDo4MHB4O2hlaWdodDo0OHB4XCI7dmFyIGI9cS5nZXRDb250ZXh0KFwiMmRcIik7Yi5mb250PVwiYm9sZCBcIis5KmErXCJweCBIZWx2ZXRpY2EsQXJpYWwsc2Fucy1zZXJpZlwiO2IudGV4dEJhc2VsaW5lPVwidG9wXCI7Yi5maWxsU3R5bGU9bDtiLmZpbGxSZWN0KDAsMCxyLGgpO2IuZmlsbFN0eWxlPWY7Yi5maWxsVGV4dChlLHQsdik7XG5iLmZpbGxSZWN0KGQsbSxuLHApO2IuZmlsbFN0eWxlPWw7Yi5nbG9iYWxBbHBoYT0uOTtiLmZpbGxSZWN0KGQsbSxuLHApO3JldHVybntkb206cSx1cGRhdGU6ZnVuY3Rpb24oaCx3KXtjPU1hdGgubWluKGMsaCk7az1NYXRoLm1heChrLGgpO2IuZmlsbFN0eWxlPWw7Yi5nbG9iYWxBbHBoYT0xO2IuZmlsbFJlY3QoMCwwLHIsbSk7Yi5maWxsU3R5bGU9ZjtiLmZpbGxUZXh0KGcoaCkrXCIgXCIrZStcIiAoXCIrZyhjKStcIi1cIitnKGspK1wiKVwiLHQsdik7Yi5kcmF3SW1hZ2UocSxkK2EsbSxuLWEscCxkLG0sbi1hLHApO2IuZmlsbFJlY3QoZCtuLWEsbSxhLHApO2IuZmlsbFN0eWxlPWw7Yi5nbG9iYWxBbHBoYT0uOTtiLmZpbGxSZWN0KGQrbi1hLG0sYSxnKCgxLWgvdykqcCkpfX19O3JldHVybiBmfSk7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2xpYi9zdGF0cy5taW4uanNcbi8vIG1vZHVsZSBpZCA9IDRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgT3B0aW9ucyB7XG4gIGNvbnN0cnVjdG9yKGd1aSwgcmVzZXQsIHBhdXNlLCBwbGF5KSB7XG4gICAgdGhpcy5iaXJ0aCA9ICczJztcbiAgICB0aGlzLnN1cnZpdmFsID0gJzIzJztcbiAgICB0aGlzLnJhbmRvbVN0YXJ0ID0gdHJ1ZTtcbiAgICB0aGlzLnJlc2V0ID0gKCkgPT4gcmVzZXQodGhpcyk7XG4gICAgdGhpcy5wYXVzZSA9IHBhdXNlO1xuICAgIHRoaXMucGxheSA9IHBsYXk7XG4gICAgZ3VpLmFkZCh0aGlzLCAnYmlydGgnKTtcbiAgICBndWkuYWRkKHRoaXMsICdzdXJ2aXZhbCcpO1xuICAgIGd1aS5hZGQodGhpcywgJ3JhbmRvbVN0YXJ0Jyk7XG4gICAgZ3VpLmFkZCh0aGlzLCAncmVzZXQnKTtcbiAgICBndWkuY2xvc2VkID0gdHJ1ZTtcblxuICAgIGNvbnN0IGNvbG9yc0ZvbGRlcnMgPSBndWkuYWRkRm9sZGVyKCdDb2xvcnMgKG51bWJlciBvZiBuZWlnaGJvdXJzKScpO1xuICAgIHRoaXMuY29sb3JzID0gW1xuICAgICAgJycsXG4gICAgICAnI0ZGRkZGRicsXG4gICAgICAnI0ZGRkZGRicsXG4gICAgICAnI0ZGRkZGRicsXG4gICAgICAnI0ZGRkZGRicsXG4gICAgICAnI0ZGRkZGRicsXG4gICAgICAnI0ZGRkZGRicsXG4gICAgICAnI0ZGRkZGRicsXG4gICAgICAnI0ZGRkZGRidcbiAgICBdO1xuICAgIHRoaXMuY29sb3JzLmRlYWQgPSAnIzAwMDAwMCc7XG4gICAgY29sb3JzRm9sZGVycy5hZGRDb2xvcih0aGlzLmNvbG9ycywgJzEnKTtcbiAgICBjb2xvcnNGb2xkZXJzLmFkZENvbG9yKHRoaXMuY29sb3JzLCAnMicpO1xuICAgIGNvbG9yc0ZvbGRlcnMuYWRkQ29sb3IodGhpcy5jb2xvcnMsICczJyk7XG4gICAgY29sb3JzRm9sZGVycy5hZGRDb2xvcih0aGlzLmNvbG9ycywgJzQnKTtcbiAgICBjb2xvcnNGb2xkZXJzLmFkZENvbG9yKHRoaXMuY29sb3JzLCAnNScpO1xuICAgIGNvbG9yc0ZvbGRlcnMuYWRkQ29sb3IodGhpcy5jb2xvcnMsICc2Jyk7XG4gICAgY29sb3JzRm9sZGVycy5hZGRDb2xvcih0aGlzLmNvbG9ycywgJzcnKTtcbiAgICBjb2xvcnNGb2xkZXJzLmFkZENvbG9yKHRoaXMuY29sb3JzLCAnOCcpO1xuICAgIGNvbG9yc0ZvbGRlcnMuYWRkQ29sb3IodGhpcy5jb2xvcnMsICdkZWFkJyk7XG4gIH1cbn1cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL09wdGlvbnMuanNcbi8vIG1vZHVsZSBpZCA9IDVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVuZGVyZXIge1xuICBjb25zdHJ1Y3Rvcihjb2xzLCByb3dzLCBjZWxsV2lkdGgsIGNlbGxIZWlnaHQpIHtcbiAgICBjb25zdCBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKSxcbiAgICAgIGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGNhbnZhcyk7XG4gICAgY2FudmFzLndpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG4gICAgY2FudmFzLmhlaWdodCA9IGRvY3VtZW50LmJvZHkub2Zmc2V0SGVpZ2h0O1xuICAgIGNvbnN0IGltYWdlID0gY29udGV4dC5jcmVhdGVJbWFnZURhdGEoY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KSxcbiAgICAgIGltYWdlRGF0YSA9IG5ldyBJbnQzMkFycmF5KGltYWdlLmRhdGEuYnVmZmVyKSxcbiAgICAgIHJlc2V0RGF0YSA9ICgpID0+IHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjYW52YXMud2lkdGggKiBjYW52YXMuaGVpZ2h0OyBpKyspIHtcbiAgICAgICAgICBpbWFnZURhdGFbaV0gPSAweGZmIDw8IDI0O1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgbGV0IG1vdXNlRG93biA9IGZhbHNlO1xuXG4gICAgY29uc3Qgb25EcmF3ID0gZXZlbnQgPT4ge1xuICAgICAgaWYgKCFtb3VzZURvd24pIHJldHVybjtcblxuICAgICAgY29uc3QgcmVjdCA9IGNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgIGNvbnN0IG1vdXNlUG9zID0ge1xuICAgICAgICB4OiBldmVudC5jbGllbnRYICogY2FudmFzLndpZHRoIC8gY2FudmFzLmNsaWVudFdpZHRoLFxuICAgICAgICB5OiBldmVudC5jbGllbnRZICogY2FudmFzLmhlaWdodCAvIGNhbnZhcy5jbGllbnRIZWlnaHRcbiAgICAgIH07XG4gICAgICBjb25zdCBwb3MgPSB7XG4gICAgICAgIGk6IH5+KG1vdXNlUG9zLnkgLyBjZWxsSGVpZ2h0KSxcbiAgICAgICAgajogfn4obW91c2VQb3MueCAvIGNlbGxXaWR0aClcbiAgICAgIH07XG5cbiAgICAgIHRoaXMub25EcmF3KHBvcy5pLCBwb3Muaik7XG4gICAgfTtcblxuICAgIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBldnQgPT4ge1xuICAgICAgbW91c2VEb3duID0gdHJ1ZTtcbiAgICAgIG9uRHJhdyhldnQpO1xuICAgIH0pO1xuXG4gICAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIG9uRHJhdyk7XG4gICAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBldnQgPT4gKG1vdXNlRG93biA9IGZhbHNlKSk7XG5cbiAgICBjb25zdCBsaXZlQ29sb3IgPSAweGZmIHwgKDB4ZmYgPDwgOCkgfCAoMHhmZiA8PCAxNikgfCAoMHhmZiA8PCAyNCksXG4gICAgICBkZWFkQ29sb3IgPSAweDAwIHwgKDB4MDAgPDwgOCkgfCAoMHgwMCA8PCAxNikgfCAoMHhmZiA8PCAyNCk7XG5cbiAgICBjb25zdCBoZXhUb1JnYiA9IGhleCA9PiB7XG4gICAgICBjb25zdCByZXN1bHQgPVxuICAgICAgICAvXiM/KFthLWZcXGRdezJ9KShbYS1mXFxkXXsyfSkoW2EtZlxcZF17Mn0pJC9pLmV4ZWMoaGV4KSB8fCAnIzAwMDAwMCc7XG4gICAgICByZXR1cm4gKFxuICAgICAgICBwYXJzZUludChyZXN1bHRbMV0sIDE2KSB8XG4gICAgICAgIChwYXJzZUludChyZXN1bHRbMl0sIDE2KSA8PCA4KSB8XG4gICAgICAgIChwYXJzZUludChyZXN1bHRbM10sIDE2KSA8PCAxNikgfFxuICAgICAgICAoMHhmZiA8PCAyNClcbiAgICAgICk7XG4gICAgfTtcbiAgICBjb25zdCBmaWxsU3F1YXJlID0gKHgsIHksIGNvbG9yKSA9PiB7XG4gICAgICB2YXIgd2lkdGggPSBjZWxsV2lkdGgsXG4gICAgICAgIGhlaWdodCA9IGNlbGxIZWlnaHQ7XG5cbiAgICAgIGlmICh4ICogY2VsbFdpZHRoICsgd2lkdGggPiBjYW52YXMud2lkdGgpIHtcbiAgICAgICAgd2lkdGggPSBjYW52YXMud2lkdGggLSB4ICogY2VsbFdpZHRoO1xuICAgICAgfVxuXG4gICAgICBpZiAoeSAqIGNlbGxIZWlnaHQgKyBoZWlnaHQgPiBjYW52YXMuaGVpZ2h0KSB7XG4gICAgICAgIGhlaWdodCA9IGNhbnZhcy5oZWlnaHQgLSB5ICogY2VsbEhlaWdodDtcbiAgICAgIH1cblxuICAgICAgaWYgKHdpZHRoIDw9IDAgfHwgaGVpZ2h0IDw9IDApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YXIgcG9pbnRlciA9IHggKiBjZWxsV2lkdGggKyB5ICogY2FudmFzLndpZHRoICogY2VsbEhlaWdodCxcbiAgICAgICAgcm93V2lkdGggPSBjYW52YXMud2lkdGggLSB3aWR0aDtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBoZWlnaHQ7IGkrKykge1xuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHdpZHRoOyBqKyspIHtcbiAgICAgICAgICBpbWFnZURhdGFbcG9pbnRlcl0gPSBjb2xvcjtcblxuICAgICAgICAgIHBvaW50ZXIrKztcbiAgICAgICAgfVxuICAgICAgICBwb2ludGVyICs9IHJvd1dpZHRoO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB0aGlzLnJlbmRlciA9ICh3b3JsZCwgZGlmZikgPT4ge1xuICAgICAgZm9yIChsZXQgaW5kZXggb2YgZGlmZikge1xuICAgICAgICBmaWxsU3F1YXJlKFxuICAgICAgICAgIGluZGV4ICUgY29scyxcbiAgICAgICAgICBNYXRoLmZsb29yKGluZGV4IC8gY29scyksXG4gICAgICAgICAgd29ybGQuY2VsbHNbaW5kZXhdID09PSAxXG4gICAgICAgICAgICA/IHRoaXMuY29sb3JzW3dvcmxkLm5laWdoYm91cnMoaW5kZXgpXVxuICAgICAgICAgICAgOiAvLyA/IGxpdmVDb2xvclxuICAgICAgICAgICAgICBkZWFkQ29sb3JcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIGNvbnRleHQucHV0SW1hZ2VEYXRhKGltYWdlLCAwLCAwKTtcbiAgICB9O1xuXG4gICAgdGhpcy5yZXNldCA9IG9wdGlvbnMgPT4ge1xuICAgICAgcmVzZXREYXRhKCk7XG4gICAgICB0aGlzLmNvbG9ycyA9IG9wdGlvbnMuY29sb3JzLm1hcChoZXhUb1JnYik7XG4gICAgICBjb250ZXh0LnB1dEltYWdlRGF0YShpbWFnZSwgMCwgMCk7XG4gICAgfTtcbiAgfVxufVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvQ2FudmFzUmVuZGVyZXIuanNcbi8vIG1vZHVsZSBpZCA9IDhcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==