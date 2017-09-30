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
/* 3 */
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



/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNzUxNGI3Y2UzNDY1NTgxZWQzNGYiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FwcC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvRW5naW5lLmpzIiwid2VicGFjazovLy8uL3NyYy9Xb3JsZC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvQ2FudmFzUmVuZGVyZXIuanMiLCJ3ZWJwYWNrOi8vLy4vbGliL3N0YXRzLm1pbi5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvT3B0aW9ucy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7O0FDN0RBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7QUNqQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIsV0FBVztB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QjtBQUNyRDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixPQUFPO0FBQzlCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQiw4QkFBOEI7QUFDakQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDc1MTRiN2NlMzQ2NTU4MWVkMzRmIiwiaW1wb3J0IEVuZ2luZSBmcm9tIFwiLi9FbmdpbmVcIjtcclxuaW1wb3J0IFJlbmRlcmVyIGZyb20gXCIuL0NhbnZhc1JlbmRlcmVyXCI7XHJcbmltcG9ydCBTdGF0cyBmcm9tIFwiLi4vbGliL3N0YXRzLm1pblwiO1xyXG5pbXBvcnQgT3B0aW9ucyBmcm9tIFwiLi9PcHRpb25zXCI7XHJcblxyXG5jb25zdCBzdGF0cyA9IG5ldyBTdGF0cygpO1xyXG5zdGF0cy5zaG93UGFuZWwoMSk7XHJcbi8vIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoc3RhdHMuZG9tKTtcclxuXHJcbmNvbnN0IHBpeGVsc1BlckNlbGwgPSA0LFxyXG4gIGNvbHMgPSBNYXRoLmNlaWwod2luZG93LmlubmVyV2lkdGggLyBwaXhlbHNQZXJDZWxsKSxcclxuICByb3dzID0gTWF0aC5jZWlsKHdpbmRvdy5pbm5lckhlaWdodCAvIHBpeGVsc1BlckNlbGwpLFxyXG4gIHJlbmRlcmVyID0gbmV3IFJlbmRlcmVyKGNvbHMsIHJvd3MsIHBpeGVsc1BlckNlbGwsIHBpeGVsc1BlckNlbGwpLFxyXG4gIGVuZ2luZSA9IG5ldyBFbmdpbmUoXHJcbiAgICBjb2xzLCAvL251bWJlciBvZiBjb2x1bW5zXHJcbiAgICByb3dzLCAvL251bWJlciBvZiByb3dzXHJcbiAgICByZW5kZXJlci5yZW5kZXIsIC8vb25UaWNrXHJcbiAgICA2MCwgLy9kZXNpcmVkIGZwc1xyXG4gICAgc3RhdHNcclxuICApO1xyXG5yZW5kZXJlci5vbkRyYXcgPSBlbmdpbmUub25EcmF3O1xyXG53aW5kb3cub25sb2FkID0gKCkgPT4ge1xyXG4gIGNvbnN0IGd1aSA9IG5ldyBkYXQuR1VJKCk7XHJcbiAgY29uc3Qgb3B0aW9ucyA9IG5ldyBPcHRpb25zKFxyXG4gICAgZ3VpLFxyXG4gICAgbW9kZWwgPT4ge1xyXG4gICAgICByZW5kZXJlci5yZXNldChtb2RlbCk7XHJcbiAgICAgIGVuZ2luZS5zdGFydChtb2RlbCk7XHJcbiAgICB9LFxyXG4gICAgZW5naW5lLnBhdXNlLFxyXG4gICAgZW5naW5lLnBsYXlcclxuICApO1xyXG4gIG9wdGlvbnMubWV0aG9kcy5yZXNldCgpO1xyXG59O1xyXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9hcHAuanNcbi8vIG1vZHVsZSBpZCA9IDBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IFdvcmxkIGZyb20gXCIuL1dvcmxkXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFbmdpbmUge1xyXG4gIGNvbnN0cnVjdG9yKGNvbHMsIHJvd3MsIG9uVGljaywgZGVzaXJlZEZwcywgc3RhdHMpIHtcclxuICAgIGxldCBlbmdpbmVUaW1lID0gMCxcclxuICAgICAgY3VycmVudCxcclxuICAgICAgbmV4dCxcclxuICAgICAgYmlydGggPSBcIlwiLFxyXG4gICAgICBzdXJ2aXZhbCA9IFwiXCIsXHJcbiAgICAgIHJhbmRvbVN0YXJ0ID0gZmFsc2UsXHJcbiAgICAgIGJpcnRoTWFwID0gbmV3IEFycmF5KDgpLFxyXG4gICAgICBzdXJ2aXZhbE1hcCA9IG5ldyBBcnJheSg4KSxcclxuICAgICAgbXNUaWxsTmV4dEZyYW1lID0gMCxcclxuICAgICAgbGFzdFRpY2tUaW1lID0gMCxcclxuICAgICAgdG90YWwgPSByb3dzICogY29scyxcclxuICAgICAgaXNSdW5uaW5nID0gZmFsc2U7XHJcblxyXG4gICAgY29uc3QgbXNQZXJGcmFtZSA9IDEwMDAgLyBkZXNpcmVkRnBzO1xyXG5cclxuICAgIGNvbnN0IGNvbXB1dGVOZXh0U3RhdGUgPSAoKSA9PiB7XHJcbiAgICAgIGxldCBuZXh0U3RhdGUgPSAwO1xyXG4gICAgICBjb25zdCBkaWZmID0gbmV3IFNldCgpO1xyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRvdGFsOyBpKyspIHtcclxuICAgICAgICBsZXQgbmVpZ2hib3JzID0gY3VycmVudC5uZWlnaGJvdXJzKGkpLFxyXG4gICAgICAgICAgY3VycmVudFN0YXRlID0gY3VycmVudC5nZXQoaSk7XHJcblxyXG4gICAgICAgIG5leHRTdGF0ZSA9XHJcbiAgICAgICAgICBjdXJyZW50U3RhdGUgPT09IDEgPyBzdXJ2aXZhbE1hcFtuZWlnaGJvcnNdIDogYmlydGhNYXBbbmVpZ2hib3JzXTtcclxuICAgICAgICBuZXh0LnNldChpLCBuZXh0U3RhdGUpO1xyXG5cclxuICAgICAgICBpZiAoY3VycmVudFN0YXRlICE9PSBuZXh0U3RhdGUpIHtcclxuICAgICAgICAgIGRpZmYuYWRkKGkpO1xyXG4gICAgICAgICAgY29uc3QgbmVpZ2hib3Vyc0luZGljZXMgPSBjdXJyZW50Lm5laWdoYm91cnNJbmRpY2VzW2ldO1xyXG4gICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBuZWlnaGJvdXJzSW5kaWNlcy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICBkaWZmLmFkZChuZWlnaGJvdXJzSW5kaWNlc1tqXSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGNvbnN0IHRlbXAgPSBjdXJyZW50O1xyXG4gICAgICBjdXJyZW50ID0gbmV4dDtcclxuICAgICAgbmV4dCA9IHRlbXA7XHJcbiAgICAgIHJldHVybiBkaWZmO1xyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdCB0aWNrID0gKCkgPT4ge1xyXG4gICAgICBjb25zdCBzdGFydFRpbWUgPSBwZXJmb3JtYW5jZS5ub3coKSxcclxuICAgICAgICBtc0VsYXBzZWQgPSBzdGFydFRpbWUgLSBsYXN0VGlja1RpbWU7XHJcbiAgICAgIG1zVGlsbE5leHRGcmFtZSAtPSBtc0VsYXBzZWQ7XHJcbiAgICAgIGlmIChtc1RpbGxOZXh0RnJhbWUgPD0gMCkge1xyXG4gICAgICAgIHN0YXRzLmJlZ2luKCk7XHJcbiAgICAgICAgY29uc3QgZGlmZiA9IGNvbXB1dGVOZXh0U3RhdGUoKTtcclxuICAgICAgICBvblRpY2soY3VycmVudCwgZGlmZik7XHJcbiAgICAgICAgc3RhdHMuZW5kKCk7XHJcbiAgICAgICAgbGFzdFRpY2tUaW1lID0gcGVyZm9ybWFuY2Uubm93KCk7XHJcbiAgICAgICAgY29uc3QgdGltZUZvckZyYW1lID0gbGFzdFRpY2tUaW1lIC0gc3RhcnRUaW1lO1xyXG4gICAgICAgIG1zVGlsbE5leHRGcmFtZSA9IG1zUGVyRnJhbWUgLSB0aW1lRm9yRnJhbWU7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbGFzdFRpY2tUaW1lID0gcGVyZm9ybWFuY2Uubm93KCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChpc1J1bm5pbmcpIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGljayk7XHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IHNldE1vZGVsID0gbW9kZWwgPT4ge1xyXG4gICAgICBiaXJ0aCA9IG1vZGVsLmJpcnRoIHx8IFwiM1wiO1xyXG4gICAgICBzdXJ2aXZhbCA9IG1vZGVsLnN1cnZpdmFsIHx8IFwiMjNcIjtcclxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA4OyBpKyspIHtcclxuICAgICAgICBiaXJ0aE1hcFtpXSA9IGJpcnRoLmluZGV4T2YoaSkgPj0gMCA/IDEgOiAwO1xyXG4gICAgICAgIHN1cnZpdmFsTWFwW2ldID0gc3Vydml2YWwuaW5kZXhPZihpKSA+PSAwID8gMSA6IDA7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJhbmRvbVN0YXJ0ID0gbW9kZWwucmFuZG9tU3RhcnQ7XHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMuc3RhcnQgPSBtb2RlbCA9PiB7XHJcbiAgICAgIHNldE1vZGVsKG1vZGVsKTtcclxuICAgICAgY3VycmVudCA9IG5ldyBXb3JsZChyb3dzLCBjb2xzLCByYW5kb21TdGFydCk7XHJcbiAgICAgIG5leHQgPSBuZXcgV29ybGQocm93cywgY29scyk7XHJcbiAgICAgIGlzUnVubmluZyA9IHRydWU7XHJcbiAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGljayk7XHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMucGF1c2UgPSAoKSA9PiB7XHJcbiAgICAgIGlzUnVubmluZyA9IGZhbHNlO1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLnBsYXkgPSAoKSA9PiB7XHJcbiAgICAgIGlzUnVubmluZyA9IHRydWU7XHJcbiAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGljayk7XHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMub25EcmF3ID0gKGksIGopID0+IHtcclxuICAgICAgY3VycmVudC5jcm9zcyhpLCBqKTtcclxuICAgIH07XHJcbiAgfVxyXG59XHJcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL0VuZ2luZS5qc1xuLy8gbW9kdWxlIGlkID0gMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBXb3JsZCB7XHJcbiAgY29uc3RydWN0b3Iocm93cywgY29scywgcmFuZG9tU3RhcnQpIHtcclxuICAgIHRoaXMuY2VsbHMgPSBuZXcgVWludDhBcnJheShuZXcgQXJyYXlCdWZmZXIocm93cyAqIGNvbHMpKTtcclxuICAgIGNvbnN0IGluZGV4ID0gKGksIGopID0+IGkgKiBjb2xzICsgajtcclxuICAgIHRoaXMubmVpZ2hib3Vyc0luZGljZXMgPSBuZXcgQXJyYXkoY29scyAqIHJvd3MpO1xyXG4gICAgdGhpcy5nZXQgPSBpID0+XHJcbiAgICAgIGkgPj0gMCAmJiBpIDwgdGhpcy5jZWxscy5sZW5ndGggPyB0aGlzLmNlbGxzW2ldIDogdW5kZWZpbmVkO1xyXG5cclxuICAgIHRoaXMuc2V0ID0gKGksIHZhbCkgPT4gKHRoaXMuY2VsbHNbaV0gPSB2YWwpO1xyXG5cclxuICAgIHRoaXMuY3Jvc3MgPSAoaSwgaikgPT4ge1xyXG4gICAgICBpZiAoaSAtIDEgPiAwKSB0aGlzLmNlbGxzW2luZGV4KGkgLSAxLCBqKV0gPSAxO1xyXG4gICAgICBpZiAoaiAtIDEgPiAwKSB0aGlzLmNlbGxzW2luZGV4KGksIGogLSAxKV0gPSAxO1xyXG4gICAgICB0aGlzLmNlbGxzW2luZGV4KGksIGopXSA9IDE7XHJcbiAgICAgIGlmIChqICsgMSA+IGNvbHMpIHRoaXMuY2VsbHNbaW5kZXgoaSwgaiArIDEpXSA9IDE7XHJcbiAgICAgIGlmIChpICsgMSA8IHJvd3MpIHRoaXMuY2VsbHNbaW5kZXgoaSArIDEsIGopXSA9IDE7XHJcbiAgICB9O1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcm93czsgaSsrKSB7XHJcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgY29sczsgaisrKSB7XHJcbiAgICAgICAgdGhpcy5uZWlnaGJvdXJzSW5kaWNlc1tpbmRleChpLCBqKV0gPSBbXTtcclxuICAgICAgICBpZiAoaSAtIDEgPj0gMCAmJiBqIC0gMSA+PSAwKVxyXG4gICAgICAgICAgdGhpcy5uZWlnaGJvdXJzSW5kaWNlc1tpbmRleChpLCBqKV0ucHVzaChpbmRleChpIC0gMSwgaiAtIDEpKTtcclxuICAgICAgICBpZiAoaSAtIDEgPj0gMClcclxuICAgICAgICAgIHRoaXMubmVpZ2hib3Vyc0luZGljZXNbaW5kZXgoaSwgaildLnB1c2goaW5kZXgoaSAtIDEsIGopKTtcclxuICAgICAgICBpZiAoaSAtIDEgPj0gMCAmJiBqICsgMSA8IGNvbHMpXHJcbiAgICAgICAgICB0aGlzLm5laWdoYm91cnNJbmRpY2VzW2luZGV4KGksIGopXS5wdXNoKGluZGV4KGkgLSAxLCBqICsgMSkpO1xyXG5cclxuICAgICAgICBpZiAoaiAtIDEgPj0gMClcclxuICAgICAgICAgIHRoaXMubmVpZ2hib3Vyc0luZGljZXNbaW5kZXgoaSwgaildLnB1c2goaW5kZXgoaSwgaiAtIDEpKTtcclxuICAgICAgICBpZiAoaiArIDEgPCBjb2xzKVxyXG4gICAgICAgICAgdGhpcy5uZWlnaGJvdXJzSW5kaWNlc1tpbmRleChpLCBqKV0ucHVzaChpbmRleChpLCBqICsgMSkpO1xyXG5cclxuICAgICAgICBpZiAoaSArIDEgPCByb3dzICYmIGogLSAxID49IDApXHJcbiAgICAgICAgICB0aGlzLm5laWdoYm91cnNJbmRpY2VzW2luZGV4KGksIGopXS5wdXNoKGluZGV4KGkgKyAxLCBqIC0gMSkpO1xyXG4gICAgICAgIGlmIChpICsgMSA8IHJvd3MpXHJcbiAgICAgICAgICB0aGlzLm5laWdoYm91cnNJbmRpY2VzW2luZGV4KGksIGopXS5wdXNoKGluZGV4KGkgKyAxLCBqKSk7XHJcbiAgICAgICAgaWYgKGkgKyAxIDwgcm93cyAmJiBqICsgMSA8IGNvbHMpXHJcbiAgICAgICAgICB0aGlzLm5laWdoYm91cnNJbmRpY2VzW2luZGV4KGksIGopXS5wdXNoKGluZGV4KGkgKyAxLCBqICsgMSkpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBjb25zdCBjb3VudCA9IChhLCBiKSA9PiBhICsgdGhpcy5jZWxsc1tiXTtcclxuICAgIHRoaXMubmVpZ2hib3VycyA9IGkgPT4gdGhpcy5uZWlnaGJvdXJzSW5kaWNlc1tpXS5yZWR1Y2UoY291bnQsIDApO1xyXG5cclxuICAgIGlmIChyYW5kb21TdGFydClcclxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNlbGxzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgIHRoaXMuY2VsbHNbaV0gPSBNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkpO1xyXG4gIH1cclxufVxyXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9Xb3JsZC5qc1xuLy8gbW9kdWxlIGlkID0gMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBSZW5kZXJlciB7XHJcbiAgY29uc3RydWN0b3IoY29scywgcm93cywgY2VsbFdpZHRoLCBjZWxsSGVpZ2h0KSB7XHJcbiAgICBjb25zdCBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpLFxyXG4gICAgICBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcclxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoY2FudmFzKTtcclxuICAgIGNhbnZhcy53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xyXG4gICAgY2FudmFzLmhlaWdodCA9IGRvY3VtZW50LmJvZHkub2Zmc2V0SGVpZ2h0O1xyXG4gICAgY29uc3QgaW1hZ2UgPSBjb250ZXh0LmNyZWF0ZUltYWdlRGF0YShjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpLFxyXG4gICAgICBpbWFnZURhdGEgPSBuZXcgSW50MzJBcnJheShpbWFnZS5kYXRhLmJ1ZmZlciksXHJcbiAgICAgIHJlc2V0RGF0YSA9ICgpID0+IHtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNhbnZhcy53aWR0aCAqIGNhbnZhcy5oZWlnaHQ7IGkrKykge1xyXG4gICAgICAgICAgaW1hZ2VEYXRhW2ldID0gMHhmZiA8PCAyNDtcclxuICAgICAgICB9XHJcbiAgICAgIH07XHJcblxyXG4gICAgbGV0IG1vdXNlRG93biA9IGZhbHNlO1xyXG5cclxuICAgIGNvbnN0IG9uRHJhdyA9IGV2ZW50ID0+IHtcclxuICAgICAgaWYgKCFtb3VzZURvd24pIHJldHVybjtcclxuXHJcbiAgICAgIGNvbnN0IHJlY3QgPSBjYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICAgIGNvbnN0IG1vdXNlUG9zID0ge1xyXG4gICAgICAgIHg6IGV2ZW50LmNsaWVudFggKiBjYW52YXMud2lkdGggLyBjYW52YXMuY2xpZW50V2lkdGgsXHJcbiAgICAgICAgeTogZXZlbnQuY2xpZW50WSAqIGNhbnZhcy5oZWlnaHQgLyBjYW52YXMuY2xpZW50SGVpZ2h0XHJcbiAgICAgIH07XHJcbiAgICAgIGNvbnN0IHBvcyA9IHtcclxuICAgICAgICBpOiB+fihtb3VzZVBvcy55IC8gY2VsbEhlaWdodCksXHJcbiAgICAgICAgajogfn4obW91c2VQb3MueCAvIGNlbGxXaWR0aClcclxuICAgICAgfTtcclxuXHJcbiAgICAgIHRoaXMub25EcmF3KHBvcy5pLCBwb3Muaik7XHJcbiAgICB9O1xyXG5cclxuICAgIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIGV2dCA9PiB7XHJcbiAgICAgIG1vdXNlRG93biA9IHRydWU7XHJcbiAgICAgIG9uRHJhdyhldnQpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgb25EcmF3KTtcclxuICAgIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCBldnQgPT4gKG1vdXNlRG93biA9IGZhbHNlKSk7XHJcblxyXG4gICAgY29uc3QgbGl2ZUNvbG9yID0gMHhmZiB8ICgweGZmIDw8IDgpIHwgKDB4ZmYgPDwgMTYpIHwgKDB4ZmYgPDwgMjQpLFxyXG4gICAgICBkZWFkQ29sb3IgPSAweDAwIHwgKDB4MDAgPDwgOCkgfCAoMHgwMCA8PCAxNikgfCAoMHhmZiA8PCAyNCk7XHJcblxyXG4gICAgY29uc3QgaGV4VG9SZ2IgPSBoZXggPT4ge1xyXG4gICAgICBjb25zdCByZXN1bHQgPVxyXG4gICAgICAgIC9eIz8oW2EtZlxcZF17Mn0pKFthLWZcXGRdezJ9KShbYS1mXFxkXXsyfSkkL2kuZXhlYyhoZXgpIHx8IFwiIzAwMDAwMFwiO1xyXG4gICAgICByZXR1cm4gKFxyXG4gICAgICAgIHBhcnNlSW50KHJlc3VsdFsxXSwgMTYpIHxcclxuICAgICAgICAocGFyc2VJbnQocmVzdWx0WzJdLCAxNikgPDwgOCkgfFxyXG4gICAgICAgIChwYXJzZUludChyZXN1bHRbM10sIDE2KSA8PCAxNikgfFxyXG4gICAgICAgICgweGZmIDw8IDI0KVxyXG4gICAgICApO1xyXG4gICAgfTtcclxuICAgIGNvbnN0IGZpbGxTcXVhcmUgPSAoeCwgeSwgY29sb3IpID0+IHtcclxuICAgICAgdmFyIHdpZHRoID0gY2VsbFdpZHRoLFxyXG4gICAgICAgIGhlaWdodCA9IGNlbGxIZWlnaHQ7XHJcblxyXG4gICAgICBpZiAoeCAqIGNlbGxXaWR0aCArIHdpZHRoID4gY2FudmFzLndpZHRoKSB7XHJcbiAgICAgICAgd2lkdGggPSBjYW52YXMud2lkdGggLSB4ICogY2VsbFdpZHRoO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoeSAqIGNlbGxIZWlnaHQgKyBoZWlnaHQgPiBjYW52YXMuaGVpZ2h0KSB7XHJcbiAgICAgICAgaGVpZ2h0ID0gY2FudmFzLmhlaWdodCAtIHkgKiBjZWxsSGVpZ2h0O1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAod2lkdGggPD0gMCB8fCBoZWlnaHQgPD0gMCkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgdmFyIHBvaW50ZXIgPSB4ICogY2VsbFdpZHRoICsgeSAqIGNhbnZhcy53aWR0aCAqIGNlbGxIZWlnaHQsXHJcbiAgICAgICAgcm93V2lkdGggPSBjYW52YXMud2lkdGggLSB3aWR0aDtcclxuXHJcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaGVpZ2h0OyBpKyspIHtcclxuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHdpZHRoOyBqKyspIHtcclxuICAgICAgICAgIGltYWdlRGF0YVtwb2ludGVyXSA9IGNvbG9yO1xyXG5cclxuICAgICAgICAgIHBvaW50ZXIrKztcclxuICAgICAgICB9XHJcbiAgICAgICAgcG9pbnRlciArPSByb3dXaWR0aDtcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLnJlbmRlciA9ICh3b3JsZCwgZGlmZikgPT4ge1xyXG4gICAgICBmb3IgKGxldCBpbmRleCBvZiBkaWZmKSB7XHJcbiAgICAgICAgZmlsbFNxdWFyZShcclxuICAgICAgICAgIGluZGV4ICUgY29scyxcclxuICAgICAgICAgIE1hdGguZmxvb3IoaW5kZXggLyBjb2xzKSxcclxuICAgICAgICAgIHdvcmxkLmNlbGxzW2luZGV4XSA9PT0gMVxyXG4gICAgICAgICAgICA/IHRoaXMuY29sb3JzW3dvcmxkLm5laWdoYm91cnMoaW5kZXgpXVxyXG4gICAgICAgICAgICA6IC8vID8gbGl2ZUNvbG9yXHJcbiAgICAgICAgICAgICAgZGVhZENvbG9yXHJcbiAgICAgICAgKTtcclxuICAgICAgfVxyXG4gICAgICBjb250ZXh0LnB1dEltYWdlRGF0YShpbWFnZSwgMCwgMCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMucmVzZXQgPSBtb2RlbCA9PiB7XHJcbiAgICAgIHJlc2V0RGF0YSgpO1xyXG4gICAgICB0aGlzLmNvbG9ycyA9IG1vZGVsLmNvbG9ycy5tYXAoaGV4VG9SZ2IpO1xyXG4gICAgICBjb250ZXh0LnB1dEltYWdlRGF0YShpbWFnZSwgMCwgMCk7XHJcbiAgICB9O1xyXG4gIH1cclxufVxyXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9DYW52YXNSZW5kZXJlci5qc1xuLy8gbW9kdWxlIGlkID0gM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyBzdGF0cy5qcyAtIGh0dHA6Ly9naXRodWIuY29tL21yZG9vYi9zdGF0cy5qc1xyXG4oZnVuY3Rpb24oZixlKXtcIm9iamVjdFwiPT09dHlwZW9mIGV4cG9ydHMmJlwidW5kZWZpbmVkXCIhPT10eXBlb2YgbW9kdWxlP21vZHVsZS5leHBvcnRzPWUoKTpcImZ1bmN0aW9uXCI9PT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShlKTpmLlN0YXRzPWUoKX0pKHRoaXMsZnVuY3Rpb24oKXt2YXIgZj1mdW5jdGlvbigpe2Z1bmN0aW9uIGUoYSl7Yy5hcHBlbmRDaGlsZChhLmRvbSk7cmV0dXJuIGF9ZnVuY3Rpb24gdShhKXtmb3IodmFyIGQ9MDtkPGMuY2hpbGRyZW4ubGVuZ3RoO2QrKyljLmNoaWxkcmVuW2RdLnN0eWxlLmRpc3BsYXk9ZD09PWE/XCJibG9ja1wiOlwibm9uZVwiO2w9YX12YXIgbD0wLGM9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtjLnN0eWxlLmNzc1RleHQ9XCJwb3NpdGlvbjpmaXhlZDt0b3A6MDtsZWZ0OjA7Y3Vyc29yOnBvaW50ZXI7b3BhY2l0eTowLjk7ei1pbmRleDoxMDAwMFwiO2MuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsZnVuY3Rpb24oYSl7YS5wcmV2ZW50RGVmYXVsdCgpO1xyXG51KCsrbCVjLmNoaWxkcmVuLmxlbmd0aCl9LCExKTt2YXIgaz0ocGVyZm9ybWFuY2V8fERhdGUpLm5vdygpLGc9ayxhPTAscj1lKG5ldyBmLlBhbmVsKFwiRlBTXCIsXCIjMGZmXCIsXCIjMDAyXCIpKSxoPWUobmV3IGYuUGFuZWwoXCJNU1wiLFwiIzBmMFwiLFwiIzAyMFwiKSk7aWYoc2VsZi5wZXJmb3JtYW5jZSYmc2VsZi5wZXJmb3JtYW5jZS5tZW1vcnkpdmFyIHQ9ZShuZXcgZi5QYW5lbChcIk1CXCIsXCIjZjA4XCIsXCIjMjAxXCIpKTt1KDApO3JldHVybntSRVZJU0lPTjoxNixkb206YyxhZGRQYW5lbDplLHNob3dQYW5lbDp1LGJlZ2luOmZ1bmN0aW9uKCl7az0ocGVyZm9ybWFuY2V8fERhdGUpLm5vdygpfSxlbmQ6ZnVuY3Rpb24oKXthKys7dmFyIGM9KHBlcmZvcm1hbmNlfHxEYXRlKS5ub3coKTtoLnVwZGF0ZShjLWssMjAwKTtpZihjPmcrMUUzJiYoci51cGRhdGUoMUUzKmEvKGMtZyksMTAwKSxnPWMsYT0wLHQpKXt2YXIgZD1wZXJmb3JtYW5jZS5tZW1vcnk7dC51cGRhdGUoZC51c2VkSlNIZWFwU2l6ZS9cclxuMTA0ODU3NixkLmpzSGVhcFNpemVMaW1pdC8xMDQ4NTc2KX1yZXR1cm4gY30sdXBkYXRlOmZ1bmN0aW9uKCl7az10aGlzLmVuZCgpfSxkb21FbGVtZW50OmMsc2V0TW9kZTp1fX07Zi5QYW5lbD1mdW5jdGlvbihlLGYsbCl7dmFyIGM9SW5maW5pdHksaz0wLGc9TWF0aC5yb3VuZCxhPWcod2luZG93LmRldmljZVBpeGVsUmF0aW98fDEpLHI9ODAqYSxoPTQ4KmEsdD0zKmEsdj0yKmEsZD0zKmEsbT0xNSphLG49NzQqYSxwPTMwKmEscT1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO3Eud2lkdGg9cjtxLmhlaWdodD1oO3Euc3R5bGUuY3NzVGV4dD1cIndpZHRoOjgwcHg7aGVpZ2h0OjQ4cHhcIjt2YXIgYj1xLmdldENvbnRleHQoXCIyZFwiKTtiLmZvbnQ9XCJib2xkIFwiKzkqYStcInB4IEhlbHZldGljYSxBcmlhbCxzYW5zLXNlcmlmXCI7Yi50ZXh0QmFzZWxpbmU9XCJ0b3BcIjtiLmZpbGxTdHlsZT1sO2IuZmlsbFJlY3QoMCwwLHIsaCk7Yi5maWxsU3R5bGU9ZjtiLmZpbGxUZXh0KGUsdCx2KTtcclxuYi5maWxsUmVjdChkLG0sbixwKTtiLmZpbGxTdHlsZT1sO2IuZ2xvYmFsQWxwaGE9Ljk7Yi5maWxsUmVjdChkLG0sbixwKTtyZXR1cm57ZG9tOnEsdXBkYXRlOmZ1bmN0aW9uKGgsdyl7Yz1NYXRoLm1pbihjLGgpO2s9TWF0aC5tYXgoayxoKTtiLmZpbGxTdHlsZT1sO2IuZ2xvYmFsQWxwaGE9MTtiLmZpbGxSZWN0KDAsMCxyLG0pO2IuZmlsbFN0eWxlPWY7Yi5maWxsVGV4dChnKGgpK1wiIFwiK2UrXCIgKFwiK2coYykrXCItXCIrZyhrKStcIilcIix0LHYpO2IuZHJhd0ltYWdlKHEsZCthLG0sbi1hLHAsZCxtLG4tYSxwKTtiLmZpbGxSZWN0KGQrbi1hLG0sYSxwKTtiLmZpbGxTdHlsZT1sO2IuZ2xvYmFsQWxwaGE9Ljk7Yi5maWxsUmVjdChkK24tYSxtLGEsZygoMS1oL3cpKnApKX19fTtyZXR1cm4gZn0pO1xyXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2xpYi9zdGF0cy5taW4uanNcbi8vIG1vZHVsZSBpZCA9IDRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgT3B0aW9ucyB7XHJcbiAgY29uc3RydWN0b3IoZ3VpLCByZXNldCwgcGF1c2UsIHBsYXkpIHtcclxuICAgIHRoaXMubW9kZWwgPSB7XHJcbiAgICAgIGJpcnRoOiBcIjNcIixcclxuICAgICAgc3Vydml2YWw6IFwiMjNcIixcclxuICAgICAgcmFuZG9tU3RhcnQ6IHRydWUsXHJcbiAgICAgIGNvbG9yczogbmV3IEFycmF5KDkpXHJcbiAgICB9O1xyXG4gICAgdGhpcy5tZXRob2RzID0ge1xyXG4gICAgICByZXNldDogKCkgPT4gcmVzZXQodGhpcy5tb2RlbCksXHJcbiAgICAgIHBhdXNlLFxyXG4gICAgICBwbGF5LFxyXG4gICAgICByZXNldENvbG9yczogKCkgPT4ge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5tb2RlbC5jb2xvcnMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgICB0aGlzLm1vZGVsLmNvbG9yc1tpXSA9IFwiI0ZGRkZGRlwiO1xyXG4gICAgICB9LFxyXG4gICAgICByYW5kb206ICgpID0+IHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubW9kZWwuY29sb3JzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICB0aGlzLm1vZGVsLmNvbG9yc1tpXSA9IHJhbmRvbUNvbG9yKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICBibGFja1doaXRlOiAoKSA9PiB0aGlzLm1ldGhvZHMucmVzZXRDb2xvcnMoKSxcclxuICAgICAgdHdlZXQ6ICgpID0+XHJcbiAgICAgICAgd2luZG93Lm9wZW4oXHJcbiAgICAgICAgICBcImh0dHBzOi8vdHdpdHRlci5jb20vaW50ZW50L3R3ZWV0P3RleHQ9SGVsbG8lMjB3b3JsZFwiLFxyXG4gICAgICAgICAgXCJfYmxhbmtcIixcclxuICAgICAgICAgIFwibG9jYXRpb249eWVzXCJcclxuICAgICAgICApLFxyXG4gICAgICBjb3B5TGluazogKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHN0ciA9IGJ0b2EoSlNPTi5zdHJpbmdpZnkodGhpcy5tb2RlbCkpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHN0cik7XHJcbiAgICAgIH0sXHJcbiAgICAgIGFib3V0OiAoKSA9PlxyXG4gICAgICAgIHdpbmRvdy5vcGVuKFxyXG4gICAgICAgICAgXCJodHRwczovL2dpdGh1Yi5jb20vb2RlZHcvY2VsbHVsYXItYXV0b21hdGEtcGxheWdyb3VuZC9ibG9iL21hc3Rlci9SRUFETUUubWRcIixcclxuICAgICAgICAgIFwiX2JsYW5rXCJcclxuICAgICAgICApXHJcbiAgICB9O1xyXG4gICAgY29uc3QgbGV0dGVycyA9IFwiMDEyMzQ1Njc4OUFCQ0RFRlwiLFxyXG4gICAgICByYW5kb21Db2xvciA9ICgpID0+IHtcclxuICAgICAgICBsZXQgY29sb3IgPSBcIiNcIjtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDY7IGkrKykge1xyXG4gICAgICAgICAgY29sb3IgKz0gbGV0dGVyc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxNildO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gY29sb3I7XHJcbiAgICAgIH07XHJcblxyXG4gICAgLy9ydWxlc1xyXG4gICAgY29uc3QgcnVsZXNGb2xkZXIgPSBndWkuYWRkRm9sZGVyKFwicnVsZXNcIik7XHJcbiAgICBydWxlc0ZvbGRlci5hZGQodGhpcy5tb2RlbCwgXCJiaXJ0aFwiKTtcclxuICAgIHJ1bGVzRm9sZGVyLmFkZCh0aGlzLm1vZGVsLCBcInN1cnZpdmFsXCIpO1xyXG5cclxuICAgIC8vY29sb3JzXHJcbiAgICBjb25zdCBjb2xvcnNGb2xkZXIgPSBndWkuYWRkRm9sZGVyKFwiY29sb3JzIGJ5IG5laWdoYm91cnNcIik7XHJcbiAgICB0aGlzLm1ldGhvZHMucmVzZXRDb2xvcnMoKTtcclxuICAgIGZvciAobGV0IGkgPSAxOyBpIDwgdGhpcy5tb2RlbC5jb2xvcnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgY29sb3JzRm9sZGVyLmFkZENvbG9yKHRoaXMubW9kZWwuY29sb3JzLCBpKS5saXN0ZW4oKTtcclxuICAgIH1cclxuICAgIGNvbG9yc0ZvbGRlci5hZGQodGhpcy5tZXRob2RzLCBcInJhbmRvbVwiKTtcclxuICAgIGNvbG9yc0ZvbGRlci5hZGQodGhpcy5tZXRob2RzLCBcImJsYWNrV2hpdGVcIikubmFtZShcImJsYWNrICYgd2hpdGVcIik7XHJcblxyXG4gICAgLy9zaGFyZVxyXG4gICAgLy8gY29uc3Qgc2hhcmVGb2xkZXIgPSBndWkuYWRkRm9sZGVyKFwic2hhcmVcIik7XHJcbiAgICAvLyBzaGFyZUZvbGRlci5hZGQodGhpcy5tZXRob2RzLCBcInR3ZWV0XCIpO1xyXG4gICAgLy8gc2hhcmVGb2xkZXIuYWRkKHRoaXMubWV0aG9kcywgXCJjb3B5TGlua1wiKS5uYW1lKFwiY29weSBsaW5rXCIpO1xyXG5cclxuICAgIGd1aVxyXG4gICAgICAuYWRkKHRoaXMubW9kZWwsIFwicmFuZG9tU3RhcnRcIilcclxuICAgICAgLm5hbWUoXCJyYW5kb20gc3RhcnRcIilcclxuICAgICAgLmxpc3RlbigpO1xyXG4gICAgZ3VpLmFkZCh0aGlzLm1ldGhvZHMsIFwicmVzZXRcIikubmFtZShcInNldCAmIGdvXCIpO1xyXG4gICAgZ3VpLmFkZCh0aGlzLm1ldGhvZHMsIFwiYWJvdXRcIik7XHJcblxyXG4gICAgZ3VpLmNsb3NlZCA9IHRydWU7XHJcbiAgICBkb2N1bWVudC5vbmtleWRvd24gPSBldiA9PiB7XHJcbiAgICAgIGlmIChldi5rZXlDb2RlID09IDMyKSB7XHJcbiAgICAgICAgLy9zcGFjZVxyXG4gICAgICAgIHRoaXMubWV0aG9kcy5yZXNldCgpO1xyXG4gICAgICB9IGVsc2UgaWYgKGV2LmtleUNvZGUgPT0gODIpIHtcclxuICAgICAgICAvL3JcclxuICAgICAgICB0aGlzLm1vZGVsLnJhbmRvbVN0YXJ0ID0gIXRoaXMubW9kZWwucmFuZG9tU3RhcnQ7XHJcbiAgICAgIH0gZWxzZSBpZiAoZXYua2V5Q29kZSA9PSA2Nykge1xyXG4gICAgICAgIC8vY1xyXG4gICAgICAgIHRoaXMubWV0aG9kcy5yYW5kb20oKTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuICB9XHJcbn1cclxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvT3B0aW9ucy5qc1xuLy8gbW9kdWxlIGlkID0gNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9