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
    30, //desired fps
    stats
  );
renderer.onDraw = engine.onDraw;
window.onload = () => {
  const gui = new dat.GUI();
  const options = new __WEBPACK_IMPORTED_MODULE_3__Options__["a" /* default */](
    gui,
    model => {
      renderer.reset(model);
      engine.start(model);
    },
    engine.pause,
    engine.play
  );
  options.methods.reset();
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
      birth = "",
      survival = "",
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

    const setModel = model => {
      birth = model.birth || "3";
      survival = model.survival || "23";
      for (let i = 0; i < 8; i++) {
        birthMap[i] = birth.indexOf(i) >= 0 ? 1 : 0;
        survivalMap[i] = survival.indexOf(i) >= 0 ? 1 : 0;
      }

      randomStart = model.randomStart;
    };

    this.start = model => {
      setModel(model);
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
    this.model = {
      birth: "3",
      survival: "23",
      randomStart: true,
      colors: new Array(9)
    };
    this.methods = {
      reset: () => reset(this.model),
      pause,
      play,
      resetColors: () => {
        for (let i = 0; i < this.model.colors.length; i++)
          this.model.colors[i] = "#FFFFFF";
      },
      random: () => {
        for (let i = 0; i < this.model.colors.length; i++) {
          this.model.colors[i] = randomColor();
        }
      },
      blackWhite: () => this.methods.resetColors(),
      tweet: () =>
        window.open(
          "https://twitter.com/intent/tweet?text=Hello%20world",
          "_blank",
          "location=yes"
        ),
      copyLink: () => {
        const str = btoa(JSON.stringify(this.model));
        console.log(str);
      },
      about: () =>
        window.open(
          "https://github.com/odedw/cellular-automata-playground/blob/master/README.md",
          "_blank"
        )
    };
    const letters = "0123456789ABCDEF",
      randomColor = () => {
        let color = "#";
        for (let i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      };

    //rules
    const rulesFolder = gui.addFolder("rules");
    rulesFolder.add(this.model, "birth");
    rulesFolder.add(this.model, "survival");

    //colors
    const colorsFolder = gui.addFolder("colors by neighbours");
    this.methods.resetColors();
    for (let i = 1; i < this.model.colors.length; i++) {
      colorsFolder.addColor(this.model.colors, i).listen();
    }
    colorsFolder.add(this.methods, "random");
    colorsFolder.add(this.methods, "blackWhite").name("black & white");

    //share
    // const shareFolder = gui.addFolder("share");
    // shareFolder.add(this.methods, "tweet");
    // shareFolder.add(this.methods, "copyLink").name("copy link");

    gui
      .add(this.model, "randomStart")
      .name("random start")
      .listen();
    gui.add(this.methods, "reset").name("set & go");
    gui.add(this.methods, "about");

    gui.closed = true;
    document.onkeydown = ev => {
      if (ev.keyCode == 32) {
        //space
        this.methods.reset();
      } else if (ev.keyCode == 82) {
        //r
        this.model.randomStart = !this.model.randomStart;
      } else if (ev.keyCode == 67) {
        //c
        this.methods.random();
      }
    };
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
    const canvas = document.createElement("canvas"),
      context = canvas.getContext("2d");
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

    canvas.addEventListener("mousedown", evt => {
      mouseDown = true;
      onDraw(evt);
    });

    canvas.addEventListener("mousemove", onDraw);
    canvas.addEventListener("mouseup", evt => (mouseDown = false));

    const liveColor = 0xff | (0xff << 8) | (0xff << 16) | (0xff << 24),
      deadColor = 0x00 | (0x00 << 8) | (0x00 << 16) | (0xff << 24);

    const hexToRgb = hex => {
      const result =
        /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex) || "#000000";
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

    this.reset = model => {
      resetData();
      this.colors = model.colors.map(hexToRgb);
      context.putImageData(image, 0, 0);
    };
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Renderer;



/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNmMxMzdlZGZmZDA1YzJkMzAzYzUiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FwcC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvRW5naW5lLmpzIiwid2VicGFjazovLy8uL3NyYy9Xb3JsZC5qcyIsIndlYnBhY2s6Ly8vLi9saWIvc3RhdHMubWluLmpzIiwid2VicGFjazovLy8uL3NyYy9PcHRpb25zLmpzIiwid2VicGFjazovLy8uL3NyYy9DYW52YXNSZW5kZXJlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7O0FDN0RBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7QUNqQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIsV0FBVztB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RUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EscUJBQXFCLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRTtBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLHFCQUFxQixZQUFZO0FBQ2pDLHVCQUF1QixXQUFXO0FBQ2xDOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDZjMTM3ZWRmZmQwNWMyZDMwM2M1IiwiaW1wb3J0IEVuZ2luZSBmcm9tICcuL0VuZ2luZSc7XHJcbmltcG9ydCBSZW5kZXJlciBmcm9tICcuL0NhbnZhc1JlbmRlcmVyJztcclxuaW1wb3J0IFN0YXRzIGZyb20gJy4uL2xpYi9zdGF0cy5taW4nO1xyXG5pbXBvcnQgT3B0aW9ucyBmcm9tICcuL09wdGlvbnMnO1xyXG5cclxuY29uc3Qgc3RhdHMgPSBuZXcgU3RhdHMoKTtcclxuc3RhdHMuc2hvd1BhbmVsKDEpO1xyXG4vLyBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHN0YXRzLmRvbSk7XHJcblxyXG5jb25zdCBwaXhlbHNQZXJDZWxsID0gNCxcclxuICBjb2xzID0gTWF0aC5jZWlsKHdpbmRvdy5pbm5lcldpZHRoIC8gcGl4ZWxzUGVyQ2VsbCksXHJcbiAgcm93cyA9IE1hdGguY2VpbCh3aW5kb3cuaW5uZXJIZWlnaHQgLyBwaXhlbHNQZXJDZWxsKSxcclxuICByZW5kZXJlciA9IG5ldyBSZW5kZXJlcihjb2xzLCByb3dzLCBwaXhlbHNQZXJDZWxsLCBwaXhlbHNQZXJDZWxsKSxcclxuICBlbmdpbmUgPSBuZXcgRW5naW5lKFxyXG4gICAgY29scywgLy9udW1iZXIgb2YgY29sdW1uc1xyXG4gICAgcm93cywgLy9udW1iZXIgb2Ygcm93c1xyXG4gICAgcmVuZGVyZXIucmVuZGVyLCAvL29uVGlja1xyXG4gICAgMzAsIC8vZGVzaXJlZCBmcHNcclxuICAgIHN0YXRzXHJcbiAgKTtcclxucmVuZGVyZXIub25EcmF3ID0gZW5naW5lLm9uRHJhdztcclxud2luZG93Lm9ubG9hZCA9ICgpID0+IHtcclxuICBjb25zdCBndWkgPSBuZXcgZGF0LkdVSSgpO1xyXG4gIGNvbnN0IG9wdGlvbnMgPSBuZXcgT3B0aW9ucyhcclxuICAgIGd1aSxcclxuICAgIG1vZGVsID0+IHtcclxuICAgICAgcmVuZGVyZXIucmVzZXQobW9kZWwpO1xyXG4gICAgICBlbmdpbmUuc3RhcnQobW9kZWwpO1xyXG4gICAgfSxcclxuICAgIGVuZ2luZS5wYXVzZSxcclxuICAgIGVuZ2luZS5wbGF5XHJcbiAgKTtcclxuICBvcHRpb25zLm1ldGhvZHMucmVzZXQoKTtcclxufTtcclxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvYXBwLmpzXG4vLyBtb2R1bGUgaWQgPSAwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCBXb3JsZCBmcm9tIFwiLi9Xb3JsZFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFbmdpbmUge1xuICBjb25zdHJ1Y3Rvcihjb2xzLCByb3dzLCBvblRpY2ssIGRlc2lyZWRGcHMsIHN0YXRzKSB7XG4gICAgbGV0IGVuZ2luZVRpbWUgPSAwLFxuICAgICAgY3VycmVudCxcbiAgICAgIG5leHQsXG4gICAgICBiaXJ0aCA9IFwiXCIsXG4gICAgICBzdXJ2aXZhbCA9IFwiXCIsXG4gICAgICByYW5kb21TdGFydCA9IGZhbHNlLFxuICAgICAgYmlydGhNYXAgPSBuZXcgQXJyYXkoOCksXG4gICAgICBzdXJ2aXZhbE1hcCA9IG5ldyBBcnJheSg4KSxcbiAgICAgIG1zVGlsbE5leHRGcmFtZSA9IDAsXG4gICAgICBsYXN0VGlja1RpbWUgPSAwLFxuICAgICAgdG90YWwgPSByb3dzICogY29scyxcbiAgICAgIGlzUnVubmluZyA9IGZhbHNlO1xuXG4gICAgY29uc3QgbXNQZXJGcmFtZSA9IDEwMDAgLyBkZXNpcmVkRnBzO1xuXG4gICAgY29uc3QgY29tcHV0ZU5leHRTdGF0ZSA9ICgpID0+IHtcbiAgICAgIGxldCBuZXh0U3RhdGUgPSAwO1xuICAgICAgY29uc3QgZGlmZiA9IG5ldyBTZXQoKTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdG90YWw7IGkrKykge1xuICAgICAgICBsZXQgbmVpZ2hib3JzID0gY3VycmVudC5uZWlnaGJvdXJzKGkpLFxuICAgICAgICAgIGN1cnJlbnRTdGF0ZSA9IGN1cnJlbnQuZ2V0KGkpO1xuXG4gICAgICAgIG5leHRTdGF0ZSA9XG4gICAgICAgICAgY3VycmVudFN0YXRlID09PSAxID8gc3Vydml2YWxNYXBbbmVpZ2hib3JzXSA6IGJpcnRoTWFwW25laWdoYm9yc107XG4gICAgICAgIG5leHQuc2V0KGksIG5leHRTdGF0ZSk7XG5cbiAgICAgICAgaWYgKGN1cnJlbnRTdGF0ZSAhPT0gbmV4dFN0YXRlKSB7XG4gICAgICAgICAgZGlmZi5hZGQoaSk7XG4gICAgICAgICAgY29uc3QgbmVpZ2hib3Vyc0luZGljZXMgPSBjdXJyZW50Lm5laWdoYm91cnNJbmRpY2VzW2ldO1xuICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgbmVpZ2hib3Vyc0luZGljZXMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgIGRpZmYuYWRkKG5laWdoYm91cnNJbmRpY2VzW2pdKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGNvbnN0IHRlbXAgPSBjdXJyZW50O1xuICAgICAgY3VycmVudCA9IG5leHQ7XG4gICAgICBuZXh0ID0gdGVtcDtcbiAgICAgIHJldHVybiBkaWZmO1xuICAgIH07XG5cbiAgICBjb25zdCB0aWNrID0gKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhcnRUaW1lID0gcGVyZm9ybWFuY2Uubm93KCksXG4gICAgICAgIG1zRWxhcHNlZCA9IHN0YXJ0VGltZSAtIGxhc3RUaWNrVGltZTtcbiAgICAgIG1zVGlsbE5leHRGcmFtZSAtPSBtc0VsYXBzZWQ7XG4gICAgICBpZiAobXNUaWxsTmV4dEZyYW1lIDw9IDApIHtcbiAgICAgICAgc3RhdHMuYmVnaW4oKTtcbiAgICAgICAgY29uc3QgZGlmZiA9IGNvbXB1dGVOZXh0U3RhdGUoKTtcbiAgICAgICAgb25UaWNrKGN1cnJlbnQsIGRpZmYpO1xuICAgICAgICBzdGF0cy5lbmQoKTtcbiAgICAgICAgbGFzdFRpY2tUaW1lID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgICAgIGNvbnN0IHRpbWVGb3JGcmFtZSA9IGxhc3RUaWNrVGltZSAtIHN0YXJ0VGltZTtcbiAgICAgICAgbXNUaWxsTmV4dEZyYW1lID0gbXNQZXJGcmFtZSAtIHRpbWVGb3JGcmFtZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxhc3RUaWNrVGltZSA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgICAgfVxuXG4gICAgICBpZiAoaXNSdW5uaW5nKSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRpY2spO1xuICAgIH07XG5cbiAgICBjb25zdCBzZXRNb2RlbCA9IG1vZGVsID0+IHtcbiAgICAgIGJpcnRoID0gbW9kZWwuYmlydGggfHwgXCIzXCI7XG4gICAgICBzdXJ2aXZhbCA9IG1vZGVsLnN1cnZpdmFsIHx8IFwiMjNcIjtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgODsgaSsrKSB7XG4gICAgICAgIGJpcnRoTWFwW2ldID0gYmlydGguaW5kZXhPZihpKSA+PSAwID8gMSA6IDA7XG4gICAgICAgIHN1cnZpdmFsTWFwW2ldID0gc3Vydml2YWwuaW5kZXhPZihpKSA+PSAwID8gMSA6IDA7XG4gICAgICB9XG5cbiAgICAgIHJhbmRvbVN0YXJ0ID0gbW9kZWwucmFuZG9tU3RhcnQ7XG4gICAgfTtcblxuICAgIHRoaXMuc3RhcnQgPSBtb2RlbCA9PiB7XG4gICAgICBzZXRNb2RlbChtb2RlbCk7XG4gICAgICBjdXJyZW50ID0gbmV3IFdvcmxkKHJvd3MsIGNvbHMsIHJhbmRvbVN0YXJ0KTtcbiAgICAgIG5leHQgPSBuZXcgV29ybGQocm93cywgY29scyk7XG4gICAgICBpc1J1bm5pbmcgPSB0cnVlO1xuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aWNrKTtcbiAgICB9O1xuXG4gICAgdGhpcy5wYXVzZSA9ICgpID0+IHtcbiAgICAgIGlzUnVubmluZyA9IGZhbHNlO1xuICAgIH07XG5cbiAgICB0aGlzLnBsYXkgPSAoKSA9PiB7XG4gICAgICBpc1J1bm5pbmcgPSB0cnVlO1xuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aWNrKTtcbiAgICB9O1xuXG4gICAgdGhpcy5vbkRyYXcgPSAoaSwgaikgPT4ge1xuICAgICAgY3VycmVudC5jcm9zcyhpLCBqKTtcbiAgICB9O1xuICB9XG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9FbmdpbmUuanNcbi8vIG1vZHVsZSBpZCA9IDFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgV29ybGQge1xuICBjb25zdHJ1Y3Rvcihyb3dzLCBjb2xzLCByYW5kb21TdGFydCkge1xuICAgIHRoaXMuY2VsbHMgPSBuZXcgVWludDhBcnJheShuZXcgQXJyYXlCdWZmZXIocm93cyAqIGNvbHMpKTtcbiAgICBjb25zdCBpbmRleCA9IChpLCBqKSA9PiBpICogY29scyArIGo7XG4gICAgdGhpcy5uZWlnaGJvdXJzSW5kaWNlcyA9IG5ldyBBcnJheShjb2xzICogcm93cyk7XG4gICAgdGhpcy5nZXQgPSBpID0+XG4gICAgICBpID49IDAgJiYgaSA8IHRoaXMuY2VsbHMubGVuZ3RoID8gdGhpcy5jZWxsc1tpXSA6IHVuZGVmaW5lZDtcblxuICAgIHRoaXMuc2V0ID0gKGksIHZhbCkgPT4gKHRoaXMuY2VsbHNbaV0gPSB2YWwpO1xuXG4gICAgdGhpcy5jcm9zcyA9IChpLCBqKSA9PiB7XG4gICAgICBpZiAoaSAtIDEgPiAwKSB0aGlzLmNlbGxzW2luZGV4KGkgLSAxLCBqKV0gPSAxO1xuICAgICAgaWYgKGogLSAxID4gMCkgdGhpcy5jZWxsc1tpbmRleChpLCBqIC0gMSldID0gMTtcbiAgICAgIHRoaXMuY2VsbHNbaW5kZXgoaSwgaildID0gMTtcbiAgICAgIGlmIChqICsgMSA+IGNvbHMpIHRoaXMuY2VsbHNbaW5kZXgoaSwgaiArIDEpXSA9IDE7XG4gICAgICBpZiAoaSArIDEgPCByb3dzKSB0aGlzLmNlbGxzW2luZGV4KGkgKyAxLCBqKV0gPSAxO1xuICAgIH07XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJvd3M7IGkrKykge1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBjb2xzOyBqKyspIHtcbiAgICAgICAgdGhpcy5uZWlnaGJvdXJzSW5kaWNlc1tpbmRleChpLCBqKV0gPSBbXTtcbiAgICAgICAgaWYgKGkgLSAxID49IDAgJiYgaiAtIDEgPj0gMClcbiAgICAgICAgICB0aGlzLm5laWdoYm91cnNJbmRpY2VzW2luZGV4KGksIGopXS5wdXNoKGluZGV4KGkgLSAxLCBqIC0gMSkpO1xuICAgICAgICBpZiAoaSAtIDEgPj0gMClcbiAgICAgICAgICB0aGlzLm5laWdoYm91cnNJbmRpY2VzW2luZGV4KGksIGopXS5wdXNoKGluZGV4KGkgLSAxLCBqKSk7XG4gICAgICAgIGlmIChpIC0gMSA+PSAwICYmIGogKyAxIDwgY29scylcbiAgICAgICAgICB0aGlzLm5laWdoYm91cnNJbmRpY2VzW2luZGV4KGksIGopXS5wdXNoKGluZGV4KGkgLSAxLCBqICsgMSkpO1xuXG4gICAgICAgIGlmIChqIC0gMSA+PSAwKVxuICAgICAgICAgIHRoaXMubmVpZ2hib3Vyc0luZGljZXNbaW5kZXgoaSwgaildLnB1c2goaW5kZXgoaSwgaiAtIDEpKTtcbiAgICAgICAgaWYgKGogKyAxIDwgY29scylcbiAgICAgICAgICB0aGlzLm5laWdoYm91cnNJbmRpY2VzW2luZGV4KGksIGopXS5wdXNoKGluZGV4KGksIGogKyAxKSk7XG5cbiAgICAgICAgaWYgKGkgKyAxIDwgcm93cyAmJiBqIC0gMSA+PSAwKVxuICAgICAgICAgIHRoaXMubmVpZ2hib3Vyc0luZGljZXNbaW5kZXgoaSwgaildLnB1c2goaW5kZXgoaSArIDEsIGogLSAxKSk7XG4gICAgICAgIGlmIChpICsgMSA8IHJvd3MpXG4gICAgICAgICAgdGhpcy5uZWlnaGJvdXJzSW5kaWNlc1tpbmRleChpLCBqKV0ucHVzaChpbmRleChpICsgMSwgaikpO1xuICAgICAgICBpZiAoaSArIDEgPCByb3dzICYmIGogKyAxIDwgY29scylcbiAgICAgICAgICB0aGlzLm5laWdoYm91cnNJbmRpY2VzW2luZGV4KGksIGopXS5wdXNoKGluZGV4KGkgKyAxLCBqICsgMSkpO1xuICAgICAgfVxuICAgIH1cbiAgICBjb25zdCBjb3VudCA9IChhLCBiKSA9PiBhICsgdGhpcy5jZWxsc1tiXTtcbiAgICB0aGlzLm5laWdoYm91cnMgPSBpID0+IHRoaXMubmVpZ2hib3Vyc0luZGljZXNbaV0ucmVkdWNlKGNvdW50LCAwKTtcblxuICAgIGlmIChyYW5kb21TdGFydClcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5jZWxscy5sZW5ndGg7IGkrKylcbiAgICAgICAgdGhpcy5jZWxsc1tpXSA9IE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSk7XG4gIH1cbn1cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL1dvcmxkLmpzXG4vLyBtb2R1bGUgaWQgPSAyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIHN0YXRzLmpzIC0gaHR0cDovL2dpdGh1Yi5jb20vbXJkb29iL3N0YXRzLmpzXG4oZnVuY3Rpb24oZixlKXtcIm9iamVjdFwiPT09dHlwZW9mIGV4cG9ydHMmJlwidW5kZWZpbmVkXCIhPT10eXBlb2YgbW9kdWxlP21vZHVsZS5leHBvcnRzPWUoKTpcImZ1bmN0aW9uXCI9PT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShlKTpmLlN0YXRzPWUoKX0pKHRoaXMsZnVuY3Rpb24oKXt2YXIgZj1mdW5jdGlvbigpe2Z1bmN0aW9uIGUoYSl7Yy5hcHBlbmRDaGlsZChhLmRvbSk7cmV0dXJuIGF9ZnVuY3Rpb24gdShhKXtmb3IodmFyIGQ9MDtkPGMuY2hpbGRyZW4ubGVuZ3RoO2QrKyljLmNoaWxkcmVuW2RdLnN0eWxlLmRpc3BsYXk9ZD09PWE/XCJibG9ja1wiOlwibm9uZVwiO2w9YX12YXIgbD0wLGM9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtjLnN0eWxlLmNzc1RleHQ9XCJwb3NpdGlvbjpmaXhlZDt0b3A6MDtsZWZ0OjA7Y3Vyc29yOnBvaW50ZXI7b3BhY2l0eTowLjk7ei1pbmRleDoxMDAwMFwiO2MuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsZnVuY3Rpb24oYSl7YS5wcmV2ZW50RGVmYXVsdCgpO1xudSgrK2wlYy5jaGlsZHJlbi5sZW5ndGgpfSwhMSk7dmFyIGs9KHBlcmZvcm1hbmNlfHxEYXRlKS5ub3coKSxnPWssYT0wLHI9ZShuZXcgZi5QYW5lbChcIkZQU1wiLFwiIzBmZlwiLFwiIzAwMlwiKSksaD1lKG5ldyBmLlBhbmVsKFwiTVNcIixcIiMwZjBcIixcIiMwMjBcIikpO2lmKHNlbGYucGVyZm9ybWFuY2UmJnNlbGYucGVyZm9ybWFuY2UubWVtb3J5KXZhciB0PWUobmV3IGYuUGFuZWwoXCJNQlwiLFwiI2YwOFwiLFwiIzIwMVwiKSk7dSgwKTtyZXR1cm57UkVWSVNJT046MTYsZG9tOmMsYWRkUGFuZWw6ZSxzaG93UGFuZWw6dSxiZWdpbjpmdW5jdGlvbigpe2s9KHBlcmZvcm1hbmNlfHxEYXRlKS5ub3coKX0sZW5kOmZ1bmN0aW9uKCl7YSsrO3ZhciBjPShwZXJmb3JtYW5jZXx8RGF0ZSkubm93KCk7aC51cGRhdGUoYy1rLDIwMCk7aWYoYz5nKzFFMyYmKHIudXBkYXRlKDFFMyphLyhjLWcpLDEwMCksZz1jLGE9MCx0KSl7dmFyIGQ9cGVyZm9ybWFuY2UubWVtb3J5O3QudXBkYXRlKGQudXNlZEpTSGVhcFNpemUvXG4xMDQ4NTc2LGQuanNIZWFwU2l6ZUxpbWl0LzEwNDg1NzYpfXJldHVybiBjfSx1cGRhdGU6ZnVuY3Rpb24oKXtrPXRoaXMuZW5kKCl9LGRvbUVsZW1lbnQ6YyxzZXRNb2RlOnV9fTtmLlBhbmVsPWZ1bmN0aW9uKGUsZixsKXt2YXIgYz1JbmZpbml0eSxrPTAsZz1NYXRoLnJvdW5kLGE9Zyh3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpb3x8MSkscj04MCphLGg9NDgqYSx0PTMqYSx2PTIqYSxkPTMqYSxtPTE1KmEsbj03NCphLHA9MzAqYSxxPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7cS53aWR0aD1yO3EuaGVpZ2h0PWg7cS5zdHlsZS5jc3NUZXh0PVwid2lkdGg6ODBweDtoZWlnaHQ6NDhweFwiO3ZhciBiPXEuZ2V0Q29udGV4dChcIjJkXCIpO2IuZm9udD1cImJvbGQgXCIrOSphK1wicHggSGVsdmV0aWNhLEFyaWFsLHNhbnMtc2VyaWZcIjtiLnRleHRCYXNlbGluZT1cInRvcFwiO2IuZmlsbFN0eWxlPWw7Yi5maWxsUmVjdCgwLDAscixoKTtiLmZpbGxTdHlsZT1mO2IuZmlsbFRleHQoZSx0LHYpO1xuYi5maWxsUmVjdChkLG0sbixwKTtiLmZpbGxTdHlsZT1sO2IuZ2xvYmFsQWxwaGE9Ljk7Yi5maWxsUmVjdChkLG0sbixwKTtyZXR1cm57ZG9tOnEsdXBkYXRlOmZ1bmN0aW9uKGgsdyl7Yz1NYXRoLm1pbihjLGgpO2s9TWF0aC5tYXgoayxoKTtiLmZpbGxTdHlsZT1sO2IuZ2xvYmFsQWxwaGE9MTtiLmZpbGxSZWN0KDAsMCxyLG0pO2IuZmlsbFN0eWxlPWY7Yi5maWxsVGV4dChnKGgpK1wiIFwiK2UrXCIgKFwiK2coYykrXCItXCIrZyhrKStcIilcIix0LHYpO2IuZHJhd0ltYWdlKHEsZCthLG0sbi1hLHAsZCxtLG4tYSxwKTtiLmZpbGxSZWN0KGQrbi1hLG0sYSxwKTtiLmZpbGxTdHlsZT1sO2IuZ2xvYmFsQWxwaGE9Ljk7Yi5maWxsUmVjdChkK24tYSxtLGEsZygoMS1oL3cpKnApKX19fTtyZXR1cm4gZn0pO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9saWIvc3RhdHMubWluLmpzXG4vLyBtb2R1bGUgaWQgPSA0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIE9wdGlvbnMge1xuICBjb25zdHJ1Y3RvcihndWksIHJlc2V0LCBwYXVzZSwgcGxheSkge1xuICAgIHRoaXMubW9kZWwgPSB7XG4gICAgICBiaXJ0aDogXCIzXCIsXG4gICAgICBzdXJ2aXZhbDogXCIyM1wiLFxuICAgICAgcmFuZG9tU3RhcnQ6IHRydWUsXG4gICAgICBjb2xvcnM6IG5ldyBBcnJheSg5KVxuICAgIH07XG4gICAgdGhpcy5tZXRob2RzID0ge1xuICAgICAgcmVzZXQ6ICgpID0+IHJlc2V0KHRoaXMubW9kZWwpLFxuICAgICAgcGF1c2UsXG4gICAgICBwbGF5LFxuICAgICAgcmVzZXRDb2xvcnM6ICgpID0+IHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLm1vZGVsLmNvbG9ycy5sZW5ndGg7IGkrKylcbiAgICAgICAgICB0aGlzLm1vZGVsLmNvbG9yc1tpXSA9IFwiI0ZGRkZGRlwiO1xuICAgICAgfSxcbiAgICAgIHJhbmRvbTogKCkgPT4ge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubW9kZWwuY29sb3JzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgdGhpcy5tb2RlbC5jb2xvcnNbaV0gPSByYW5kb21Db2xvcigpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgYmxhY2tXaGl0ZTogKCkgPT4gdGhpcy5tZXRob2RzLnJlc2V0Q29sb3JzKCksXG4gICAgICB0d2VldDogKCkgPT5cbiAgICAgICAgd2luZG93Lm9wZW4oXG4gICAgICAgICAgXCJodHRwczovL3R3aXR0ZXIuY29tL2ludGVudC90d2VldD90ZXh0PUhlbGxvJTIwd29ybGRcIixcbiAgICAgICAgICBcIl9ibGFua1wiLFxuICAgICAgICAgIFwibG9jYXRpb249eWVzXCJcbiAgICAgICAgKSxcbiAgICAgIGNvcHlMaW5rOiAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHN0ciA9IGJ0b2EoSlNPTi5zdHJpbmdpZnkodGhpcy5tb2RlbCkpO1xuICAgICAgICBjb25zb2xlLmxvZyhzdHIpO1xuICAgICAgfSxcbiAgICAgIGFib3V0OiAoKSA9PlxuICAgICAgICB3aW5kb3cub3BlbihcbiAgICAgICAgICBcImh0dHBzOi8vZ2l0aHViLmNvbS9vZGVkdy9jZWxsdWxhci1hdXRvbWF0YS1wbGF5Z3JvdW5kL2Jsb2IvbWFzdGVyL1JFQURNRS5tZFwiLFxuICAgICAgICAgIFwiX2JsYW5rXCJcbiAgICAgICAgKVxuICAgIH07XG4gICAgY29uc3QgbGV0dGVycyA9IFwiMDEyMzQ1Njc4OUFCQ0RFRlwiLFxuICAgICAgcmFuZG9tQ29sb3IgPSAoKSA9PiB7XG4gICAgICAgIGxldCBjb2xvciA9IFwiI1wiO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDY7IGkrKykge1xuICAgICAgICAgIGNvbG9yICs9IGxldHRlcnNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTYpXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY29sb3I7XG4gICAgICB9O1xuXG4gICAgLy9ydWxlc1xuICAgIGNvbnN0IHJ1bGVzRm9sZGVyID0gZ3VpLmFkZEZvbGRlcihcInJ1bGVzXCIpO1xuICAgIHJ1bGVzRm9sZGVyLmFkZCh0aGlzLm1vZGVsLCBcImJpcnRoXCIpO1xuICAgIHJ1bGVzRm9sZGVyLmFkZCh0aGlzLm1vZGVsLCBcInN1cnZpdmFsXCIpO1xuXG4gICAgLy9jb2xvcnNcbiAgICBjb25zdCBjb2xvcnNGb2xkZXIgPSBndWkuYWRkRm9sZGVyKFwiY29sb3JzIGJ5IG5laWdoYm91cnNcIik7XG4gICAgdGhpcy5tZXRob2RzLnJlc2V0Q29sb3JzKCk7XG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPCB0aGlzLm1vZGVsLmNvbG9ycy5sZW5ndGg7IGkrKykge1xuICAgICAgY29sb3JzRm9sZGVyLmFkZENvbG9yKHRoaXMubW9kZWwuY29sb3JzLCBpKS5saXN0ZW4oKTtcbiAgICB9XG4gICAgY29sb3JzRm9sZGVyLmFkZCh0aGlzLm1ldGhvZHMsIFwicmFuZG9tXCIpO1xuICAgIGNvbG9yc0ZvbGRlci5hZGQodGhpcy5tZXRob2RzLCBcImJsYWNrV2hpdGVcIikubmFtZShcImJsYWNrICYgd2hpdGVcIik7XG5cbiAgICAvL3NoYXJlXG4gICAgLy8gY29uc3Qgc2hhcmVGb2xkZXIgPSBndWkuYWRkRm9sZGVyKFwic2hhcmVcIik7XG4gICAgLy8gc2hhcmVGb2xkZXIuYWRkKHRoaXMubWV0aG9kcywgXCJ0d2VldFwiKTtcbiAgICAvLyBzaGFyZUZvbGRlci5hZGQodGhpcy5tZXRob2RzLCBcImNvcHlMaW5rXCIpLm5hbWUoXCJjb3B5IGxpbmtcIik7XG5cbiAgICBndWlcbiAgICAgIC5hZGQodGhpcy5tb2RlbCwgXCJyYW5kb21TdGFydFwiKVxuICAgICAgLm5hbWUoXCJyYW5kb20gc3RhcnRcIilcbiAgICAgIC5saXN0ZW4oKTtcbiAgICBndWkuYWRkKHRoaXMubWV0aG9kcywgXCJyZXNldFwiKS5uYW1lKFwic2V0ICYgZ29cIik7XG4gICAgZ3VpLmFkZCh0aGlzLm1ldGhvZHMsIFwiYWJvdXRcIik7XG5cbiAgICBndWkuY2xvc2VkID0gdHJ1ZTtcbiAgICBkb2N1bWVudC5vbmtleWRvd24gPSBldiA9PiB7XG4gICAgICBpZiAoZXYua2V5Q29kZSA9PSAzMikge1xuICAgICAgICAvL3NwYWNlXG4gICAgICAgIHRoaXMubWV0aG9kcy5yZXNldCgpO1xuICAgICAgfSBlbHNlIGlmIChldi5rZXlDb2RlID09IDgyKSB7XG4gICAgICAgIC8vclxuICAgICAgICB0aGlzLm1vZGVsLnJhbmRvbVN0YXJ0ID0gIXRoaXMubW9kZWwucmFuZG9tU3RhcnQ7XG4gICAgICB9IGVsc2UgaWYgKGV2LmtleUNvZGUgPT0gNjcpIHtcbiAgICAgICAgLy9jXG4gICAgICAgIHRoaXMubWV0aG9kcy5yYW5kb20oKTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9PcHRpb25zLmpzXG4vLyBtb2R1bGUgaWQgPSA1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlbmRlcmVyIHtcbiAgY29uc3RydWN0b3IoY29scywgcm93cywgY2VsbFdpZHRoLCBjZWxsSGVpZ2h0KSB7XG4gICAgY29uc3QgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKSxcbiAgICAgIGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoY2FudmFzKTtcbiAgICBjYW52YXMud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICBjYW52YXMuaGVpZ2h0ID0gZG9jdW1lbnQuYm9keS5vZmZzZXRIZWlnaHQ7XG4gICAgY29uc3QgaW1hZ2UgPSBjb250ZXh0LmNyZWF0ZUltYWdlRGF0YShjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpLFxuICAgICAgaW1hZ2VEYXRhID0gbmV3IEludDMyQXJyYXkoaW1hZ2UuZGF0YS5idWZmZXIpLFxuICAgICAgcmVzZXREYXRhID0gKCkgPT4ge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNhbnZhcy53aWR0aCAqIGNhbnZhcy5oZWlnaHQ7IGkrKykge1xuICAgICAgICAgIGltYWdlRGF0YVtpXSA9IDB4ZmYgPDwgMjQ7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICBsZXQgbW91c2VEb3duID0gZmFsc2U7XG5cbiAgICBjb25zdCBvbkRyYXcgPSBldmVudCA9PiB7XG4gICAgICBpZiAoIW1vdXNlRG93bikgcmV0dXJuO1xuXG4gICAgICBjb25zdCByZWN0ID0gY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgY29uc3QgbW91c2VQb3MgPSB7XG4gICAgICAgIHg6IGV2ZW50LmNsaWVudFggKiBjYW52YXMud2lkdGggLyBjYW52YXMuY2xpZW50V2lkdGgsXG4gICAgICAgIHk6IGV2ZW50LmNsaWVudFkgKiBjYW52YXMuaGVpZ2h0IC8gY2FudmFzLmNsaWVudEhlaWdodFxuICAgICAgfTtcbiAgICAgIGNvbnN0IHBvcyA9IHtcbiAgICAgICAgaTogfn4obW91c2VQb3MueSAvIGNlbGxIZWlnaHQpLFxuICAgICAgICBqOiB+fihtb3VzZVBvcy54IC8gY2VsbFdpZHRoKVxuICAgICAgfTtcblxuICAgICAgdGhpcy5vbkRyYXcocG9zLmksIHBvcy5qKTtcbiAgICB9O1xuXG4gICAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgZXZ0ID0+IHtcbiAgICAgIG1vdXNlRG93biA9IHRydWU7XG4gICAgICBvbkRyYXcoZXZ0KTtcbiAgICB9KTtcblxuICAgIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIG9uRHJhdyk7XG4gICAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIGV2dCA9PiAobW91c2VEb3duID0gZmFsc2UpKTtcblxuICAgIGNvbnN0IGxpdmVDb2xvciA9IDB4ZmYgfCAoMHhmZiA8PCA4KSB8ICgweGZmIDw8IDE2KSB8ICgweGZmIDw8IDI0KSxcbiAgICAgIGRlYWRDb2xvciA9IDB4MDAgfCAoMHgwMCA8PCA4KSB8ICgweDAwIDw8IDE2KSB8ICgweGZmIDw8IDI0KTtcblxuICAgIGNvbnN0IGhleFRvUmdiID0gaGV4ID0+IHtcbiAgICAgIGNvbnN0IHJlc3VsdCA9XG4gICAgICAgIC9eIz8oW2EtZlxcZF17Mn0pKFthLWZcXGRdezJ9KShbYS1mXFxkXXsyfSkkL2kuZXhlYyhoZXgpIHx8IFwiIzAwMDAwMFwiO1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgcGFyc2VJbnQocmVzdWx0WzFdLCAxNikgfFxuICAgICAgICAocGFyc2VJbnQocmVzdWx0WzJdLCAxNikgPDwgOCkgfFxuICAgICAgICAocGFyc2VJbnQocmVzdWx0WzNdLCAxNikgPDwgMTYpIHxcbiAgICAgICAgKDB4ZmYgPDwgMjQpXG4gICAgICApO1xuICAgIH07XG4gICAgY29uc3QgZmlsbFNxdWFyZSA9ICh4LCB5LCBjb2xvcikgPT4ge1xuICAgICAgdmFyIHdpZHRoID0gY2VsbFdpZHRoLFxuICAgICAgICBoZWlnaHQgPSBjZWxsSGVpZ2h0O1xuXG4gICAgICBpZiAoeCAqIGNlbGxXaWR0aCArIHdpZHRoID4gY2FudmFzLndpZHRoKSB7XG4gICAgICAgIHdpZHRoID0gY2FudmFzLndpZHRoIC0geCAqIGNlbGxXaWR0aDtcbiAgICAgIH1cblxuICAgICAgaWYgKHkgKiBjZWxsSGVpZ2h0ICsgaGVpZ2h0ID4gY2FudmFzLmhlaWdodCkge1xuICAgICAgICBoZWlnaHQgPSBjYW52YXMuaGVpZ2h0IC0geSAqIGNlbGxIZWlnaHQ7XG4gICAgICB9XG5cbiAgICAgIGlmICh3aWR0aCA8PSAwIHx8IGhlaWdodCA8PSAwKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdmFyIHBvaW50ZXIgPSB4ICogY2VsbFdpZHRoICsgeSAqIGNhbnZhcy53aWR0aCAqIGNlbGxIZWlnaHQsXG4gICAgICAgIHJvd1dpZHRoID0gY2FudmFzLndpZHRoIC0gd2lkdGg7XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaGVpZ2h0OyBpKyspIHtcbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCB3aWR0aDsgaisrKSB7XG4gICAgICAgICAgaW1hZ2VEYXRhW3BvaW50ZXJdID0gY29sb3I7XG5cbiAgICAgICAgICBwb2ludGVyKys7XG4gICAgICAgIH1cbiAgICAgICAgcG9pbnRlciArPSByb3dXaWR0aDtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdGhpcy5yZW5kZXIgPSAod29ybGQsIGRpZmYpID0+IHtcbiAgICAgIGZvciAobGV0IGluZGV4IG9mIGRpZmYpIHtcbiAgICAgICAgZmlsbFNxdWFyZShcbiAgICAgICAgICBpbmRleCAlIGNvbHMsXG4gICAgICAgICAgTWF0aC5mbG9vcihpbmRleCAvIGNvbHMpLFxuICAgICAgICAgIHdvcmxkLmNlbGxzW2luZGV4XSA9PT0gMVxuICAgICAgICAgICAgPyB0aGlzLmNvbG9yc1t3b3JsZC5uZWlnaGJvdXJzKGluZGV4KV1cbiAgICAgICAgICAgIDogLy8gPyBsaXZlQ29sb3JcbiAgICAgICAgICAgICAgZGVhZENvbG9yXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICBjb250ZXh0LnB1dEltYWdlRGF0YShpbWFnZSwgMCwgMCk7XG4gICAgfTtcblxuICAgIHRoaXMucmVzZXQgPSBtb2RlbCA9PiB7XG4gICAgICByZXNldERhdGEoKTtcbiAgICAgIHRoaXMuY29sb3JzID0gbW9kZWwuY29sb3JzLm1hcChoZXhUb1JnYik7XG4gICAgICBjb250ZXh0LnB1dEltYWdlRGF0YShpbWFnZSwgMCwgMCk7XG4gICAgfTtcbiAgfVxufVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvQ2FudmFzUmVuZGVyZXIuanNcbi8vIG1vZHVsZSBpZCA9IDhcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==