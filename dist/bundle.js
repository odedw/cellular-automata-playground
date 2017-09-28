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
    const rulesFolder = gui.addFolder('rules');
    rulesFolder.add(this, 'birth');
    rulesFolder.add(this, 'survival');
    gui.closed = true;

    const colorsFolders = gui.addFolder('colors by neighbours');
    this.colors = [];
    const resetColors = () => {
      this.colors[0] = '';
      this.colors[1] = '#FFFFFF';
      this.colors[2] = '#FFFFFF';
      this.colors[3] = '#FFFFFF';
      this.colors[4] = '#FFFFFF';
      this.colors[5] = '#FFFFFF';
      this.colors[6] = '#FFFFFF';
      this.colors[7] = '#FFFFFF';
      this.colors[8] = '#FFFFFF';
    };
    resetColors();
    const letters = '0123456789ABCDEF';
    const randomColor = () => {
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    };
    this.colors.random = () => {
      for (let i = 0; i < this.colors.length; i++) {
        this.colors[i] = randomColor();
      }
    };
    this.colors.blackWhite = () => resetColors();
    colorsFolders.addColor(this.colors, '1').listen();
    colorsFolders.addColor(this.colors, '2').listen();
    colorsFolders.addColor(this.colors, '3').listen();
    colorsFolders.addColor(this.colors, '4').listen();
    colorsFolders.addColor(this.colors, '5').listen();
    colorsFolders.addColor(this.colors, '6').listen();
    colorsFolders.addColor(this.colors, '7').listen();
    colorsFolders.addColor(this.colors, '8').listen();
    colorsFolders.add(this.colors, 'random');
    colorsFolders.add(this.colors, 'blackWhite').name('black & white');
    gui.add(this, 'randomStart').name('random start');
    gui.add(this, 'reset').name('set & go');
    // colorsFolders.addColor(this.colors, 'dead');
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZWQ0ZGNlMmFmYzNjZTg4NWNlNDUiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FwcC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvRW5naW5lLmpzIiwid2VicGFjazovLy8uL3NyYy9Xb3JsZC5qcyIsIndlYnBhY2s6Ly8vLi9saWIvc3RhdHMubWluLmpzIiwid2VicGFjazovLy8uL3NyYy9PcHRpb25zLmpzIiwid2VicGFjazovLy8uL3NyYy9DYW52YXNSZW5kZXJlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7O0FDN0RBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7QUNqQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIsV0FBVztB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QUNBOztBQUVBO0FBQ0E7O0FBRUEscUJBQXFCLFlBQVk7QUFDakMsdUJBQXVCLFdBQVc7QUFDbEM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUEiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgZWQ0ZGNlMmFmYzNjZTg4NWNlNDUiLCJpbXBvcnQgRW5naW5lIGZyb20gJy4vRW5naW5lJztcclxuaW1wb3J0IFJlbmRlcmVyIGZyb20gJy4vQ2FudmFzUmVuZGVyZXInO1xyXG5pbXBvcnQgU3RhdHMgZnJvbSAnLi4vbGliL3N0YXRzLm1pbic7XHJcbmltcG9ydCBPcHRpb25zIGZyb20gJy4vT3B0aW9ucyc7XHJcblxyXG5jb25zdCBzdGF0cyA9IG5ldyBTdGF0cygpO1xyXG5zdGF0cy5zaG93UGFuZWwoMSk7XHJcbi8vIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoc3RhdHMuZG9tKTtcclxuXHJcbmNvbnN0IHBpeGVsc1BlckNlbGwgPSA0LFxyXG4gIGNvbHMgPSBNYXRoLmNlaWwod2luZG93LmlubmVyV2lkdGggLyBwaXhlbHNQZXJDZWxsKSxcclxuICByb3dzID0gTWF0aC5jZWlsKHdpbmRvdy5pbm5lckhlaWdodCAvIHBpeGVsc1BlckNlbGwpLFxyXG4gIHJlbmRlcmVyID0gbmV3IFJlbmRlcmVyKGNvbHMsIHJvd3MsIHBpeGVsc1BlckNlbGwsIHBpeGVsc1BlckNlbGwpLFxyXG4gIGVuZ2luZSA9IG5ldyBFbmdpbmUoXHJcbiAgICBjb2xzLCAvL251bWJlciBvZiBjb2x1bW5zXHJcbiAgICByb3dzLCAvL251bWJlciBvZiByb3dzXHJcbiAgICByZW5kZXJlci5yZW5kZXIsIC8vb25UaWNrXHJcbiAgICA2MCwgLy9kZXNpcmVkIGZwc1xyXG4gICAgc3RhdHNcclxuICApO1xyXG5yZW5kZXJlci5vbkRyYXcgPSBlbmdpbmUub25EcmF3O1xyXG53aW5kb3cub25sb2FkID0gKCkgPT4ge1xyXG4gIGNvbnN0IGd1aSA9IG5ldyBkYXQuR1VJKCk7XHJcbiAgY29uc3Qgb3B0aW9ucyA9IG5ldyBPcHRpb25zKFxyXG4gICAgZ3VpLFxyXG4gICAgb3B0aW9ucyA9PiB7XHJcbiAgICAgIHJlbmRlcmVyLnJlc2V0KG9wdGlvbnMpO1xyXG4gICAgICBlbmdpbmUuc3RhcnQob3B0aW9ucyk7XHJcbiAgICB9LFxyXG4gICAgZW5naW5lLnBhdXNlLFxyXG4gICAgZW5naW5lLnBsYXlcclxuICApO1xyXG4gIG9wdGlvbnMucmVzZXQoKTtcclxufTtcclxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvYXBwLmpzXG4vLyBtb2R1bGUgaWQgPSAwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCBXb3JsZCBmcm9tICcuL1dvcmxkJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRW5naW5lIHtcbiAgY29uc3RydWN0b3IoY29scywgcm93cywgb25UaWNrLCBkZXNpcmVkRnBzLCBzdGF0cykge1xuICAgIGxldCBlbmdpbmVUaW1lID0gMCxcbiAgICAgIGN1cnJlbnQsXG4gICAgICBuZXh0LFxuICAgICAgYmlydGggPSAnJyxcbiAgICAgIHN1cnZpdmFsID0gJycsXG4gICAgICByYW5kb21TdGFydCA9IGZhbHNlLFxuICAgICAgYmlydGhNYXAgPSBuZXcgQXJyYXkoOCksXG4gICAgICBzdXJ2aXZhbE1hcCA9IG5ldyBBcnJheSg4KSxcbiAgICAgIG1zVGlsbE5leHRGcmFtZSA9IDAsXG4gICAgICBsYXN0VGlja1RpbWUgPSAwLFxuICAgICAgdG90YWwgPSByb3dzICogY29scyxcbiAgICAgIGlzUnVubmluZyA9IGZhbHNlO1xuXG4gICAgY29uc3QgbXNQZXJGcmFtZSA9IDEwMDAgLyBkZXNpcmVkRnBzO1xuXG4gICAgY29uc3QgY29tcHV0ZU5leHRTdGF0ZSA9ICgpID0+IHtcbiAgICAgIGxldCBuZXh0U3RhdGUgPSAwO1xuICAgICAgY29uc3QgZGlmZiA9IG5ldyBTZXQoKTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdG90YWw7IGkrKykge1xuICAgICAgICBsZXQgbmVpZ2hib3JzID0gY3VycmVudC5uZWlnaGJvdXJzKGkpLFxuICAgICAgICAgIGN1cnJlbnRTdGF0ZSA9IGN1cnJlbnQuZ2V0KGkpO1xuXG4gICAgICAgIG5leHRTdGF0ZSA9XG4gICAgICAgICAgY3VycmVudFN0YXRlID09PSAxID8gc3Vydml2YWxNYXBbbmVpZ2hib3JzXSA6IGJpcnRoTWFwW25laWdoYm9yc107XG4gICAgICAgIG5leHQuc2V0KGksIG5leHRTdGF0ZSk7XG5cbiAgICAgICAgaWYgKGN1cnJlbnRTdGF0ZSAhPT0gbmV4dFN0YXRlKSB7XG4gICAgICAgICAgZGlmZi5hZGQoaSk7XG4gICAgICAgICAgY29uc3QgbmVpZ2hib3Vyc0luZGljZXMgPSBjdXJyZW50Lm5laWdoYm91cnNJbmRpY2VzW2ldO1xuICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgbmVpZ2hib3Vyc0luZGljZXMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgIGRpZmYuYWRkKG5laWdoYm91cnNJbmRpY2VzW2pdKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGNvbnN0IHRlbXAgPSBjdXJyZW50O1xuICAgICAgY3VycmVudCA9IG5leHQ7XG4gICAgICBuZXh0ID0gdGVtcDtcbiAgICAgIHJldHVybiBkaWZmO1xuICAgIH07XG5cbiAgICBjb25zdCB0aWNrID0gKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhcnRUaW1lID0gcGVyZm9ybWFuY2Uubm93KCksXG4gICAgICAgIG1zRWxhcHNlZCA9IHN0YXJ0VGltZSAtIGxhc3RUaWNrVGltZTtcbiAgICAgIG1zVGlsbE5leHRGcmFtZSAtPSBtc0VsYXBzZWQ7XG4gICAgICBpZiAobXNUaWxsTmV4dEZyYW1lIDw9IDApIHtcbiAgICAgICAgc3RhdHMuYmVnaW4oKTtcbiAgICAgICAgY29uc3QgZGlmZiA9IGNvbXB1dGVOZXh0U3RhdGUoKTtcbiAgICAgICAgb25UaWNrKGN1cnJlbnQsIGRpZmYpO1xuICAgICAgICBzdGF0cy5lbmQoKTtcbiAgICAgICAgbGFzdFRpY2tUaW1lID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgICAgIGNvbnN0IHRpbWVGb3JGcmFtZSA9IGxhc3RUaWNrVGltZSAtIHN0YXJ0VGltZTtcbiAgICAgICAgbXNUaWxsTmV4dEZyYW1lID0gbXNQZXJGcmFtZSAtIHRpbWVGb3JGcmFtZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxhc3RUaWNrVGltZSA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgICAgfVxuXG4gICAgICBpZiAoaXNSdW5uaW5nKSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRpY2spO1xuICAgIH07XG5cbiAgICBjb25zdCBzZXRPcHRpb25zID0gb3B0aW9ucyA9PiB7XG4gICAgICBiaXJ0aCA9IG9wdGlvbnMuYmlydGggfHwgJzInO1xuICAgICAgc3Vydml2YWwgPSBvcHRpb25zLnN1cnZpdmFsIHx8ICcyMyc7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDg7IGkrKykge1xuICAgICAgICBiaXJ0aE1hcFtpXSA9IGJpcnRoLmluZGV4T2YoaSkgPj0gMCA/IDEgOiAwO1xuICAgICAgICBzdXJ2aXZhbE1hcFtpXSA9IHN1cnZpdmFsLmluZGV4T2YoaSkgPj0gMCA/IDEgOiAwO1xuICAgICAgfVxuXG4gICAgICByYW5kb21TdGFydCA9IG9wdGlvbnMucmFuZG9tU3RhcnQ7XG4gICAgfTtcblxuICAgIHRoaXMuc3RhcnQgPSBvcHRpb25zID0+IHtcbiAgICAgIHNldE9wdGlvbnMob3B0aW9ucyk7XG4gICAgICBjdXJyZW50ID0gbmV3IFdvcmxkKHJvd3MsIGNvbHMsIHJhbmRvbVN0YXJ0KTtcbiAgICAgIG5leHQgPSBuZXcgV29ybGQocm93cywgY29scyk7XG4gICAgICBpc1J1bm5pbmcgPSB0cnVlO1xuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aWNrKTtcbiAgICB9O1xuXG4gICAgdGhpcy5wYXVzZSA9ICgpID0+IHtcbiAgICAgIGlzUnVubmluZyA9IGZhbHNlO1xuICAgIH07XG5cbiAgICB0aGlzLnBsYXkgPSAoKSA9PiB7XG4gICAgICBpc1J1bm5pbmcgPSB0cnVlO1xuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aWNrKTtcbiAgICB9O1xuXG4gICAgdGhpcy5vbkRyYXcgPSAoaSwgaikgPT4ge1xuICAgICAgY3VycmVudC5jcm9zcyhpLCBqKTtcbiAgICB9O1xuICB9XG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9FbmdpbmUuanNcbi8vIG1vZHVsZSBpZCA9IDFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgV29ybGQge1xuICBjb25zdHJ1Y3Rvcihyb3dzLCBjb2xzLCByYW5kb21TdGFydCkge1xuICAgIHRoaXMuY2VsbHMgPSBuZXcgVWludDhBcnJheShuZXcgQXJyYXlCdWZmZXIocm93cyAqIGNvbHMpKTtcbiAgICBjb25zdCBpbmRleCA9IChpLCBqKSA9PiBpICogY29scyArIGo7XG4gICAgdGhpcy5uZWlnaGJvdXJzSW5kaWNlcyA9IG5ldyBBcnJheShjb2xzICogcm93cyk7XG4gICAgdGhpcy5nZXQgPSBpID0+XG4gICAgICBpID49IDAgJiYgaSA8IHRoaXMuY2VsbHMubGVuZ3RoID8gdGhpcy5jZWxsc1tpXSA6IHVuZGVmaW5lZDtcblxuICAgIHRoaXMuc2V0ID0gKGksIHZhbCkgPT4gKHRoaXMuY2VsbHNbaV0gPSB2YWwpO1xuXG4gICAgdGhpcy5jcm9zcyA9IChpLCBqKSA9PiB7XG4gICAgICBpZiAoaSAtIDEgPiAwKSB0aGlzLmNlbGxzW2luZGV4KGkgLSAxLCBqKV0gPSAxO1xuICAgICAgaWYgKGogLSAxID4gMCkgdGhpcy5jZWxsc1tpbmRleChpLCBqIC0gMSldID0gMTtcbiAgICAgIHRoaXMuY2VsbHNbaW5kZXgoaSwgaildID0gMTtcbiAgICAgIGlmIChqICsgMSA+IGNvbHMpIHRoaXMuY2VsbHNbaW5kZXgoaSwgaiArIDEpXSA9IDE7XG4gICAgICBpZiAoaSArIDEgPCByb3dzKSB0aGlzLmNlbGxzW2luZGV4KGkgKyAxLCBqKV0gPSAxO1xuICAgIH07XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJvd3M7IGkrKykge1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBjb2xzOyBqKyspIHtcbiAgICAgICAgdGhpcy5uZWlnaGJvdXJzSW5kaWNlc1tpbmRleChpLCBqKV0gPSBbXTtcbiAgICAgICAgaWYgKGkgLSAxID49IDAgJiYgaiAtIDEgPj0gMClcbiAgICAgICAgICB0aGlzLm5laWdoYm91cnNJbmRpY2VzW2luZGV4KGksIGopXS5wdXNoKGluZGV4KGkgLSAxLCBqIC0gMSkpO1xuICAgICAgICBpZiAoaSAtIDEgPj0gMClcbiAgICAgICAgICB0aGlzLm5laWdoYm91cnNJbmRpY2VzW2luZGV4KGksIGopXS5wdXNoKGluZGV4KGkgLSAxLCBqKSk7XG4gICAgICAgIGlmIChpIC0gMSA+PSAwICYmIGogKyAxIDwgY29scylcbiAgICAgICAgICB0aGlzLm5laWdoYm91cnNJbmRpY2VzW2luZGV4KGksIGopXS5wdXNoKGluZGV4KGkgLSAxLCBqICsgMSkpO1xuXG4gICAgICAgIGlmIChqIC0gMSA+PSAwKVxuICAgICAgICAgIHRoaXMubmVpZ2hib3Vyc0luZGljZXNbaW5kZXgoaSwgaildLnB1c2goaW5kZXgoaSwgaiAtIDEpKTtcbiAgICAgICAgaWYgKGogKyAxIDwgY29scylcbiAgICAgICAgICB0aGlzLm5laWdoYm91cnNJbmRpY2VzW2luZGV4KGksIGopXS5wdXNoKGluZGV4KGksIGogKyAxKSk7XG5cbiAgICAgICAgaWYgKGkgKyAxIDwgcm93cyAmJiBqIC0gMSA+PSAwKVxuICAgICAgICAgIHRoaXMubmVpZ2hib3Vyc0luZGljZXNbaW5kZXgoaSwgaildLnB1c2goaW5kZXgoaSArIDEsIGogLSAxKSk7XG4gICAgICAgIGlmIChpICsgMSA8IHJvd3MpXG4gICAgICAgICAgdGhpcy5uZWlnaGJvdXJzSW5kaWNlc1tpbmRleChpLCBqKV0ucHVzaChpbmRleChpICsgMSwgaikpO1xuICAgICAgICBpZiAoaSArIDEgPCByb3dzICYmIGogKyAxIDwgY29scylcbiAgICAgICAgICB0aGlzLm5laWdoYm91cnNJbmRpY2VzW2luZGV4KGksIGopXS5wdXNoKGluZGV4KGkgKyAxLCBqICsgMSkpO1xuICAgICAgfVxuICAgIH1cbiAgICBjb25zdCBjb3VudCA9IChhLCBiKSA9PiBhICsgdGhpcy5jZWxsc1tiXTtcbiAgICB0aGlzLm5laWdoYm91cnMgPSBpID0+IHRoaXMubmVpZ2hib3Vyc0luZGljZXNbaV0ucmVkdWNlKGNvdW50LCAwKTtcblxuICAgIGlmIChyYW5kb21TdGFydClcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5jZWxscy5sZW5ndGg7IGkrKylcbiAgICAgICAgdGhpcy5jZWxsc1tpXSA9IE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSk7XG4gIH1cbn1cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL1dvcmxkLmpzXG4vLyBtb2R1bGUgaWQgPSAyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIHN0YXRzLmpzIC0gaHR0cDovL2dpdGh1Yi5jb20vbXJkb29iL3N0YXRzLmpzXG4oZnVuY3Rpb24oZixlKXtcIm9iamVjdFwiPT09dHlwZW9mIGV4cG9ydHMmJlwidW5kZWZpbmVkXCIhPT10eXBlb2YgbW9kdWxlP21vZHVsZS5leHBvcnRzPWUoKTpcImZ1bmN0aW9uXCI9PT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShlKTpmLlN0YXRzPWUoKX0pKHRoaXMsZnVuY3Rpb24oKXt2YXIgZj1mdW5jdGlvbigpe2Z1bmN0aW9uIGUoYSl7Yy5hcHBlbmRDaGlsZChhLmRvbSk7cmV0dXJuIGF9ZnVuY3Rpb24gdShhKXtmb3IodmFyIGQ9MDtkPGMuY2hpbGRyZW4ubGVuZ3RoO2QrKyljLmNoaWxkcmVuW2RdLnN0eWxlLmRpc3BsYXk9ZD09PWE/XCJibG9ja1wiOlwibm9uZVwiO2w9YX12YXIgbD0wLGM9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtjLnN0eWxlLmNzc1RleHQ9XCJwb3NpdGlvbjpmaXhlZDt0b3A6MDtsZWZ0OjA7Y3Vyc29yOnBvaW50ZXI7b3BhY2l0eTowLjk7ei1pbmRleDoxMDAwMFwiO2MuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsZnVuY3Rpb24oYSl7YS5wcmV2ZW50RGVmYXVsdCgpO1xudSgrK2wlYy5jaGlsZHJlbi5sZW5ndGgpfSwhMSk7dmFyIGs9KHBlcmZvcm1hbmNlfHxEYXRlKS5ub3coKSxnPWssYT0wLHI9ZShuZXcgZi5QYW5lbChcIkZQU1wiLFwiIzBmZlwiLFwiIzAwMlwiKSksaD1lKG5ldyBmLlBhbmVsKFwiTVNcIixcIiMwZjBcIixcIiMwMjBcIikpO2lmKHNlbGYucGVyZm9ybWFuY2UmJnNlbGYucGVyZm9ybWFuY2UubWVtb3J5KXZhciB0PWUobmV3IGYuUGFuZWwoXCJNQlwiLFwiI2YwOFwiLFwiIzIwMVwiKSk7dSgwKTtyZXR1cm57UkVWSVNJT046MTYsZG9tOmMsYWRkUGFuZWw6ZSxzaG93UGFuZWw6dSxiZWdpbjpmdW5jdGlvbigpe2s9KHBlcmZvcm1hbmNlfHxEYXRlKS5ub3coKX0sZW5kOmZ1bmN0aW9uKCl7YSsrO3ZhciBjPShwZXJmb3JtYW5jZXx8RGF0ZSkubm93KCk7aC51cGRhdGUoYy1rLDIwMCk7aWYoYz5nKzFFMyYmKHIudXBkYXRlKDFFMyphLyhjLWcpLDEwMCksZz1jLGE9MCx0KSl7dmFyIGQ9cGVyZm9ybWFuY2UubWVtb3J5O3QudXBkYXRlKGQudXNlZEpTSGVhcFNpemUvXG4xMDQ4NTc2LGQuanNIZWFwU2l6ZUxpbWl0LzEwNDg1NzYpfXJldHVybiBjfSx1cGRhdGU6ZnVuY3Rpb24oKXtrPXRoaXMuZW5kKCl9LGRvbUVsZW1lbnQ6YyxzZXRNb2RlOnV9fTtmLlBhbmVsPWZ1bmN0aW9uKGUsZixsKXt2YXIgYz1JbmZpbml0eSxrPTAsZz1NYXRoLnJvdW5kLGE9Zyh3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpb3x8MSkscj04MCphLGg9NDgqYSx0PTMqYSx2PTIqYSxkPTMqYSxtPTE1KmEsbj03NCphLHA9MzAqYSxxPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7cS53aWR0aD1yO3EuaGVpZ2h0PWg7cS5zdHlsZS5jc3NUZXh0PVwid2lkdGg6ODBweDtoZWlnaHQ6NDhweFwiO3ZhciBiPXEuZ2V0Q29udGV4dChcIjJkXCIpO2IuZm9udD1cImJvbGQgXCIrOSphK1wicHggSGVsdmV0aWNhLEFyaWFsLHNhbnMtc2VyaWZcIjtiLnRleHRCYXNlbGluZT1cInRvcFwiO2IuZmlsbFN0eWxlPWw7Yi5maWxsUmVjdCgwLDAscixoKTtiLmZpbGxTdHlsZT1mO2IuZmlsbFRleHQoZSx0LHYpO1xuYi5maWxsUmVjdChkLG0sbixwKTtiLmZpbGxTdHlsZT1sO2IuZ2xvYmFsQWxwaGE9Ljk7Yi5maWxsUmVjdChkLG0sbixwKTtyZXR1cm57ZG9tOnEsdXBkYXRlOmZ1bmN0aW9uKGgsdyl7Yz1NYXRoLm1pbihjLGgpO2s9TWF0aC5tYXgoayxoKTtiLmZpbGxTdHlsZT1sO2IuZ2xvYmFsQWxwaGE9MTtiLmZpbGxSZWN0KDAsMCxyLG0pO2IuZmlsbFN0eWxlPWY7Yi5maWxsVGV4dChnKGgpK1wiIFwiK2UrXCIgKFwiK2coYykrXCItXCIrZyhrKStcIilcIix0LHYpO2IuZHJhd0ltYWdlKHEsZCthLG0sbi1hLHAsZCxtLG4tYSxwKTtiLmZpbGxSZWN0KGQrbi1hLG0sYSxwKTtiLmZpbGxTdHlsZT1sO2IuZ2xvYmFsQWxwaGE9Ljk7Yi5maWxsUmVjdChkK24tYSxtLGEsZygoMS1oL3cpKnApKX19fTtyZXR1cm4gZn0pO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9saWIvc3RhdHMubWluLmpzXG4vLyBtb2R1bGUgaWQgPSA0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIE9wdGlvbnMge1xuICBjb25zdHJ1Y3RvcihndWksIHJlc2V0LCBwYXVzZSwgcGxheSkge1xuICAgIHRoaXMuYmlydGggPSAnMyc7XG4gICAgdGhpcy5zdXJ2aXZhbCA9ICcyMyc7XG4gICAgdGhpcy5yYW5kb21TdGFydCA9IHRydWU7XG4gICAgdGhpcy5yZXNldCA9ICgpID0+IHJlc2V0KHRoaXMpO1xuICAgIHRoaXMucGF1c2UgPSBwYXVzZTtcbiAgICB0aGlzLnBsYXkgPSBwbGF5O1xuICAgIGNvbnN0IHJ1bGVzRm9sZGVyID0gZ3VpLmFkZEZvbGRlcigncnVsZXMnKTtcbiAgICBydWxlc0ZvbGRlci5hZGQodGhpcywgJ2JpcnRoJyk7XG4gICAgcnVsZXNGb2xkZXIuYWRkKHRoaXMsICdzdXJ2aXZhbCcpO1xuICAgIGd1aS5jbG9zZWQgPSB0cnVlO1xuXG4gICAgY29uc3QgY29sb3JzRm9sZGVycyA9IGd1aS5hZGRGb2xkZXIoJ2NvbG9ycyBieSBuZWlnaGJvdXJzJyk7XG4gICAgdGhpcy5jb2xvcnMgPSBbXTtcbiAgICBjb25zdCByZXNldENvbG9ycyA9ICgpID0+IHtcbiAgICAgIHRoaXMuY29sb3JzWzBdID0gJyc7XG4gICAgICB0aGlzLmNvbG9yc1sxXSA9ICcjRkZGRkZGJztcbiAgICAgIHRoaXMuY29sb3JzWzJdID0gJyNGRkZGRkYnO1xuICAgICAgdGhpcy5jb2xvcnNbM10gPSAnI0ZGRkZGRic7XG4gICAgICB0aGlzLmNvbG9yc1s0XSA9ICcjRkZGRkZGJztcbiAgICAgIHRoaXMuY29sb3JzWzVdID0gJyNGRkZGRkYnO1xuICAgICAgdGhpcy5jb2xvcnNbNl0gPSAnI0ZGRkZGRic7XG4gICAgICB0aGlzLmNvbG9yc1s3XSA9ICcjRkZGRkZGJztcbiAgICAgIHRoaXMuY29sb3JzWzhdID0gJyNGRkZGRkYnO1xuICAgIH07XG4gICAgcmVzZXRDb2xvcnMoKTtcbiAgICBjb25zdCBsZXR0ZXJzID0gJzAxMjM0NTY3ODlBQkNERUYnO1xuICAgIGNvbnN0IHJhbmRvbUNvbG9yID0gKCkgPT4ge1xuICAgICAgbGV0IGNvbG9yID0gJyMnO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA2OyBpKyspIHtcbiAgICAgICAgY29sb3IgKz0gbGV0dGVyc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxNildO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbG9yO1xuICAgIH07XG4gICAgdGhpcy5jb2xvcnMucmFuZG9tID0gKCkgPT4ge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNvbG9ycy5sZW5ndGg7IGkrKykge1xuICAgICAgICB0aGlzLmNvbG9yc1tpXSA9IHJhbmRvbUNvbG9yKCk7XG4gICAgICB9XG4gICAgfTtcbiAgICB0aGlzLmNvbG9ycy5ibGFja1doaXRlID0gKCkgPT4gcmVzZXRDb2xvcnMoKTtcbiAgICBjb2xvcnNGb2xkZXJzLmFkZENvbG9yKHRoaXMuY29sb3JzLCAnMScpLmxpc3RlbigpO1xuICAgIGNvbG9yc0ZvbGRlcnMuYWRkQ29sb3IodGhpcy5jb2xvcnMsICcyJykubGlzdGVuKCk7XG4gICAgY29sb3JzRm9sZGVycy5hZGRDb2xvcih0aGlzLmNvbG9ycywgJzMnKS5saXN0ZW4oKTtcbiAgICBjb2xvcnNGb2xkZXJzLmFkZENvbG9yKHRoaXMuY29sb3JzLCAnNCcpLmxpc3RlbigpO1xuICAgIGNvbG9yc0ZvbGRlcnMuYWRkQ29sb3IodGhpcy5jb2xvcnMsICc1JykubGlzdGVuKCk7XG4gICAgY29sb3JzRm9sZGVycy5hZGRDb2xvcih0aGlzLmNvbG9ycywgJzYnKS5saXN0ZW4oKTtcbiAgICBjb2xvcnNGb2xkZXJzLmFkZENvbG9yKHRoaXMuY29sb3JzLCAnNycpLmxpc3RlbigpO1xuICAgIGNvbG9yc0ZvbGRlcnMuYWRkQ29sb3IodGhpcy5jb2xvcnMsICc4JykubGlzdGVuKCk7XG4gICAgY29sb3JzRm9sZGVycy5hZGQodGhpcy5jb2xvcnMsICdyYW5kb20nKTtcbiAgICBjb2xvcnNGb2xkZXJzLmFkZCh0aGlzLmNvbG9ycywgJ2JsYWNrV2hpdGUnKS5uYW1lKCdibGFjayAmIHdoaXRlJyk7XG4gICAgZ3VpLmFkZCh0aGlzLCAncmFuZG9tU3RhcnQnKS5uYW1lKCdyYW5kb20gc3RhcnQnKTtcbiAgICBndWkuYWRkKHRoaXMsICdyZXNldCcpLm5hbWUoJ3NldCAmIGdvJyk7XG4gICAgLy8gY29sb3JzRm9sZGVycy5hZGRDb2xvcih0aGlzLmNvbG9ycywgJ2RlYWQnKTtcbiAgfVxufVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvT3B0aW9ucy5qc1xuLy8gbW9kdWxlIGlkID0gNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBSZW5kZXJlciB7XG4gIGNvbnN0cnVjdG9yKGNvbHMsIHJvd3MsIGNlbGxXaWR0aCwgY2VsbEhlaWdodCkge1xuICAgIGNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpLFxuICAgICAgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoY2FudmFzKTtcbiAgICBjYW52YXMud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICBjYW52YXMuaGVpZ2h0ID0gZG9jdW1lbnQuYm9keS5vZmZzZXRIZWlnaHQ7XG4gICAgY29uc3QgaW1hZ2UgPSBjb250ZXh0LmNyZWF0ZUltYWdlRGF0YShjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpLFxuICAgICAgaW1hZ2VEYXRhID0gbmV3IEludDMyQXJyYXkoaW1hZ2UuZGF0YS5idWZmZXIpLFxuICAgICAgcmVzZXREYXRhID0gKCkgPT4ge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNhbnZhcy53aWR0aCAqIGNhbnZhcy5oZWlnaHQ7IGkrKykge1xuICAgICAgICAgIGltYWdlRGF0YVtpXSA9IDB4ZmYgPDwgMjQ7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICBsZXQgbW91c2VEb3duID0gZmFsc2U7XG5cbiAgICBjb25zdCBvbkRyYXcgPSBldmVudCA9PiB7XG4gICAgICBpZiAoIW1vdXNlRG93bikgcmV0dXJuO1xuXG4gICAgICBjb25zdCByZWN0ID0gY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgY29uc3QgbW91c2VQb3MgPSB7XG4gICAgICAgIHg6IGV2ZW50LmNsaWVudFggKiBjYW52YXMud2lkdGggLyBjYW52YXMuY2xpZW50V2lkdGgsXG4gICAgICAgIHk6IGV2ZW50LmNsaWVudFkgKiBjYW52YXMuaGVpZ2h0IC8gY2FudmFzLmNsaWVudEhlaWdodFxuICAgICAgfTtcbiAgICAgIGNvbnN0IHBvcyA9IHtcbiAgICAgICAgaTogfn4obW91c2VQb3MueSAvIGNlbGxIZWlnaHQpLFxuICAgICAgICBqOiB+fihtb3VzZVBvcy54IC8gY2VsbFdpZHRoKVxuICAgICAgfTtcblxuICAgICAgdGhpcy5vbkRyYXcocG9zLmksIHBvcy5qKTtcbiAgICB9O1xuXG4gICAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGV2dCA9PiB7XG4gICAgICBtb3VzZURvd24gPSB0cnVlO1xuICAgICAgb25EcmF3KGV2dCk7XG4gICAgfSk7XG5cbiAgICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgb25EcmF3KTtcbiAgICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIGV2dCA9PiAobW91c2VEb3duID0gZmFsc2UpKTtcblxuICAgIGNvbnN0IGxpdmVDb2xvciA9IDB4ZmYgfCAoMHhmZiA8PCA4KSB8ICgweGZmIDw8IDE2KSB8ICgweGZmIDw8IDI0KSxcbiAgICAgIGRlYWRDb2xvciA9IDB4MDAgfCAoMHgwMCA8PCA4KSB8ICgweDAwIDw8IDE2KSB8ICgweGZmIDw8IDI0KTtcblxuICAgIGNvbnN0IGhleFRvUmdiID0gaGV4ID0+IHtcbiAgICAgIGNvbnN0IHJlc3VsdCA9XG4gICAgICAgIC9eIz8oW2EtZlxcZF17Mn0pKFthLWZcXGRdezJ9KShbYS1mXFxkXXsyfSkkL2kuZXhlYyhoZXgpIHx8ICcjMDAwMDAwJztcbiAgICAgIHJldHVybiAoXG4gICAgICAgIHBhcnNlSW50KHJlc3VsdFsxXSwgMTYpIHxcbiAgICAgICAgKHBhcnNlSW50KHJlc3VsdFsyXSwgMTYpIDw8IDgpIHxcbiAgICAgICAgKHBhcnNlSW50KHJlc3VsdFszXSwgMTYpIDw8IDE2KSB8XG4gICAgICAgICgweGZmIDw8IDI0KVxuICAgICAgKTtcbiAgICB9O1xuICAgIGNvbnN0IGZpbGxTcXVhcmUgPSAoeCwgeSwgY29sb3IpID0+IHtcbiAgICAgIHZhciB3aWR0aCA9IGNlbGxXaWR0aCxcbiAgICAgICAgaGVpZ2h0ID0gY2VsbEhlaWdodDtcblxuICAgICAgaWYgKHggKiBjZWxsV2lkdGggKyB3aWR0aCA+IGNhbnZhcy53aWR0aCkge1xuICAgICAgICB3aWR0aCA9IGNhbnZhcy53aWR0aCAtIHggKiBjZWxsV2lkdGg7XG4gICAgICB9XG5cbiAgICAgIGlmICh5ICogY2VsbEhlaWdodCArIGhlaWdodCA+IGNhbnZhcy5oZWlnaHQpIHtcbiAgICAgICAgaGVpZ2h0ID0gY2FudmFzLmhlaWdodCAtIHkgKiBjZWxsSGVpZ2h0O1xuICAgICAgfVxuXG4gICAgICBpZiAod2lkdGggPD0gMCB8fCBoZWlnaHQgPD0gMCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZhciBwb2ludGVyID0geCAqIGNlbGxXaWR0aCArIHkgKiBjYW52YXMud2lkdGggKiBjZWxsSGVpZ2h0LFxuICAgICAgICByb3dXaWR0aCA9IGNhbnZhcy53aWR0aCAtIHdpZHRoO1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGhlaWdodDsgaSsrKSB7XG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgd2lkdGg7IGorKykge1xuICAgICAgICAgIGltYWdlRGF0YVtwb2ludGVyXSA9IGNvbG9yO1xuXG4gICAgICAgICAgcG9pbnRlcisrO1xuICAgICAgICB9XG4gICAgICAgIHBvaW50ZXIgKz0gcm93V2lkdGg7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHRoaXMucmVuZGVyID0gKHdvcmxkLCBkaWZmKSA9PiB7XG4gICAgICBmb3IgKGxldCBpbmRleCBvZiBkaWZmKSB7XG4gICAgICAgIGZpbGxTcXVhcmUoXG4gICAgICAgICAgaW5kZXggJSBjb2xzLFxuICAgICAgICAgIE1hdGguZmxvb3IoaW5kZXggLyBjb2xzKSxcbiAgICAgICAgICB3b3JsZC5jZWxsc1tpbmRleF0gPT09IDFcbiAgICAgICAgICAgID8gdGhpcy5jb2xvcnNbd29ybGQubmVpZ2hib3VycyhpbmRleCldXG4gICAgICAgICAgICA6IC8vID8gbGl2ZUNvbG9yXG4gICAgICAgICAgICAgIGRlYWRDb2xvclxuICAgICAgICApO1xuICAgICAgfVxuICAgICAgY29udGV4dC5wdXRJbWFnZURhdGEoaW1hZ2UsIDAsIDApO1xuICAgIH07XG5cbiAgICB0aGlzLnJlc2V0ID0gb3B0aW9ucyA9PiB7XG4gICAgICByZXNldERhdGEoKTtcbiAgICAgIHRoaXMuY29sb3JzID0gb3B0aW9ucy5jb2xvcnMubWFwKGhleFRvUmdiKTtcbiAgICAgIGNvbnRleHQucHV0SW1hZ2VEYXRhKGltYWdlLCAwLCAwKTtcbiAgICB9O1xuICB9XG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9DYW52YXNSZW5kZXJlci5qc1xuLy8gbW9kdWxlIGlkID0gOFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9