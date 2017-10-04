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
    30, //desired fps
    stats
  );
renderer.onDraw = engine.onDraw;
window.addEventListener('load', () => {
  mixpanel.track('View');
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
});


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
      randomRules: () => {
        const chanceB = Math.random();
        do {
          this.model.birth = [1, 2, 3, 4, 5, 6, 7, 8]
            .filter(i => Math.random() > chanceB)
            .join()
            .replace(/,/g, "");
        } while (!this.model.birth);
        const chanceS = Math.random();
        do {
          this.model.survival = [1, 2, 3, 4, 5, 6, 7, 8]
            .filter(i => Math.random() > chanceS)
            .join()
            .replace(/,/g, "");
        } while (!this.model.survival);
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
      about: () => {
        mixpanel.track("About Click");
        window.open(
          "https://github.com/odedw/cellular-automata-playground/blob/master/README.md",
          "_blank"
        );
      },
      go: () => {
        mixpanel.track("Go Click", {
          Rules: `B${this.model.birth}/S${this.model.survival}`
        });
        reset(this.model);
      }
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
    rulesFolder.add(this.model, "birth").listen();
    rulesFolder.add(this.model, "survival").listen();
    rulesFolder.add(this.methods, "randomRules").name("random");

    //colors
    const colorsFolder = gui.addFolder("colors by neighbours");
    this.methods.resetColors();
    for (let i = 1; i < this.model.colors.length; i++) {
      colorsFolder.addColor(this.model.colors, i).listen();
    }
    colorsFolder.add(this.methods, "random");
    colorsFolder.add(this.methods, "blackWhite").name("black & white");

    gui
      .add(this.model, "randomStart")
      .name("random start")
      .listen();
    gui.add(this.methods, "go").name("set & go");
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
      } else if (ev.keyCode == 66) {
        //c
        this.methods.randomRules();
      }
    };
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Options;



/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZTliNjQ1ZTgyMmU5OGU1ZDAzNzkiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FwcC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvRW5naW5lLmpzIiwid2VicGFjazovLy8uL3NyYy9Xb3JsZC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvQ2FudmFzUmVuZGVyZXIuanMiLCJ3ZWJwYWNrOi8vLy4vbGliL3N0YXRzLm1pbi5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvT3B0aW9ucy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7O0FDN0RBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7Ozs7Ozs7O0FDbENEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EscUJB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QUF1Qiw4QkFBOEI7QUFDckQ7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EscUJBQXFCLGlCQUFpQixJQUFJLG9CQUFvQjtBQUM5RCxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLE9BQU87QUFDOUI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsOEJBQThCO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIGU5YjY0NWU4MjJlOThlNWQwMzc5IiwiaW1wb3J0IEVuZ2luZSBmcm9tICcuL0VuZ2luZSc7XHJcbmltcG9ydCBSZW5kZXJlciBmcm9tICcuL0NhbnZhc1JlbmRlcmVyJztcclxuaW1wb3J0IFN0YXRzIGZyb20gJy4uL2xpYi9zdGF0cy5taW4nO1xyXG5pbXBvcnQgT3B0aW9ucyBmcm9tICcuL09wdGlvbnMnO1xyXG5cclxuY29uc3Qgc3RhdHMgPSBuZXcgU3RhdHMoKTtcclxuc3RhdHMuc2hvd1BhbmVsKDEpO1xyXG4vLyBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHN0YXRzLmRvbSk7XHJcblxyXG5jb25zdCBwaXhlbHNQZXJDZWxsID0gNCxcclxuICBjb2xzID0gTWF0aC5jZWlsKHdpbmRvdy5pbm5lcldpZHRoIC8gcGl4ZWxzUGVyQ2VsbCksXHJcbiAgcm93cyA9IE1hdGguY2VpbCh3aW5kb3cuaW5uZXJIZWlnaHQgLyBwaXhlbHNQZXJDZWxsKSxcclxuICByZW5kZXJlciA9IG5ldyBSZW5kZXJlcihjb2xzLCByb3dzLCBwaXhlbHNQZXJDZWxsLCBwaXhlbHNQZXJDZWxsKSxcclxuICBlbmdpbmUgPSBuZXcgRW5naW5lKFxyXG4gICAgY29scywgLy9udW1iZXIgb2YgY29sdW1uc1xyXG4gICAgcm93cywgLy9udW1iZXIgb2Ygcm93c1xyXG4gICAgcmVuZGVyZXIucmVuZGVyLCAvL29uVGlja1xyXG4gICAgMzAsIC8vZGVzaXJlZCBmcHNcclxuICAgIHN0YXRzXHJcbiAgKTtcclxucmVuZGVyZXIub25EcmF3ID0gZW5naW5lLm9uRHJhdztcclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiB7XHJcbiAgbWl4cGFuZWwudHJhY2soJ1ZpZXcnKTtcclxuICBjb25zdCBndWkgPSBuZXcgZGF0LkdVSSgpO1xyXG4gIGNvbnN0IG9wdGlvbnMgPSBuZXcgT3B0aW9ucyhcclxuICAgIGd1aSxcclxuICAgIG1vZGVsID0+IHtcclxuICAgICAgcmVuZGVyZXIucmVzZXQobW9kZWwpO1xyXG4gICAgICBlbmdpbmUuc3RhcnQobW9kZWwpO1xyXG4gICAgfSxcclxuICAgIGVuZ2luZS5wYXVzZSxcclxuICAgIGVuZ2luZS5wbGF5XHJcbiAgKTtcclxuICBvcHRpb25zLm1ldGhvZHMucmVzZXQoKTtcclxufSk7XHJcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2FwcC5qc1xuLy8gbW9kdWxlIGlkID0gMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgV29ybGQgZnJvbSBcIi4vV29ybGRcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVuZ2luZSB7XHJcbiAgY29uc3RydWN0b3IoY29scywgcm93cywgb25UaWNrLCBkZXNpcmVkRnBzLCBzdGF0cykge1xyXG4gICAgbGV0IGVuZ2luZVRpbWUgPSAwLFxyXG4gICAgICBjdXJyZW50LFxyXG4gICAgICBuZXh0LFxyXG4gICAgICBiaXJ0aCA9IFwiXCIsXHJcbiAgICAgIHN1cnZpdmFsID0gXCJcIixcclxuICAgICAgcmFuZG9tU3RhcnQgPSBmYWxzZSxcclxuICAgICAgYmlydGhNYXAgPSBuZXcgQXJyYXkoOCksXHJcbiAgICAgIHN1cnZpdmFsTWFwID0gbmV3IEFycmF5KDgpLFxyXG4gICAgICBtc1RpbGxOZXh0RnJhbWUgPSAwLFxyXG4gICAgICBsYXN0VGlja1RpbWUgPSAwLFxyXG4gICAgICB0b3RhbCA9IHJvd3MgKiBjb2xzLFxyXG4gICAgICBpc1J1bm5pbmcgPSBmYWxzZTtcclxuXHJcbiAgICBjb25zdCBtc1BlckZyYW1lID0gMTAwMCAvIGRlc2lyZWRGcHM7XHJcblxyXG4gICAgY29uc3QgY29tcHV0ZU5leHRTdGF0ZSA9ICgpID0+IHtcclxuICAgICAgbGV0IG5leHRTdGF0ZSA9IDA7XHJcbiAgICAgIGNvbnN0IGRpZmYgPSBuZXcgU2V0KCk7XHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdG90YWw7IGkrKykge1xyXG4gICAgICAgIGxldCBuZWlnaGJvcnMgPSBjdXJyZW50Lm5laWdoYm91cnMoaSksXHJcbiAgICAgICAgICBjdXJyZW50U3RhdGUgPSBjdXJyZW50LmdldChpKTtcclxuXHJcbiAgICAgICAgbmV4dFN0YXRlID1cclxuICAgICAgICAgIGN1cnJlbnRTdGF0ZSA9PT0gMSA/IHN1cnZpdmFsTWFwW25laWdoYm9yc10gOiBiaXJ0aE1hcFtuZWlnaGJvcnNdO1xyXG4gICAgICAgIG5leHQuc2V0KGksIG5leHRTdGF0ZSk7XHJcblxyXG4gICAgICAgIGlmIChjdXJyZW50U3RhdGUgIT09IG5leHRTdGF0ZSkge1xyXG4gICAgICAgICAgZGlmZi5hZGQoaSk7XHJcbiAgICAgICAgICBjb25zdCBuZWlnaGJvdXJzSW5kaWNlcyA9IGN1cnJlbnQubmVpZ2hib3Vyc0luZGljZXNbaV07XHJcbiAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IG5laWdoYm91cnNJbmRpY2VzLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgIGRpZmYuYWRkKG5laWdoYm91cnNJbmRpY2VzW2pdKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgY29uc3QgdGVtcCA9IGN1cnJlbnQ7XHJcbiAgICAgIGN1cnJlbnQgPSBuZXh0O1xyXG4gICAgICBuZXh0ID0gdGVtcDtcclxuICAgICAgcmV0dXJuIGRpZmY7XHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IHRpY2sgPSAoKSA9PiB7XHJcbiAgICAgIGNvbnN0IHN0YXJ0VGltZSA9IHBlcmZvcm1hbmNlLm5vdygpLFxyXG4gICAgICAgIG1zRWxhcHNlZCA9IHN0YXJ0VGltZSAtIGxhc3RUaWNrVGltZTtcclxuICAgICAgbXNUaWxsTmV4dEZyYW1lIC09IG1zRWxhcHNlZDtcclxuICAgICAgaWYgKG1zVGlsbE5leHRGcmFtZSA8PSAwKSB7XHJcbiAgICAgICAgc3RhdHMuYmVnaW4oKTtcclxuICAgICAgICBjb25zdCBkaWZmID0gY29tcHV0ZU5leHRTdGF0ZSgpO1xyXG4gICAgICAgIG9uVGljayhjdXJyZW50LCBkaWZmKTtcclxuICAgICAgICBzdGF0cy5lbmQoKTtcclxuICAgICAgICBsYXN0VGlja1RpbWUgPSBwZXJmb3JtYW5jZS5ub3coKTtcclxuICAgICAgICBjb25zdCB0aW1lRm9yRnJhbWUgPSBsYXN0VGlja1RpbWUgLSBzdGFydFRpbWU7XHJcbiAgICAgICAgbXNUaWxsTmV4dEZyYW1lID0gbXNQZXJGcmFtZSAtIHRpbWVGb3JGcmFtZTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBsYXN0VGlja1RpbWUgPSBwZXJmb3JtYW5jZS5ub3coKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGlzUnVubmluZykgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aWNrKTtcclxuICAgIH07XHJcblxyXG4gICAgY29uc3Qgc2V0TW9kZWwgPSBtb2RlbCA9PiB7XHJcbiAgICAgIGJpcnRoID0gbW9kZWwuYmlydGggfHwgXCIzXCI7XHJcbiAgICAgIHN1cnZpdmFsID0gbW9kZWwuc3Vydml2YWwgfHwgXCIyM1wiO1xyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDg7IGkrKykge1xyXG4gICAgICAgIGJpcnRoTWFwW2ldID0gYmlydGguaW5kZXhPZihpKSA+PSAwID8gMSA6IDA7XHJcbiAgICAgICAgc3Vydml2YWxNYXBbaV0gPSBzdXJ2aXZhbC5pbmRleE9mKGkpID49IDAgPyAxIDogMDtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmFuZG9tU3RhcnQgPSBtb2RlbC5yYW5kb21TdGFydDtcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5zdGFydCA9IG1vZGVsID0+IHtcclxuICAgICAgc2V0TW9kZWwobW9kZWwpO1xyXG4gICAgICBjdXJyZW50ID0gbmV3IFdvcmxkKHJvd3MsIGNvbHMsIHJhbmRvbVN0YXJ0KTtcclxuICAgICAgbmV4dCA9IG5ldyBXb3JsZChyb3dzLCBjb2xzKTtcclxuICAgICAgaXNSdW5uaW5nID0gdHJ1ZTtcclxuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aWNrKTtcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5wYXVzZSA9ICgpID0+IHtcclxuICAgICAgaXNSdW5uaW5nID0gZmFsc2U7XHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMucGxheSA9ICgpID0+IHtcclxuICAgICAgaXNSdW5uaW5nID0gdHJ1ZTtcclxuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aWNrKTtcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5vbkRyYXcgPSAoaSwgaikgPT4ge1xyXG4gICAgICBjdXJyZW50LmNyb3NzKGksIGopO1xyXG4gICAgfTtcclxuICB9XHJcbn1cclxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvRW5naW5lLmpzXG4vLyBtb2R1bGUgaWQgPSAxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIFdvcmxkIHtcclxuICBjb25zdHJ1Y3Rvcihyb3dzLCBjb2xzLCByYW5kb21TdGFydCkge1xyXG4gICAgdGhpcy5jZWxscyA9IG5ldyBVaW50OEFycmF5KG5ldyBBcnJheUJ1ZmZlcihyb3dzICogY29scykpO1xyXG4gICAgY29uc3QgaW5kZXggPSAoaSwgaikgPT4gaSAqIGNvbHMgKyBqO1xyXG4gICAgdGhpcy5uZWlnaGJvdXJzSW5kaWNlcyA9IG5ldyBBcnJheShjb2xzICogcm93cyk7XHJcbiAgICB0aGlzLmdldCA9IGkgPT5cclxuICAgICAgaSA+PSAwICYmIGkgPCB0aGlzLmNlbGxzLmxlbmd0aCA/IHRoaXMuY2VsbHNbaV0gOiB1bmRlZmluZWQ7XHJcblxyXG4gICAgdGhpcy5zZXQgPSAoaSwgdmFsKSA9PiAodGhpcy5jZWxsc1tpXSA9IHZhbCk7XHJcblxyXG4gICAgdGhpcy5jcm9zcyA9IChpLCBqKSA9PiB7XHJcbiAgICAgIGlmIChpIC0gMSA+IDApIHRoaXMuY2VsbHNbaW5kZXgoaSAtIDEsIGopXSA9IDE7XHJcbiAgICAgIGlmIChqIC0gMSA+IDApIHRoaXMuY2VsbHNbaW5kZXgoaSwgaiAtIDEpXSA9IDE7XHJcbiAgICAgIHRoaXMuY2VsbHNbaW5kZXgoaSwgaildID0gMTtcclxuICAgICAgaWYgKGogKyAxID4gY29scykgdGhpcy5jZWxsc1tpbmRleChpLCBqICsgMSldID0gMTtcclxuICAgICAgaWYgKGkgKyAxIDwgcm93cykgdGhpcy5jZWxsc1tpbmRleChpICsgMSwgaildID0gMTtcclxuICAgIH07XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCByb3dzOyBpKyspIHtcclxuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBjb2xzOyBqKyspIHtcclxuICAgICAgICB0aGlzLm5laWdoYm91cnNJbmRpY2VzW2luZGV4KGksIGopXSA9IFtdO1xyXG4gICAgICAgIGlmIChpIC0gMSA+PSAwICYmIGogLSAxID49IDApXHJcbiAgICAgICAgICB0aGlzLm5laWdoYm91cnNJbmRpY2VzW2luZGV4KGksIGopXS5wdXNoKGluZGV4KGkgLSAxLCBqIC0gMSkpO1xyXG4gICAgICAgIGlmIChpIC0gMSA+PSAwKVxyXG4gICAgICAgICAgdGhpcy5uZWlnaGJvdXJzSW5kaWNlc1tpbmRleChpLCBqKV0ucHVzaChpbmRleChpIC0gMSwgaikpO1xyXG4gICAgICAgIGlmIChpIC0gMSA+PSAwICYmIGogKyAxIDwgY29scylcclxuICAgICAgICAgIHRoaXMubmVpZ2hib3Vyc0luZGljZXNbaW5kZXgoaSwgaildLnB1c2goaW5kZXgoaSAtIDEsIGogKyAxKSk7XHJcblxyXG4gICAgICAgIGlmIChqIC0gMSA+PSAwKVxyXG4gICAgICAgICAgdGhpcy5uZWlnaGJvdXJzSW5kaWNlc1tpbmRleChpLCBqKV0ucHVzaChpbmRleChpLCBqIC0gMSkpO1xyXG4gICAgICAgIGlmIChqICsgMSA8IGNvbHMpXHJcbiAgICAgICAgICB0aGlzLm5laWdoYm91cnNJbmRpY2VzW2luZGV4KGksIGopXS5wdXNoKGluZGV4KGksIGogKyAxKSk7XHJcblxyXG4gICAgICAgIGlmIChpICsgMSA8IHJvd3MgJiYgaiAtIDEgPj0gMClcclxuICAgICAgICAgIHRoaXMubmVpZ2hib3Vyc0luZGljZXNbaW5kZXgoaSwgaildLnB1c2goaW5kZXgoaSArIDEsIGogLSAxKSk7XHJcbiAgICAgICAgaWYgKGkgKyAxIDwgcm93cylcclxuICAgICAgICAgIHRoaXMubmVpZ2hib3Vyc0luZGljZXNbaW5kZXgoaSwgaildLnB1c2goaW5kZXgoaSArIDEsIGopKTtcclxuICAgICAgICBpZiAoaSArIDEgPCByb3dzICYmIGogKyAxIDwgY29scylcclxuICAgICAgICAgIHRoaXMubmVpZ2hib3Vyc0luZGljZXNbaW5kZXgoaSwgaildLnB1c2goaW5kZXgoaSArIDEsIGogKyAxKSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGNvbnN0IGNvdW50ID0gKGEsIGIpID0+IGEgKyB0aGlzLmNlbGxzW2JdO1xyXG4gICAgdGhpcy5uZWlnaGJvdXJzID0gaSA9PiB0aGlzLm5laWdoYm91cnNJbmRpY2VzW2ldLnJlZHVjZShjb3VudCwgMCk7XHJcblxyXG4gICAgaWYgKHJhbmRvbVN0YXJ0KVxyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY2VsbHMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgdGhpcy5jZWxsc1tpXSA9IE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSk7XHJcbiAgfVxyXG59XHJcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL1dvcmxkLmpzXG4vLyBtb2R1bGUgaWQgPSAyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlbmRlcmVyIHtcclxuICBjb25zdHJ1Y3Rvcihjb2xzLCByb3dzLCBjZWxsV2lkdGgsIGNlbGxIZWlnaHQpIHtcclxuICAgIGNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIiksXHJcbiAgICAgIGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xyXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChjYW52YXMpO1xyXG4gICAgY2FudmFzLndpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XHJcbiAgICBjYW52YXMuaGVpZ2h0ID0gZG9jdW1lbnQuYm9keS5vZmZzZXRIZWlnaHQ7XHJcbiAgICBjb25zdCBpbWFnZSA9IGNvbnRleHQuY3JlYXRlSW1hZ2VEYXRhKGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCksXHJcbiAgICAgIGltYWdlRGF0YSA9IG5ldyBJbnQzMkFycmF5KGltYWdlLmRhdGEuYnVmZmVyKSxcclxuICAgICAgcmVzZXREYXRhID0gKCkgPT4ge1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2FudmFzLndpZHRoICogY2FudmFzLmhlaWdodDsgaSsrKSB7XHJcbiAgICAgICAgICBpbWFnZURhdGFbaV0gPSAweGZmIDw8IDI0O1xyXG4gICAgICAgIH1cclxuICAgICAgfTtcclxuXHJcbiAgICBsZXQgbW91c2VEb3duID0gZmFsc2U7XHJcblxyXG4gICAgY29uc3Qgb25EcmF3ID0gZXZlbnQgPT4ge1xyXG4gICAgICBpZiAoIW1vdXNlRG93bikgcmV0dXJuO1xyXG5cclxuICAgICAgY29uc3QgcmVjdCA9IGNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgICAgY29uc3QgbW91c2VQb3MgPSB7XHJcbiAgICAgICAgeDogZXZlbnQuY2xpZW50WCAqIGNhbnZhcy53aWR0aCAvIGNhbnZhcy5jbGllbnRXaWR0aCxcclxuICAgICAgICB5OiBldmVudC5jbGllbnRZICogY2FudmFzLmhlaWdodCAvIGNhbnZhcy5jbGllbnRIZWlnaHRcclxuICAgICAgfTtcclxuICAgICAgY29uc3QgcG9zID0ge1xyXG4gICAgICAgIGk6IH5+KG1vdXNlUG9zLnkgLyBjZWxsSGVpZ2h0KSxcclxuICAgICAgICBqOiB+fihtb3VzZVBvcy54IC8gY2VsbFdpZHRoKVxyXG4gICAgICB9O1xyXG5cclxuICAgICAgdGhpcy5vbkRyYXcocG9zLmksIHBvcy5qKTtcclxuICAgIH07XHJcblxyXG4gICAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgZXZ0ID0+IHtcclxuICAgICAgbW91c2VEb3duID0gdHJ1ZTtcclxuICAgICAgb25EcmF3KGV2dCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBvbkRyYXcpO1xyXG4gICAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIGV2dCA9PiAobW91c2VEb3duID0gZmFsc2UpKTtcclxuXHJcbiAgICBjb25zdCBsaXZlQ29sb3IgPSAweGZmIHwgKDB4ZmYgPDwgOCkgfCAoMHhmZiA8PCAxNikgfCAoMHhmZiA8PCAyNCksXHJcbiAgICAgIGRlYWRDb2xvciA9IDB4MDAgfCAoMHgwMCA8PCA4KSB8ICgweDAwIDw8IDE2KSB8ICgweGZmIDw8IDI0KTtcclxuXHJcbiAgICBjb25zdCBoZXhUb1JnYiA9IGhleCA9PiB7XHJcbiAgICAgIGNvbnN0IHJlc3VsdCA9XHJcbiAgICAgICAgL14jPyhbYS1mXFxkXXsyfSkoW2EtZlxcZF17Mn0pKFthLWZcXGRdezJ9KSQvaS5leGVjKGhleCkgfHwgXCIjMDAwMDAwXCI7XHJcbiAgICAgIHJldHVybiAoXHJcbiAgICAgICAgcGFyc2VJbnQocmVzdWx0WzFdLCAxNikgfFxyXG4gICAgICAgIChwYXJzZUludChyZXN1bHRbMl0sIDE2KSA8PCA4KSB8XHJcbiAgICAgICAgKHBhcnNlSW50KHJlc3VsdFszXSwgMTYpIDw8IDE2KSB8XHJcbiAgICAgICAgKDB4ZmYgPDwgMjQpXHJcbiAgICAgICk7XHJcbiAgICB9O1xyXG4gICAgY29uc3QgZmlsbFNxdWFyZSA9ICh4LCB5LCBjb2xvcikgPT4ge1xyXG4gICAgICB2YXIgd2lkdGggPSBjZWxsV2lkdGgsXHJcbiAgICAgICAgaGVpZ2h0ID0gY2VsbEhlaWdodDtcclxuXHJcbiAgICAgIGlmICh4ICogY2VsbFdpZHRoICsgd2lkdGggPiBjYW52YXMud2lkdGgpIHtcclxuICAgICAgICB3aWR0aCA9IGNhbnZhcy53aWR0aCAtIHggKiBjZWxsV2lkdGg7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICh5ICogY2VsbEhlaWdodCArIGhlaWdodCA+IGNhbnZhcy5oZWlnaHQpIHtcclxuICAgICAgICBoZWlnaHQgPSBjYW52YXMuaGVpZ2h0IC0geSAqIGNlbGxIZWlnaHQ7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICh3aWR0aCA8PSAwIHx8IGhlaWdodCA8PSAwKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB2YXIgcG9pbnRlciA9IHggKiBjZWxsV2lkdGggKyB5ICogY2FudmFzLndpZHRoICogY2VsbEhlaWdodCxcclxuICAgICAgICByb3dXaWR0aCA9IGNhbnZhcy53aWR0aCAtIHdpZHRoO1xyXG5cclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBoZWlnaHQ7IGkrKykge1xyXG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgd2lkdGg7IGorKykge1xyXG4gICAgICAgICAgaW1hZ2VEYXRhW3BvaW50ZXJdID0gY29sb3I7XHJcblxyXG4gICAgICAgICAgcG9pbnRlcisrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwb2ludGVyICs9IHJvd1dpZHRoO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMucmVuZGVyID0gKHdvcmxkLCBkaWZmKSA9PiB7XHJcbiAgICAgIGZvciAobGV0IGluZGV4IG9mIGRpZmYpIHtcclxuICAgICAgICBmaWxsU3F1YXJlKFxyXG4gICAgICAgICAgaW5kZXggJSBjb2xzLFxyXG4gICAgICAgICAgTWF0aC5mbG9vcihpbmRleCAvIGNvbHMpLFxyXG4gICAgICAgICAgd29ybGQuY2VsbHNbaW5kZXhdID09PSAxXHJcbiAgICAgICAgICAgID8gdGhpcy5jb2xvcnNbd29ybGQubmVpZ2hib3VycyhpbmRleCldXHJcbiAgICAgICAgICAgIDogLy8gPyBsaXZlQ29sb3JcclxuICAgICAgICAgICAgICBkZWFkQ29sb3JcclxuICAgICAgICApO1xyXG4gICAgICB9XHJcbiAgICAgIGNvbnRleHQucHV0SW1hZ2VEYXRhKGltYWdlLCAwLCAwKTtcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5yZXNldCA9IG1vZGVsID0+IHtcclxuICAgICAgcmVzZXREYXRhKCk7XHJcbiAgICAgIHRoaXMuY29sb3JzID0gbW9kZWwuY29sb3JzLm1hcChoZXhUb1JnYik7XHJcbiAgICAgIGNvbnRleHQucHV0SW1hZ2VEYXRhKGltYWdlLCAwLCAwKTtcclxuICAgIH07XHJcbiAgfVxyXG59XHJcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL0NhbnZhc1JlbmRlcmVyLmpzXG4vLyBtb2R1bGUgaWQgPSAzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIHN0YXRzLmpzIC0gaHR0cDovL2dpdGh1Yi5jb20vbXJkb29iL3N0YXRzLmpzXHJcbihmdW5jdGlvbihmLGUpe1wib2JqZWN0XCI9PT10eXBlb2YgZXhwb3J0cyYmXCJ1bmRlZmluZWRcIiE9PXR5cGVvZiBtb2R1bGU/bW9kdWxlLmV4cG9ydHM9ZSgpOlwiZnVuY3Rpb25cIj09PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKGUpOmYuU3RhdHM9ZSgpfSkodGhpcyxmdW5jdGlvbigpe3ZhciBmPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gZShhKXtjLmFwcGVuZENoaWxkKGEuZG9tKTtyZXR1cm4gYX1mdW5jdGlvbiB1KGEpe2Zvcih2YXIgZD0wO2Q8Yy5jaGlsZHJlbi5sZW5ndGg7ZCsrKWMuY2hpbGRyZW5bZF0uc3R5bGUuZGlzcGxheT1kPT09YT9cImJsb2NrXCI6XCJub25lXCI7bD1hfXZhciBsPTAsYz1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO2Muc3R5bGUuY3NzVGV4dD1cInBvc2l0aW9uOmZpeGVkO3RvcDowO2xlZnQ6MDtjdXJzb3I6cG9pbnRlcjtvcGFjaXR5OjAuOTt6LWluZGV4OjEwMDAwXCI7Yy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIixmdW5jdGlvbihhKXthLnByZXZlbnREZWZhdWx0KCk7XHJcbnUoKytsJWMuY2hpbGRyZW4ubGVuZ3RoKX0sITEpO3ZhciBrPShwZXJmb3JtYW5jZXx8RGF0ZSkubm93KCksZz1rLGE9MCxyPWUobmV3IGYuUGFuZWwoXCJGUFNcIixcIiMwZmZcIixcIiMwMDJcIikpLGg9ZShuZXcgZi5QYW5lbChcIk1TXCIsXCIjMGYwXCIsXCIjMDIwXCIpKTtpZihzZWxmLnBlcmZvcm1hbmNlJiZzZWxmLnBlcmZvcm1hbmNlLm1lbW9yeSl2YXIgdD1lKG5ldyBmLlBhbmVsKFwiTUJcIixcIiNmMDhcIixcIiMyMDFcIikpO3UoMCk7cmV0dXJue1JFVklTSU9OOjE2LGRvbTpjLGFkZFBhbmVsOmUsc2hvd1BhbmVsOnUsYmVnaW46ZnVuY3Rpb24oKXtrPShwZXJmb3JtYW5jZXx8RGF0ZSkubm93KCl9LGVuZDpmdW5jdGlvbigpe2ErKzt2YXIgYz0ocGVyZm9ybWFuY2V8fERhdGUpLm5vdygpO2gudXBkYXRlKGMtaywyMDApO2lmKGM+ZysxRTMmJihyLnVwZGF0ZSgxRTMqYS8oYy1nKSwxMDApLGc9YyxhPTAsdCkpe3ZhciBkPXBlcmZvcm1hbmNlLm1lbW9yeTt0LnVwZGF0ZShkLnVzZWRKU0hlYXBTaXplL1xyXG4xMDQ4NTc2LGQuanNIZWFwU2l6ZUxpbWl0LzEwNDg1NzYpfXJldHVybiBjfSx1cGRhdGU6ZnVuY3Rpb24oKXtrPXRoaXMuZW5kKCl9LGRvbUVsZW1lbnQ6YyxzZXRNb2RlOnV9fTtmLlBhbmVsPWZ1bmN0aW9uKGUsZixsKXt2YXIgYz1JbmZpbml0eSxrPTAsZz1NYXRoLnJvdW5kLGE9Zyh3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpb3x8MSkscj04MCphLGg9NDgqYSx0PTMqYSx2PTIqYSxkPTMqYSxtPTE1KmEsbj03NCphLHA9MzAqYSxxPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7cS53aWR0aD1yO3EuaGVpZ2h0PWg7cS5zdHlsZS5jc3NUZXh0PVwid2lkdGg6ODBweDtoZWlnaHQ6NDhweFwiO3ZhciBiPXEuZ2V0Q29udGV4dChcIjJkXCIpO2IuZm9udD1cImJvbGQgXCIrOSphK1wicHggSGVsdmV0aWNhLEFyaWFsLHNhbnMtc2VyaWZcIjtiLnRleHRCYXNlbGluZT1cInRvcFwiO2IuZmlsbFN0eWxlPWw7Yi5maWxsUmVjdCgwLDAscixoKTtiLmZpbGxTdHlsZT1mO2IuZmlsbFRleHQoZSx0LHYpO1xyXG5iLmZpbGxSZWN0KGQsbSxuLHApO2IuZmlsbFN0eWxlPWw7Yi5nbG9iYWxBbHBoYT0uOTtiLmZpbGxSZWN0KGQsbSxuLHApO3JldHVybntkb206cSx1cGRhdGU6ZnVuY3Rpb24oaCx3KXtjPU1hdGgubWluKGMsaCk7az1NYXRoLm1heChrLGgpO2IuZmlsbFN0eWxlPWw7Yi5nbG9iYWxBbHBoYT0xO2IuZmlsbFJlY3QoMCwwLHIsbSk7Yi5maWxsU3R5bGU9ZjtiLmZpbGxUZXh0KGcoaCkrXCIgXCIrZStcIiAoXCIrZyhjKStcIi1cIitnKGspK1wiKVwiLHQsdik7Yi5kcmF3SW1hZ2UocSxkK2EsbSxuLWEscCxkLG0sbi1hLHApO2IuZmlsbFJlY3QoZCtuLWEsbSxhLHApO2IuZmlsbFN0eWxlPWw7Yi5nbG9iYWxBbHBoYT0uOTtiLmZpbGxSZWN0KGQrbi1hLG0sYSxnKCgxLWgvdykqcCkpfX19O3JldHVybiBmfSk7XHJcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbGliL3N0YXRzLm1pbi5qc1xuLy8gbW9kdWxlIGlkID0gNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBPcHRpb25zIHtcclxuICBjb25zdHJ1Y3RvcihndWksIHJlc2V0LCBwYXVzZSwgcGxheSkge1xyXG4gICAgdGhpcy5tb2RlbCA9IHtcclxuICAgICAgYmlydGg6IFwiM1wiLFxyXG4gICAgICBzdXJ2aXZhbDogXCIyM1wiLFxyXG4gICAgICByYW5kb21TdGFydDogdHJ1ZSxcclxuICAgICAgY29sb3JzOiBuZXcgQXJyYXkoOSlcclxuICAgIH07XHJcbiAgICB0aGlzLm1ldGhvZHMgPSB7XHJcbiAgICAgIHJlc2V0OiAoKSA9PiByZXNldCh0aGlzLm1vZGVsKSxcclxuICAgICAgcGF1c2UsXHJcbiAgICAgIHBsYXksXHJcbiAgICAgIHJlc2V0Q29sb3JzOiAoKSA9PiB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLm1vZGVsLmNvbG9ycy5sZW5ndGg7IGkrKylcclxuICAgICAgICAgIHRoaXMubW9kZWwuY29sb3JzW2ldID0gXCIjRkZGRkZGXCI7XHJcbiAgICAgIH0sXHJcbiAgICAgIHJhbmRvbTogKCkgPT4ge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5tb2RlbC5jb2xvcnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgIHRoaXMubW9kZWwuY29sb3JzW2ldID0gcmFuZG9tQ29sb3IoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIHJhbmRvbVJ1bGVzOiAoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgY2hhbmNlQiA9IE1hdGgucmFuZG9tKCk7XHJcbiAgICAgICAgZG8ge1xyXG4gICAgICAgICAgdGhpcy5tb2RlbC5iaXJ0aCA9IFsxLCAyLCAzLCA0LCA1LCA2LCA3LCA4XVxyXG4gICAgICAgICAgICAuZmlsdGVyKGkgPT4gTWF0aC5yYW5kb20oKSA+IGNoYW5jZUIpXHJcbiAgICAgICAgICAgIC5qb2luKClcclxuICAgICAgICAgICAgLnJlcGxhY2UoLywvZywgXCJcIik7XHJcbiAgICAgICAgfSB3aGlsZSAoIXRoaXMubW9kZWwuYmlydGgpO1xyXG4gICAgICAgIGNvbnN0IGNoYW5jZVMgPSBNYXRoLnJhbmRvbSgpO1xyXG4gICAgICAgIGRvIHtcclxuICAgICAgICAgIHRoaXMubW9kZWwuc3Vydml2YWwgPSBbMSwgMiwgMywgNCwgNSwgNiwgNywgOF1cclxuICAgICAgICAgICAgLmZpbHRlcihpID0+IE1hdGgucmFuZG9tKCkgPiBjaGFuY2VTKVxyXG4gICAgICAgICAgICAuam9pbigpXHJcbiAgICAgICAgICAgIC5yZXBsYWNlKC8sL2csIFwiXCIpO1xyXG4gICAgICAgIH0gd2hpbGUgKCF0aGlzLm1vZGVsLnN1cnZpdmFsKTtcclxuICAgICAgfSxcclxuICAgICAgYmxhY2tXaGl0ZTogKCkgPT4gdGhpcy5tZXRob2RzLnJlc2V0Q29sb3JzKCksXHJcbiAgICAgIHR3ZWV0OiAoKSA9PlxyXG4gICAgICAgIHdpbmRvdy5vcGVuKFxyXG4gICAgICAgICAgXCJodHRwczovL3R3aXR0ZXIuY29tL2ludGVudC90d2VldD90ZXh0PUhlbGxvJTIwd29ybGRcIixcclxuICAgICAgICAgIFwiX2JsYW5rXCIsXHJcbiAgICAgICAgICBcImxvY2F0aW9uPXllc1wiXHJcbiAgICAgICAgKSxcclxuICAgICAgY29weUxpbms6ICgpID0+IHtcclxuICAgICAgICBjb25zdCBzdHIgPSBidG9hKEpTT04uc3RyaW5naWZ5KHRoaXMubW9kZWwpKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhzdHIpO1xyXG4gICAgICB9LFxyXG4gICAgICBhYm91dDogKCkgPT4ge1xyXG4gICAgICAgIG1peHBhbmVsLnRyYWNrKFwiQWJvdXQgQ2xpY2tcIik7XHJcbiAgICAgICAgd2luZG93Lm9wZW4oXHJcbiAgICAgICAgICBcImh0dHBzOi8vZ2l0aHViLmNvbS9vZGVkdy9jZWxsdWxhci1hdXRvbWF0YS1wbGF5Z3JvdW5kL2Jsb2IvbWFzdGVyL1JFQURNRS5tZFwiLFxyXG4gICAgICAgICAgXCJfYmxhbmtcIlxyXG4gICAgICAgICk7XHJcbiAgICAgIH0sXHJcbiAgICAgIGdvOiAoKSA9PiB7XHJcbiAgICAgICAgbWl4cGFuZWwudHJhY2soXCJHbyBDbGlja1wiLCB7XHJcbiAgICAgICAgICBSdWxlczogYEIke3RoaXMubW9kZWwuYmlydGh9L1Mke3RoaXMubW9kZWwuc3Vydml2YWx9YFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJlc2V0KHRoaXMubW9kZWwpO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG4gICAgY29uc3QgbGV0dGVycyA9IFwiMDEyMzQ1Njc4OUFCQ0RFRlwiLFxyXG4gICAgICByYW5kb21Db2xvciA9ICgpID0+IHtcclxuICAgICAgICBsZXQgY29sb3IgPSBcIiNcIjtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDY7IGkrKykge1xyXG4gICAgICAgICAgY29sb3IgKz0gbGV0dGVyc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxNildO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gY29sb3I7XHJcbiAgICAgIH07XHJcblxyXG4gICAgLy9ydWxlc1xyXG4gICAgY29uc3QgcnVsZXNGb2xkZXIgPSBndWkuYWRkRm9sZGVyKFwicnVsZXNcIik7XHJcbiAgICBydWxlc0ZvbGRlci5hZGQodGhpcy5tb2RlbCwgXCJiaXJ0aFwiKS5saXN0ZW4oKTtcclxuICAgIHJ1bGVzRm9sZGVyLmFkZCh0aGlzLm1vZGVsLCBcInN1cnZpdmFsXCIpLmxpc3RlbigpO1xyXG4gICAgcnVsZXNGb2xkZXIuYWRkKHRoaXMubWV0aG9kcywgXCJyYW5kb21SdWxlc1wiKS5uYW1lKFwicmFuZG9tXCIpO1xyXG5cclxuICAgIC8vY29sb3JzXHJcbiAgICBjb25zdCBjb2xvcnNGb2xkZXIgPSBndWkuYWRkRm9sZGVyKFwiY29sb3JzIGJ5IG5laWdoYm91cnNcIik7XHJcbiAgICB0aGlzLm1ldGhvZHMucmVzZXRDb2xvcnMoKTtcclxuICAgIGZvciAobGV0IGkgPSAxOyBpIDwgdGhpcy5tb2RlbC5jb2xvcnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgY29sb3JzRm9sZGVyLmFkZENvbG9yKHRoaXMubW9kZWwuY29sb3JzLCBpKS5saXN0ZW4oKTtcclxuICAgIH1cclxuICAgIGNvbG9yc0ZvbGRlci5hZGQodGhpcy5tZXRob2RzLCBcInJhbmRvbVwiKTtcclxuICAgIGNvbG9yc0ZvbGRlci5hZGQodGhpcy5tZXRob2RzLCBcImJsYWNrV2hpdGVcIikubmFtZShcImJsYWNrICYgd2hpdGVcIik7XHJcblxyXG4gICAgZ3VpXHJcbiAgICAgIC5hZGQodGhpcy5tb2RlbCwgXCJyYW5kb21TdGFydFwiKVxyXG4gICAgICAubmFtZShcInJhbmRvbSBzdGFydFwiKVxyXG4gICAgICAubGlzdGVuKCk7XHJcbiAgICBndWkuYWRkKHRoaXMubWV0aG9kcywgXCJnb1wiKS5uYW1lKFwic2V0ICYgZ29cIik7XHJcbiAgICBndWkuYWRkKHRoaXMubWV0aG9kcywgXCJhYm91dFwiKTtcclxuXHJcbiAgICBndWkuY2xvc2VkID0gdHJ1ZTtcclxuICAgIGRvY3VtZW50Lm9ua2V5ZG93biA9IGV2ID0+IHtcclxuICAgICAgaWYgKGV2LmtleUNvZGUgPT0gMzIpIHtcclxuICAgICAgICAvL3NwYWNlXHJcbiAgICAgICAgdGhpcy5tZXRob2RzLnJlc2V0KCk7XHJcbiAgICAgIH0gZWxzZSBpZiAoZXYua2V5Q29kZSA9PSA4Mikge1xyXG4gICAgICAgIC8vclxyXG4gICAgICAgIHRoaXMubW9kZWwucmFuZG9tU3RhcnQgPSAhdGhpcy5tb2RlbC5yYW5kb21TdGFydDtcclxuICAgICAgfSBlbHNlIGlmIChldi5rZXlDb2RlID09IDY3KSB7XHJcbiAgICAgICAgLy9jXHJcbiAgICAgICAgdGhpcy5tZXRob2RzLnJhbmRvbSgpO1xyXG4gICAgICB9IGVsc2UgaWYgKGV2LmtleUNvZGUgPT0gNjYpIHtcclxuICAgICAgICAvL2NcclxuICAgICAgICB0aGlzLm1ldGhvZHMucmFuZG9tUnVsZXMoKTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuICB9XHJcbn1cclxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvT3B0aW9ucy5qc1xuLy8gbW9kdWxlIGlkID0gNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9