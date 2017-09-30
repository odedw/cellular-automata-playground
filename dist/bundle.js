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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__CanvasRenderer__ = __webpack_require__(3);
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
  document.onkeydown = ev => {
    console.log(ev.keyCode);
    if (ev.keyCode == 32) {
      //space
      options.reset();
    } else if (ev.keyCode == 82) {
      //r
      options.randomStart = !options.randomStart;
    } else if (ev.keyCode == 67) {
      //c
      options.colors.random();
    }
  };
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
/* 3 */
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



/***/ }),
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
    //rules
    this.birth = "3";
    this.survival = "23";
    this.randomStart = true;
    this.reset = () => reset(this);
    this.pause = pause;
    this.play = play;
    const rulesFolder = gui.addFolder("rules");
    rulesFolder.add(this, "birth");
    rulesFolder.add(this, "survival");
    gui.closed = true;

    //colors
    const colorsFolders = gui.addFolder("colors by neighbours");
    this.colors = [];
    const resetColors = () => {
      this.colors[0] = "";
      this.colors[1] = "#FFFFFF";
      this.colors[2] = "#FFFFFF";
      this.colors[3] = "#FFFFFF";
      this.colors[4] = "#FFFFFF";
      this.colors[5] = "#FFFFFF";
      this.colors[6] = "#FFFFFF";
      this.colors[7] = "#FFFFFF";
      this.colors[8] = "#FFFFFF";
    };
    resetColors();
    const letters = "0123456789ABCDEF";
    const randomColor = () => {
      let color = "#";
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
    colorsFolders.addColor(this.colors, "1").listen();
    colorsFolders.addColor(this.colors, "2").listen();
    colorsFolders.addColor(this.colors, "3").listen();
    colorsFolders.addColor(this.colors, "4").listen();
    colorsFolders.addColor(this.colors, "5").listen();
    colorsFolders.addColor(this.colors, "6").listen();
    colorsFolders.addColor(this.colors, "7").listen();
    colorsFolders.addColor(this.colors, "8").listen();
    colorsFolders.add(this.colors, "random");
    colorsFolders.add(this.colors, "blackWhite").name("black & white");

    //share
    const shareFolder = gui.addFolder("share");
    this.tweet = () =>
      window.open(
        "https://twitter.com/intent/tweet?text=Hello%20world",
        "_blank",
        "location=yes"
      );
    shareFolder.add(this, "tweet");
    this.copyLink = () => {};
    shareFolder.add(this, "copyLink").name("copy link");

    gui
      .add(this, "randomStart")
      .name("random start")
      .listen();
    gui.add(this, "reset").name("set & go");
    this.about = () =>
      window.open(
        "https://github.com/odedw/cellular-automata-playground/blob/master/README.md",
        "_blank"
      );
    gui.add(this, "about");
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Options;



/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNjZlNTE5NWY4Nzc1OTFkNjU4MGMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FwcC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvRW5naW5lLmpzIiwid2VicGFjazovLy8uL3NyYy9Xb3JsZC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvQ2FudmFzUmVuZGVyZXIuanMiLCJ3ZWJwYWNrOi8vLy4vbGliL3N0YXRzLm1pbi5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvT3B0aW9ucy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7O0FDN0RBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7QUM5Q0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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Q0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLE9BQU87QUFDNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQix3QkFBd0I7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQSIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCA2NmU1MTk1Zjg3NzU5MWQ2NTgwYyIsImltcG9ydCBFbmdpbmUgZnJvbSBcIi4vRW5naW5lXCI7XHJcbmltcG9ydCBSZW5kZXJlciBmcm9tIFwiLi9DYW52YXNSZW5kZXJlclwiO1xyXG5pbXBvcnQgU3RhdHMgZnJvbSBcIi4uL2xpYi9zdGF0cy5taW5cIjtcclxuaW1wb3J0IE9wdGlvbnMgZnJvbSBcIi4vT3B0aW9uc1wiO1xyXG5cclxuY29uc3Qgc3RhdHMgPSBuZXcgU3RhdHMoKTtcclxuc3RhdHMuc2hvd1BhbmVsKDEpO1xyXG4vLyBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHN0YXRzLmRvbSk7XHJcblxyXG5jb25zdCBwaXhlbHNQZXJDZWxsID0gNCxcclxuICBjb2xzID0gTWF0aC5jZWlsKHdpbmRvdy5pbm5lcldpZHRoIC8gcGl4ZWxzUGVyQ2VsbCksXHJcbiAgcm93cyA9IE1hdGguY2VpbCh3aW5kb3cuaW5uZXJIZWlnaHQgLyBwaXhlbHNQZXJDZWxsKSxcclxuICByZW5kZXJlciA9IG5ldyBSZW5kZXJlcihjb2xzLCByb3dzLCBwaXhlbHNQZXJDZWxsLCBwaXhlbHNQZXJDZWxsKSxcclxuICBlbmdpbmUgPSBuZXcgRW5naW5lKFxyXG4gICAgY29scywgLy9udW1iZXIgb2YgY29sdW1uc1xyXG4gICAgcm93cywgLy9udW1iZXIgb2Ygcm93c1xyXG4gICAgcmVuZGVyZXIucmVuZGVyLCAvL29uVGlja1xyXG4gICAgNjAsIC8vZGVzaXJlZCBmcHNcclxuICAgIHN0YXRzXHJcbiAgKTtcclxucmVuZGVyZXIub25EcmF3ID0gZW5naW5lLm9uRHJhdztcclxud2luZG93Lm9ubG9hZCA9ICgpID0+IHtcclxuICBjb25zdCBndWkgPSBuZXcgZGF0LkdVSSgpO1xyXG4gIGNvbnN0IG9wdGlvbnMgPSBuZXcgT3B0aW9ucyhcclxuICAgIGd1aSxcclxuICAgIG9wdGlvbnMgPT4ge1xyXG4gICAgICByZW5kZXJlci5yZXNldChvcHRpb25zKTtcclxuICAgICAgZW5naW5lLnN0YXJ0KG9wdGlvbnMpO1xyXG4gICAgfSxcclxuICAgIGVuZ2luZS5wYXVzZSxcclxuICAgIGVuZ2luZS5wbGF5XHJcbiAgKTtcclxuICBvcHRpb25zLnJlc2V0KCk7XHJcbiAgZG9jdW1lbnQub25rZXlkb3duID0gZXYgPT4ge1xyXG4gICAgY29uc29sZS5sb2coZXYua2V5Q29kZSk7XHJcbiAgICBpZiAoZXYua2V5Q29kZSA9PSAzMikge1xyXG4gICAgICAvL3NwYWNlXHJcbiAgICAgIG9wdGlvbnMucmVzZXQoKTtcclxuICAgIH0gZWxzZSBpZiAoZXYua2V5Q29kZSA9PSA4Mikge1xyXG4gICAgICAvL3JcclxuICAgICAgb3B0aW9ucy5yYW5kb21TdGFydCA9ICFvcHRpb25zLnJhbmRvbVN0YXJ0O1xyXG4gICAgfSBlbHNlIGlmIChldi5rZXlDb2RlID09IDY3KSB7XHJcbiAgICAgIC8vY1xyXG4gICAgICBvcHRpb25zLmNvbG9ycy5yYW5kb20oKTtcclxuICAgIH1cclxuICB9O1xyXG59O1xyXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9hcHAuanNcbi8vIG1vZHVsZSBpZCA9IDBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IFdvcmxkIGZyb20gJy4vV29ybGQnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRW5naW5lIHtcclxuICBjb25zdHJ1Y3Rvcihjb2xzLCByb3dzLCBvblRpY2ssIGRlc2lyZWRGcHMsIHN0YXRzKSB7XHJcbiAgICBsZXQgZW5naW5lVGltZSA9IDAsXHJcbiAgICAgIGN1cnJlbnQsXHJcbiAgICAgIG5leHQsXHJcbiAgICAgIGJpcnRoID0gJycsXHJcbiAgICAgIHN1cnZpdmFsID0gJycsXHJcbiAgICAgIHJhbmRvbVN0YXJ0ID0gZmFsc2UsXHJcbiAgICAgIGJpcnRoTWFwID0gbmV3IEFycmF5KDgpLFxyXG4gICAgICBzdXJ2aXZhbE1hcCA9IG5ldyBBcnJheSg4KSxcclxuICAgICAgbXNUaWxsTmV4dEZyYW1lID0gMCxcclxuICAgICAgbGFzdFRpY2tUaW1lID0gMCxcclxuICAgICAgdG90YWwgPSByb3dzICogY29scyxcclxuICAgICAgaXNSdW5uaW5nID0gZmFsc2U7XHJcblxyXG4gICAgY29uc3QgbXNQZXJGcmFtZSA9IDEwMDAgLyBkZXNpcmVkRnBzO1xyXG5cclxuICAgIGNvbnN0IGNvbXB1dGVOZXh0U3RhdGUgPSAoKSA9PiB7XHJcbiAgICAgIGxldCBuZXh0U3RhdGUgPSAwO1xyXG4gICAgICBjb25zdCBkaWZmID0gbmV3IFNldCgpO1xyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRvdGFsOyBpKyspIHtcclxuICAgICAgICBsZXQgbmVpZ2hib3JzID0gY3VycmVudC5uZWlnaGJvdXJzKGkpLFxyXG4gICAgICAgICAgY3VycmVudFN0YXRlID0gY3VycmVudC5nZXQoaSk7XHJcblxyXG4gICAgICAgIG5leHRTdGF0ZSA9XHJcbiAgICAgICAgICBjdXJyZW50U3RhdGUgPT09IDEgPyBzdXJ2aXZhbE1hcFtuZWlnaGJvcnNdIDogYmlydGhNYXBbbmVpZ2hib3JzXTtcclxuICAgICAgICBuZXh0LnNldChpLCBuZXh0U3RhdGUpO1xyXG5cclxuICAgICAgICBpZiAoY3VycmVudFN0YXRlICE9PSBuZXh0U3RhdGUpIHtcclxuICAgICAgICAgIGRpZmYuYWRkKGkpO1xyXG4gICAgICAgICAgY29uc3QgbmVpZ2hib3Vyc0luZGljZXMgPSBjdXJyZW50Lm5laWdoYm91cnNJbmRpY2VzW2ldO1xyXG4gICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBuZWlnaGJvdXJzSW5kaWNlcy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICBkaWZmLmFkZChuZWlnaGJvdXJzSW5kaWNlc1tqXSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGNvbnN0IHRlbXAgPSBjdXJyZW50O1xyXG4gICAgICBjdXJyZW50ID0gbmV4dDtcclxuICAgICAgbmV4dCA9IHRlbXA7XHJcbiAgICAgIHJldHVybiBkaWZmO1xyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdCB0aWNrID0gKCkgPT4ge1xyXG4gICAgICBjb25zdCBzdGFydFRpbWUgPSBwZXJmb3JtYW5jZS5ub3coKSxcclxuICAgICAgICBtc0VsYXBzZWQgPSBzdGFydFRpbWUgLSBsYXN0VGlja1RpbWU7XHJcbiAgICAgIG1zVGlsbE5leHRGcmFtZSAtPSBtc0VsYXBzZWQ7XHJcbiAgICAgIGlmIChtc1RpbGxOZXh0RnJhbWUgPD0gMCkge1xyXG4gICAgICAgIHN0YXRzLmJlZ2luKCk7XHJcbiAgICAgICAgY29uc3QgZGlmZiA9IGNvbXB1dGVOZXh0U3RhdGUoKTtcclxuICAgICAgICBvblRpY2soY3VycmVudCwgZGlmZik7XHJcbiAgICAgICAgc3RhdHMuZW5kKCk7XHJcbiAgICAgICAgbGFzdFRpY2tUaW1lID0gcGVyZm9ybWFuY2Uubm93KCk7XHJcbiAgICAgICAgY29uc3QgdGltZUZvckZyYW1lID0gbGFzdFRpY2tUaW1lIC0gc3RhcnRUaW1lO1xyXG4gICAgICAgIG1zVGlsbE5leHRGcmFtZSA9IG1zUGVyRnJhbWUgLSB0aW1lRm9yRnJhbWU7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbGFzdFRpY2tUaW1lID0gcGVyZm9ybWFuY2Uubm93KCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChpc1J1bm5pbmcpIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGljayk7XHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IHNldE9wdGlvbnMgPSBvcHRpb25zID0+IHtcclxuICAgICAgYmlydGggPSBvcHRpb25zLmJpcnRoIHx8ICcyJztcclxuICAgICAgc3Vydml2YWwgPSBvcHRpb25zLnN1cnZpdmFsIHx8ICcyMyc7XHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgODsgaSsrKSB7XHJcbiAgICAgICAgYmlydGhNYXBbaV0gPSBiaXJ0aC5pbmRleE9mKGkpID49IDAgPyAxIDogMDtcclxuICAgICAgICBzdXJ2aXZhbE1hcFtpXSA9IHN1cnZpdmFsLmluZGV4T2YoaSkgPj0gMCA/IDEgOiAwO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByYW5kb21TdGFydCA9IG9wdGlvbnMucmFuZG9tU3RhcnQ7XHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMuc3RhcnQgPSBvcHRpb25zID0+IHtcclxuICAgICAgc2V0T3B0aW9ucyhvcHRpb25zKTtcclxuICAgICAgY3VycmVudCA9IG5ldyBXb3JsZChyb3dzLCBjb2xzLCByYW5kb21TdGFydCk7XHJcbiAgICAgIG5leHQgPSBuZXcgV29ybGQocm93cywgY29scyk7XHJcbiAgICAgIGlzUnVubmluZyA9IHRydWU7XHJcbiAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGljayk7XHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMucGF1c2UgPSAoKSA9PiB7XHJcbiAgICAgIGlzUnVubmluZyA9IGZhbHNlO1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLnBsYXkgPSAoKSA9PiB7XHJcbiAgICAgIGlzUnVubmluZyA9IHRydWU7XHJcbiAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGljayk7XHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMub25EcmF3ID0gKGksIGopID0+IHtcclxuICAgICAgY3VycmVudC5jcm9zcyhpLCBqKTtcclxuICAgIH07XHJcbiAgfVxyXG59XHJcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL0VuZ2luZS5qc1xuLy8gbW9kdWxlIGlkID0gMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBXb3JsZCB7XHJcbiAgY29uc3RydWN0b3Iocm93cywgY29scywgcmFuZG9tU3RhcnQpIHtcclxuICAgIHRoaXMuY2VsbHMgPSBuZXcgVWludDhBcnJheShuZXcgQXJyYXlCdWZmZXIocm93cyAqIGNvbHMpKTtcclxuICAgIGNvbnN0IGluZGV4ID0gKGksIGopID0+IGkgKiBjb2xzICsgajtcclxuICAgIHRoaXMubmVpZ2hib3Vyc0luZGljZXMgPSBuZXcgQXJyYXkoY29scyAqIHJvd3MpO1xyXG4gICAgdGhpcy5nZXQgPSBpID0+XHJcbiAgICAgIGkgPj0gMCAmJiBpIDwgdGhpcy5jZWxscy5sZW5ndGggPyB0aGlzLmNlbGxzW2ldIDogdW5kZWZpbmVkO1xyXG5cclxuICAgIHRoaXMuc2V0ID0gKGksIHZhbCkgPT4gKHRoaXMuY2VsbHNbaV0gPSB2YWwpO1xyXG5cclxuICAgIHRoaXMuY3Jvc3MgPSAoaSwgaikgPT4ge1xyXG4gICAgICBpZiAoaSAtIDEgPiAwKSB0aGlzLmNlbGxzW2luZGV4KGkgLSAxLCBqKV0gPSAxO1xyXG4gICAgICBpZiAoaiAtIDEgPiAwKSB0aGlzLmNlbGxzW2luZGV4KGksIGogLSAxKV0gPSAxO1xyXG4gICAgICB0aGlzLmNlbGxzW2luZGV4KGksIGopXSA9IDE7XHJcbiAgICAgIGlmIChqICsgMSA+IGNvbHMpIHRoaXMuY2VsbHNbaW5kZXgoaSwgaiArIDEpXSA9IDE7XHJcbiAgICAgIGlmIChpICsgMSA8IHJvd3MpIHRoaXMuY2VsbHNbaW5kZXgoaSArIDEsIGopXSA9IDE7XHJcbiAgICB9O1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcm93czsgaSsrKSB7XHJcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgY29sczsgaisrKSB7XHJcbiAgICAgICAgdGhpcy5uZWlnaGJvdXJzSW5kaWNlc1tpbmRleChpLCBqKV0gPSBbXTtcclxuICAgICAgICBpZiAoaSAtIDEgPj0gMCAmJiBqIC0gMSA+PSAwKVxyXG4gICAgICAgICAgdGhpcy5uZWlnaGJvdXJzSW5kaWNlc1tpbmRleChpLCBqKV0ucHVzaChpbmRleChpIC0gMSwgaiAtIDEpKTtcclxuICAgICAgICBpZiAoaSAtIDEgPj0gMClcclxuICAgICAgICAgIHRoaXMubmVpZ2hib3Vyc0luZGljZXNbaW5kZXgoaSwgaildLnB1c2goaW5kZXgoaSAtIDEsIGopKTtcclxuICAgICAgICBpZiAoaSAtIDEgPj0gMCAmJiBqICsgMSA8IGNvbHMpXHJcbiAgICAgICAgICB0aGlzLm5laWdoYm91cnNJbmRpY2VzW2luZGV4KGksIGopXS5wdXNoKGluZGV4KGkgLSAxLCBqICsgMSkpO1xyXG5cclxuICAgICAgICBpZiAoaiAtIDEgPj0gMClcclxuICAgICAgICAgIHRoaXMubmVpZ2hib3Vyc0luZGljZXNbaW5kZXgoaSwgaildLnB1c2goaW5kZXgoaSwgaiAtIDEpKTtcclxuICAgICAgICBpZiAoaiArIDEgPCBjb2xzKVxyXG4gICAgICAgICAgdGhpcy5uZWlnaGJvdXJzSW5kaWNlc1tpbmRleChpLCBqKV0ucHVzaChpbmRleChpLCBqICsgMSkpO1xyXG5cclxuICAgICAgICBpZiAoaSArIDEgPCByb3dzICYmIGogLSAxID49IDApXHJcbiAgICAgICAgICB0aGlzLm5laWdoYm91cnNJbmRpY2VzW2luZGV4KGksIGopXS5wdXNoKGluZGV4KGkgKyAxLCBqIC0gMSkpO1xyXG4gICAgICAgIGlmIChpICsgMSA8IHJvd3MpXHJcbiAgICAgICAgICB0aGlzLm5laWdoYm91cnNJbmRpY2VzW2luZGV4KGksIGopXS5wdXNoKGluZGV4KGkgKyAxLCBqKSk7XHJcbiAgICAgICAgaWYgKGkgKyAxIDwgcm93cyAmJiBqICsgMSA8IGNvbHMpXHJcbiAgICAgICAgICB0aGlzLm5laWdoYm91cnNJbmRpY2VzW2luZGV4KGksIGopXS5wdXNoKGluZGV4KGkgKyAxLCBqICsgMSkpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBjb25zdCBjb3VudCA9IChhLCBiKSA9PiBhICsgdGhpcy5jZWxsc1tiXTtcclxuICAgIHRoaXMubmVpZ2hib3VycyA9IGkgPT4gdGhpcy5uZWlnaGJvdXJzSW5kaWNlc1tpXS5yZWR1Y2UoY291bnQsIDApO1xyXG5cclxuICAgIGlmIChyYW5kb21TdGFydClcclxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNlbGxzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgIHRoaXMuY2VsbHNbaV0gPSBNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkpO1xyXG4gIH1cclxufVxyXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9Xb3JsZC5qc1xuLy8gbW9kdWxlIGlkID0gMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBSZW5kZXJlciB7XHJcbiAgY29uc3RydWN0b3IoY29scywgcm93cywgY2VsbFdpZHRoLCBjZWxsSGVpZ2h0KSB7XHJcbiAgICBjb25zdCBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKSxcclxuICAgICAgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xyXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChjYW52YXMpO1xyXG4gICAgY2FudmFzLndpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XHJcbiAgICBjYW52YXMuaGVpZ2h0ID0gZG9jdW1lbnQuYm9keS5vZmZzZXRIZWlnaHQ7XHJcbiAgICBjb25zdCBpbWFnZSA9IGNvbnRleHQuY3JlYXRlSW1hZ2VEYXRhKGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCksXHJcbiAgICAgIGltYWdlRGF0YSA9IG5ldyBJbnQzMkFycmF5KGltYWdlLmRhdGEuYnVmZmVyKSxcclxuICAgICAgcmVzZXREYXRhID0gKCkgPT4ge1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2FudmFzLndpZHRoICogY2FudmFzLmhlaWdodDsgaSsrKSB7XHJcbiAgICAgICAgICBpbWFnZURhdGFbaV0gPSAweGZmIDw8IDI0O1xyXG4gICAgICAgIH1cclxuICAgICAgfTtcclxuXHJcbiAgICBsZXQgbW91c2VEb3duID0gZmFsc2U7XHJcblxyXG4gICAgY29uc3Qgb25EcmF3ID0gZXZlbnQgPT4ge1xyXG4gICAgICBpZiAoIW1vdXNlRG93bikgcmV0dXJuO1xyXG5cclxuICAgICAgY29uc3QgcmVjdCA9IGNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgICAgY29uc3QgbW91c2VQb3MgPSB7XHJcbiAgICAgICAgeDogZXZlbnQuY2xpZW50WCAqIGNhbnZhcy53aWR0aCAvIGNhbnZhcy5jbGllbnRXaWR0aCxcclxuICAgICAgICB5OiBldmVudC5jbGllbnRZICogY2FudmFzLmhlaWdodCAvIGNhbnZhcy5jbGllbnRIZWlnaHRcclxuICAgICAgfTtcclxuICAgICAgY29uc3QgcG9zID0ge1xyXG4gICAgICAgIGk6IH5+KG1vdXNlUG9zLnkgLyBjZWxsSGVpZ2h0KSxcclxuICAgICAgICBqOiB+fihtb3VzZVBvcy54IC8gY2VsbFdpZHRoKVxyXG4gICAgICB9O1xyXG5cclxuICAgICAgdGhpcy5vbkRyYXcocG9zLmksIHBvcy5qKTtcclxuICAgIH07XHJcblxyXG4gICAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGV2dCA9PiB7XHJcbiAgICAgIG1vdXNlRG93biA9IHRydWU7XHJcbiAgICAgIG9uRHJhdyhldnQpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIG9uRHJhdyk7XHJcbiAgICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIGV2dCA9PiAobW91c2VEb3duID0gZmFsc2UpKTtcclxuXHJcbiAgICBjb25zdCBsaXZlQ29sb3IgPSAweGZmIHwgKDB4ZmYgPDwgOCkgfCAoMHhmZiA8PCAxNikgfCAoMHhmZiA8PCAyNCksXHJcbiAgICAgIGRlYWRDb2xvciA9IDB4MDAgfCAoMHgwMCA8PCA4KSB8ICgweDAwIDw8IDE2KSB8ICgweGZmIDw8IDI0KTtcclxuXHJcbiAgICBjb25zdCBoZXhUb1JnYiA9IGhleCA9PiB7XHJcbiAgICAgIGNvbnN0IHJlc3VsdCA9XHJcbiAgICAgICAgL14jPyhbYS1mXFxkXXsyfSkoW2EtZlxcZF17Mn0pKFthLWZcXGRdezJ9KSQvaS5leGVjKGhleCkgfHwgJyMwMDAwMDAnO1xyXG4gICAgICByZXR1cm4gKFxyXG4gICAgICAgIHBhcnNlSW50KHJlc3VsdFsxXSwgMTYpIHxcclxuICAgICAgICAocGFyc2VJbnQocmVzdWx0WzJdLCAxNikgPDwgOCkgfFxyXG4gICAgICAgIChwYXJzZUludChyZXN1bHRbM10sIDE2KSA8PCAxNikgfFxyXG4gICAgICAgICgweGZmIDw8IDI0KVxyXG4gICAgICApO1xyXG4gICAgfTtcclxuICAgIGNvbnN0IGZpbGxTcXVhcmUgPSAoeCwgeSwgY29sb3IpID0+IHtcclxuICAgICAgdmFyIHdpZHRoID0gY2VsbFdpZHRoLFxyXG4gICAgICAgIGhlaWdodCA9IGNlbGxIZWlnaHQ7XHJcblxyXG4gICAgICBpZiAoeCAqIGNlbGxXaWR0aCArIHdpZHRoID4gY2FudmFzLndpZHRoKSB7XHJcbiAgICAgICAgd2lkdGggPSBjYW52YXMud2lkdGggLSB4ICogY2VsbFdpZHRoO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoeSAqIGNlbGxIZWlnaHQgKyBoZWlnaHQgPiBjYW52YXMuaGVpZ2h0KSB7XHJcbiAgICAgICAgaGVpZ2h0ID0gY2FudmFzLmhlaWdodCAtIHkgKiBjZWxsSGVpZ2h0O1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAod2lkdGggPD0gMCB8fCBoZWlnaHQgPD0gMCkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgdmFyIHBvaW50ZXIgPSB4ICogY2VsbFdpZHRoICsgeSAqIGNhbnZhcy53aWR0aCAqIGNlbGxIZWlnaHQsXHJcbiAgICAgICAgcm93V2lkdGggPSBjYW52YXMud2lkdGggLSB3aWR0aDtcclxuXHJcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaGVpZ2h0OyBpKyspIHtcclxuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHdpZHRoOyBqKyspIHtcclxuICAgICAgICAgIGltYWdlRGF0YVtwb2ludGVyXSA9IGNvbG9yO1xyXG5cclxuICAgICAgICAgIHBvaW50ZXIrKztcclxuICAgICAgICB9XHJcbiAgICAgICAgcG9pbnRlciArPSByb3dXaWR0aDtcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLnJlbmRlciA9ICh3b3JsZCwgZGlmZikgPT4ge1xyXG4gICAgICBmb3IgKGxldCBpbmRleCBvZiBkaWZmKSB7XHJcbiAgICAgICAgZmlsbFNxdWFyZShcclxuICAgICAgICAgIGluZGV4ICUgY29scyxcclxuICAgICAgICAgIE1hdGguZmxvb3IoaW5kZXggLyBjb2xzKSxcclxuICAgICAgICAgIHdvcmxkLmNlbGxzW2luZGV4XSA9PT0gMVxyXG4gICAgICAgICAgICA/IHRoaXMuY29sb3JzW3dvcmxkLm5laWdoYm91cnMoaW5kZXgpXVxyXG4gICAgICAgICAgICA6IC8vID8gbGl2ZUNvbG9yXHJcbiAgICAgICAgICAgICAgZGVhZENvbG9yXHJcbiAgICAgICAgKTtcclxuICAgICAgfVxyXG4gICAgICBjb250ZXh0LnB1dEltYWdlRGF0YShpbWFnZSwgMCwgMCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMucmVzZXQgPSBvcHRpb25zID0+IHtcclxuICAgICAgcmVzZXREYXRhKCk7XHJcbiAgICAgIHRoaXMuY29sb3JzID0gb3B0aW9ucy5jb2xvcnMubWFwKGhleFRvUmdiKTtcclxuICAgICAgY29udGV4dC5wdXRJbWFnZURhdGEoaW1hZ2UsIDAsIDApO1xyXG4gICAgfTtcclxuICB9XHJcbn1cclxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvQ2FudmFzUmVuZGVyZXIuanNcbi8vIG1vZHVsZSBpZCA9IDNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gc3RhdHMuanMgLSBodHRwOi8vZ2l0aHViLmNvbS9tcmRvb2Ivc3RhdHMuanNcclxuKGZ1bmN0aW9uKGYsZSl7XCJvYmplY3RcIj09PXR5cGVvZiBleHBvcnRzJiZcInVuZGVmaW5lZFwiIT09dHlwZW9mIG1vZHVsZT9tb2R1bGUuZXhwb3J0cz1lKCk6XCJmdW5jdGlvblwiPT09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoZSk6Zi5TdGF0cz1lKCl9KSh0aGlzLGZ1bmN0aW9uKCl7dmFyIGY9ZnVuY3Rpb24oKXtmdW5jdGlvbiBlKGEpe2MuYXBwZW5kQ2hpbGQoYS5kb20pO3JldHVybiBhfWZ1bmN0aW9uIHUoYSl7Zm9yKHZhciBkPTA7ZDxjLmNoaWxkcmVuLmxlbmd0aDtkKyspYy5jaGlsZHJlbltkXS5zdHlsZS5kaXNwbGF5PWQ9PT1hP1wiYmxvY2tcIjpcIm5vbmVcIjtsPWF9dmFyIGw9MCxjPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7Yy5zdHlsZS5jc3NUZXh0PVwicG9zaXRpb246Zml4ZWQ7dG9wOjA7bGVmdDowO2N1cnNvcjpwb2ludGVyO29wYWNpdHk6MC45O3otaW5kZXg6MTAwMDBcIjtjLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLGZ1bmN0aW9uKGEpe2EucHJldmVudERlZmF1bHQoKTtcclxudSgrK2wlYy5jaGlsZHJlbi5sZW5ndGgpfSwhMSk7dmFyIGs9KHBlcmZvcm1hbmNlfHxEYXRlKS5ub3coKSxnPWssYT0wLHI9ZShuZXcgZi5QYW5lbChcIkZQU1wiLFwiIzBmZlwiLFwiIzAwMlwiKSksaD1lKG5ldyBmLlBhbmVsKFwiTVNcIixcIiMwZjBcIixcIiMwMjBcIikpO2lmKHNlbGYucGVyZm9ybWFuY2UmJnNlbGYucGVyZm9ybWFuY2UubWVtb3J5KXZhciB0PWUobmV3IGYuUGFuZWwoXCJNQlwiLFwiI2YwOFwiLFwiIzIwMVwiKSk7dSgwKTtyZXR1cm57UkVWSVNJT046MTYsZG9tOmMsYWRkUGFuZWw6ZSxzaG93UGFuZWw6dSxiZWdpbjpmdW5jdGlvbigpe2s9KHBlcmZvcm1hbmNlfHxEYXRlKS5ub3coKX0sZW5kOmZ1bmN0aW9uKCl7YSsrO3ZhciBjPShwZXJmb3JtYW5jZXx8RGF0ZSkubm93KCk7aC51cGRhdGUoYy1rLDIwMCk7aWYoYz5nKzFFMyYmKHIudXBkYXRlKDFFMyphLyhjLWcpLDEwMCksZz1jLGE9MCx0KSl7dmFyIGQ9cGVyZm9ybWFuY2UubWVtb3J5O3QudXBkYXRlKGQudXNlZEpTSGVhcFNpemUvXHJcbjEwNDg1NzYsZC5qc0hlYXBTaXplTGltaXQvMTA0ODU3Nil9cmV0dXJuIGN9LHVwZGF0ZTpmdW5jdGlvbigpe2s9dGhpcy5lbmQoKX0sZG9tRWxlbWVudDpjLHNldE1vZGU6dX19O2YuUGFuZWw9ZnVuY3Rpb24oZSxmLGwpe3ZhciBjPUluZmluaXR5LGs9MCxnPU1hdGgucm91bmQsYT1nKHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvfHwxKSxyPTgwKmEsaD00OCphLHQ9MyphLHY9MiphLGQ9MyphLG09MTUqYSxuPTc0KmEscD0zMCphLHE9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtxLndpZHRoPXI7cS5oZWlnaHQ9aDtxLnN0eWxlLmNzc1RleHQ9XCJ3aWR0aDo4MHB4O2hlaWdodDo0OHB4XCI7dmFyIGI9cS5nZXRDb250ZXh0KFwiMmRcIik7Yi5mb250PVwiYm9sZCBcIis5KmErXCJweCBIZWx2ZXRpY2EsQXJpYWwsc2Fucy1zZXJpZlwiO2IudGV4dEJhc2VsaW5lPVwidG9wXCI7Yi5maWxsU3R5bGU9bDtiLmZpbGxSZWN0KDAsMCxyLGgpO2IuZmlsbFN0eWxlPWY7Yi5maWxsVGV4dChlLHQsdik7XHJcbmIuZmlsbFJlY3QoZCxtLG4scCk7Yi5maWxsU3R5bGU9bDtiLmdsb2JhbEFscGhhPS45O2IuZmlsbFJlY3QoZCxtLG4scCk7cmV0dXJue2RvbTpxLHVwZGF0ZTpmdW5jdGlvbihoLHcpe2M9TWF0aC5taW4oYyxoKTtrPU1hdGgubWF4KGssaCk7Yi5maWxsU3R5bGU9bDtiLmdsb2JhbEFscGhhPTE7Yi5maWxsUmVjdCgwLDAscixtKTtiLmZpbGxTdHlsZT1mO2IuZmlsbFRleHQoZyhoKStcIiBcIitlK1wiIChcIitnKGMpK1wiLVwiK2coaykrXCIpXCIsdCx2KTtiLmRyYXdJbWFnZShxLGQrYSxtLG4tYSxwLGQsbSxuLWEscCk7Yi5maWxsUmVjdChkK24tYSxtLGEscCk7Yi5maWxsU3R5bGU9bDtiLmdsb2JhbEFscGhhPS45O2IuZmlsbFJlY3QoZCtuLWEsbSxhLGcoKDEtaC93KSpwKSl9fX07cmV0dXJuIGZ9KTtcclxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9saWIvc3RhdHMubWluLmpzXG4vLyBtb2R1bGUgaWQgPSA0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIE9wdGlvbnMge1xyXG4gIGNvbnN0cnVjdG9yKGd1aSwgcmVzZXQsIHBhdXNlLCBwbGF5KSB7XHJcbiAgICAvL3J1bGVzXHJcbiAgICB0aGlzLmJpcnRoID0gXCIzXCI7XHJcbiAgICB0aGlzLnN1cnZpdmFsID0gXCIyM1wiO1xyXG4gICAgdGhpcy5yYW5kb21TdGFydCA9IHRydWU7XHJcbiAgICB0aGlzLnJlc2V0ID0gKCkgPT4gcmVzZXQodGhpcyk7XHJcbiAgICB0aGlzLnBhdXNlID0gcGF1c2U7XHJcbiAgICB0aGlzLnBsYXkgPSBwbGF5O1xyXG4gICAgY29uc3QgcnVsZXNGb2xkZXIgPSBndWkuYWRkRm9sZGVyKFwicnVsZXNcIik7XHJcbiAgICBydWxlc0ZvbGRlci5hZGQodGhpcywgXCJiaXJ0aFwiKTtcclxuICAgIHJ1bGVzRm9sZGVyLmFkZCh0aGlzLCBcInN1cnZpdmFsXCIpO1xyXG4gICAgZ3VpLmNsb3NlZCA9IHRydWU7XHJcblxyXG4gICAgLy9jb2xvcnNcclxuICAgIGNvbnN0IGNvbG9yc0ZvbGRlcnMgPSBndWkuYWRkRm9sZGVyKFwiY29sb3JzIGJ5IG5laWdoYm91cnNcIik7XHJcbiAgICB0aGlzLmNvbG9ycyA9IFtdO1xyXG4gICAgY29uc3QgcmVzZXRDb2xvcnMgPSAoKSA9PiB7XHJcbiAgICAgIHRoaXMuY29sb3JzWzBdID0gXCJcIjtcclxuICAgICAgdGhpcy5jb2xvcnNbMV0gPSBcIiNGRkZGRkZcIjtcclxuICAgICAgdGhpcy5jb2xvcnNbMl0gPSBcIiNGRkZGRkZcIjtcclxuICAgICAgdGhpcy5jb2xvcnNbM10gPSBcIiNGRkZGRkZcIjtcclxuICAgICAgdGhpcy5jb2xvcnNbNF0gPSBcIiNGRkZGRkZcIjtcclxuICAgICAgdGhpcy5jb2xvcnNbNV0gPSBcIiNGRkZGRkZcIjtcclxuICAgICAgdGhpcy5jb2xvcnNbNl0gPSBcIiNGRkZGRkZcIjtcclxuICAgICAgdGhpcy5jb2xvcnNbN10gPSBcIiNGRkZGRkZcIjtcclxuICAgICAgdGhpcy5jb2xvcnNbOF0gPSBcIiNGRkZGRkZcIjtcclxuICAgIH07XHJcbiAgICByZXNldENvbG9ycygpO1xyXG4gICAgY29uc3QgbGV0dGVycyA9IFwiMDEyMzQ1Njc4OUFCQ0RFRlwiO1xyXG4gICAgY29uc3QgcmFuZG9tQ29sb3IgPSAoKSA9PiB7XHJcbiAgICAgIGxldCBjb2xvciA9IFwiI1wiO1xyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDY7IGkrKykge1xyXG4gICAgICAgIGNvbG9yICs9IGxldHRlcnNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTYpXTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gY29sb3I7XHJcbiAgICB9O1xyXG4gICAgdGhpcy5jb2xvcnMucmFuZG9tID0gKCkgPT4ge1xyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY29sb3JzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdGhpcy5jb2xvcnNbaV0gPSByYW5kb21Db2xvcigpO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG4gICAgdGhpcy5jb2xvcnMuYmxhY2tXaGl0ZSA9ICgpID0+IHJlc2V0Q29sb3JzKCk7XHJcbiAgICBjb2xvcnNGb2xkZXJzLmFkZENvbG9yKHRoaXMuY29sb3JzLCBcIjFcIikubGlzdGVuKCk7XHJcbiAgICBjb2xvcnNGb2xkZXJzLmFkZENvbG9yKHRoaXMuY29sb3JzLCBcIjJcIikubGlzdGVuKCk7XHJcbiAgICBjb2xvcnNGb2xkZXJzLmFkZENvbG9yKHRoaXMuY29sb3JzLCBcIjNcIikubGlzdGVuKCk7XHJcbiAgICBjb2xvcnNGb2xkZXJzLmFkZENvbG9yKHRoaXMuY29sb3JzLCBcIjRcIikubGlzdGVuKCk7XHJcbiAgICBjb2xvcnNGb2xkZXJzLmFkZENvbG9yKHRoaXMuY29sb3JzLCBcIjVcIikubGlzdGVuKCk7XHJcbiAgICBjb2xvcnNGb2xkZXJzLmFkZENvbG9yKHRoaXMuY29sb3JzLCBcIjZcIikubGlzdGVuKCk7XHJcbiAgICBjb2xvcnNGb2xkZXJzLmFkZENvbG9yKHRoaXMuY29sb3JzLCBcIjdcIikubGlzdGVuKCk7XHJcbiAgICBjb2xvcnNGb2xkZXJzLmFkZENvbG9yKHRoaXMuY29sb3JzLCBcIjhcIikubGlzdGVuKCk7XHJcbiAgICBjb2xvcnNGb2xkZXJzLmFkZCh0aGlzLmNvbG9ycywgXCJyYW5kb21cIik7XHJcbiAgICBjb2xvcnNGb2xkZXJzLmFkZCh0aGlzLmNvbG9ycywgXCJibGFja1doaXRlXCIpLm5hbWUoXCJibGFjayAmIHdoaXRlXCIpO1xyXG5cclxuICAgIC8vc2hhcmVcclxuICAgIGNvbnN0IHNoYXJlRm9sZGVyID0gZ3VpLmFkZEZvbGRlcihcInNoYXJlXCIpO1xyXG4gICAgdGhpcy50d2VldCA9ICgpID0+XHJcbiAgICAgIHdpbmRvdy5vcGVuKFxyXG4gICAgICAgIFwiaHR0cHM6Ly90d2l0dGVyLmNvbS9pbnRlbnQvdHdlZXQ/dGV4dD1IZWxsbyUyMHdvcmxkXCIsXHJcbiAgICAgICAgXCJfYmxhbmtcIixcclxuICAgICAgICBcImxvY2F0aW9uPXllc1wiXHJcbiAgICAgICk7XHJcbiAgICBzaGFyZUZvbGRlci5hZGQodGhpcywgXCJ0d2VldFwiKTtcclxuICAgIHRoaXMuY29weUxpbmsgPSAoKSA9PiB7fTtcclxuICAgIHNoYXJlRm9sZGVyLmFkZCh0aGlzLCBcImNvcHlMaW5rXCIpLm5hbWUoXCJjb3B5IGxpbmtcIik7XHJcblxyXG4gICAgZ3VpXHJcbiAgICAgIC5hZGQodGhpcywgXCJyYW5kb21TdGFydFwiKVxyXG4gICAgICAubmFtZShcInJhbmRvbSBzdGFydFwiKVxyXG4gICAgICAubGlzdGVuKCk7XHJcbiAgICBndWkuYWRkKHRoaXMsIFwicmVzZXRcIikubmFtZShcInNldCAmIGdvXCIpO1xyXG4gICAgdGhpcy5hYm91dCA9ICgpID0+XHJcbiAgICAgIHdpbmRvdy5vcGVuKFxyXG4gICAgICAgIFwiaHR0cHM6Ly9naXRodWIuY29tL29kZWR3L2NlbGx1bGFyLWF1dG9tYXRhLXBsYXlncm91bmQvYmxvYi9tYXN0ZXIvUkVBRE1FLm1kXCIsXHJcbiAgICAgICAgXCJfYmxhbmtcIlxyXG4gICAgICApO1xyXG4gICAgZ3VpLmFkZCh0aGlzLCBcImFib3V0XCIpO1xyXG4gIH1cclxufVxyXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9PcHRpb25zLmpzXG4vLyBtb2R1bGUgaWQgPSA1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJzb3VyY2VSb290IjoiIn0=