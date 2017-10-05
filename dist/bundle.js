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
      if (this.model.renderCenter) {
        fillSquare(Math.round(cols / 2), Math.round(rows / 2), liveColor);
      }
      context.putImageData(image, 0, 0);
    };

    this.reset = model => {
      resetData();
      this.colors = model.colors.map(hexToRgb);
      this.model = model;
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
      colors: new Array(9),
      visible: true,
      renderCenter: false
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
      } else if (ev.keyCode == 68) {
        //d
        document.getElementsByClassName(
          "close-button"
        )[0].style.visibility = this.model.visible ? "hidden" : "initial";
        this.model.visible = !this.model.visible;
      } else if (ev.keyCode == 69) {
        this.model.renderCenter = !this.model.renderCenter;
      }
    };
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Options;



/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNjAxODRjN2VmNzQxZGQ1ZmIxY2EiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FwcC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvRW5naW5lLmpzIiwid2VicGFjazovLy8uL3NyYy9Xb3JsZC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvQ2FudmFzUmVuZGVyZXIuanMiLCJ3ZWJwYWNrOi8vLy4vbGliL3N0YXRzLm1pbi5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvT3B0aW9ucy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7O0FDN0RBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7Ozs7Ozs7O0FDbENEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EscUJB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QjtBQUNyRDtBQUNBLE9BQU87QUFDUDtBQUNBLHVCQUF1Qiw4QkFBOEI7QUFDckQ7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EscUJBQXFCLGlCQUFpQixJQUFJLG9CQUFvQjtBQUM5RCxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLE9BQU87QUFDOUI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsOEJBQThCO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUEiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgNjAxODRjN2VmNzQxZGQ1ZmIxY2EiLCJpbXBvcnQgRW5naW5lIGZyb20gJy4vRW5naW5lJztcclxuaW1wb3J0IFJlbmRlcmVyIGZyb20gJy4vQ2FudmFzUmVuZGVyZXInO1xyXG5pbXBvcnQgU3RhdHMgZnJvbSAnLi4vbGliL3N0YXRzLm1pbic7XHJcbmltcG9ydCBPcHRpb25zIGZyb20gJy4vT3B0aW9ucyc7XHJcblxyXG5jb25zdCBzdGF0cyA9IG5ldyBTdGF0cygpO1xyXG5zdGF0cy5zaG93UGFuZWwoMSk7XHJcbi8vIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoc3RhdHMuZG9tKTtcclxuXHJcbmNvbnN0IHBpeGVsc1BlckNlbGwgPSA0LFxyXG4gIGNvbHMgPSBNYXRoLmNlaWwod2luZG93LmlubmVyV2lkdGggLyBwaXhlbHNQZXJDZWxsKSxcclxuICByb3dzID0gTWF0aC5jZWlsKHdpbmRvdy5pbm5lckhlaWdodCAvIHBpeGVsc1BlckNlbGwpLFxyXG4gIHJlbmRlcmVyID0gbmV3IFJlbmRlcmVyKGNvbHMsIHJvd3MsIHBpeGVsc1BlckNlbGwsIHBpeGVsc1BlckNlbGwpLFxyXG4gIGVuZ2luZSA9IG5ldyBFbmdpbmUoXHJcbiAgICBjb2xzLCAvL251bWJlciBvZiBjb2x1bW5zXHJcbiAgICByb3dzLCAvL251bWJlciBvZiByb3dzXHJcbiAgICByZW5kZXJlci5yZW5kZXIsIC8vb25UaWNrXHJcbiAgICAzMCwgLy9kZXNpcmVkIGZwc1xyXG4gICAgc3RhdHNcclxuICApO1xyXG5yZW5kZXJlci5vbkRyYXcgPSBlbmdpbmUub25EcmF3O1xyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHtcclxuICBtaXhwYW5lbC50cmFjaygnVmlldycpO1xyXG4gIGNvbnN0IGd1aSA9IG5ldyBkYXQuR1VJKCk7XHJcbiAgY29uc3Qgb3B0aW9ucyA9IG5ldyBPcHRpb25zKFxyXG4gICAgZ3VpLFxyXG4gICAgbW9kZWwgPT4ge1xyXG4gICAgICByZW5kZXJlci5yZXNldChtb2RlbCk7XHJcbiAgICAgIGVuZ2luZS5zdGFydChtb2RlbCk7XHJcbiAgICB9LFxyXG4gICAgZW5naW5lLnBhdXNlLFxyXG4gICAgZW5naW5lLnBsYXlcclxuICApO1xyXG4gIG9wdGlvbnMubWV0aG9kcy5yZXNldCgpO1xyXG59KTtcclxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvYXBwLmpzXG4vLyBtb2R1bGUgaWQgPSAwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCBXb3JsZCBmcm9tIFwiLi9Xb3JsZFwiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRW5naW5lIHtcclxuICBjb25zdHJ1Y3Rvcihjb2xzLCByb3dzLCBvblRpY2ssIGRlc2lyZWRGcHMsIHN0YXRzKSB7XHJcbiAgICBsZXQgZW5naW5lVGltZSA9IDAsXHJcbiAgICAgIGN1cnJlbnQsXHJcbiAgICAgIG5leHQsXHJcbiAgICAgIGJpcnRoID0gXCJcIixcclxuICAgICAgc3Vydml2YWwgPSBcIlwiLFxyXG4gICAgICByYW5kb21TdGFydCA9IGZhbHNlLFxyXG4gICAgICBiaXJ0aE1hcCA9IG5ldyBBcnJheSg4KSxcclxuICAgICAgc3Vydml2YWxNYXAgPSBuZXcgQXJyYXkoOCksXHJcbiAgICAgIG1zVGlsbE5leHRGcmFtZSA9IDAsXHJcbiAgICAgIGxhc3RUaWNrVGltZSA9IDAsXHJcbiAgICAgIHRvdGFsID0gcm93cyAqIGNvbHMsXHJcbiAgICAgIGlzUnVubmluZyA9IGZhbHNlO1xyXG5cclxuICAgIGNvbnN0IG1zUGVyRnJhbWUgPSAxMDAwIC8gZGVzaXJlZEZwcztcclxuXHJcbiAgICBjb25zdCBjb21wdXRlTmV4dFN0YXRlID0gKCkgPT4ge1xyXG4gICAgICBsZXQgbmV4dFN0YXRlID0gMDtcclxuICAgICAgY29uc3QgZGlmZiA9IG5ldyBTZXQoKTtcclxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0b3RhbDsgaSsrKSB7XHJcbiAgICAgICAgbGV0IG5laWdoYm9ycyA9IGN1cnJlbnQubmVpZ2hib3VycyhpKSxcclxuICAgICAgICAgIGN1cnJlbnRTdGF0ZSA9IGN1cnJlbnQuZ2V0KGkpO1xyXG5cclxuICAgICAgICBuZXh0U3RhdGUgPVxyXG4gICAgICAgICAgY3VycmVudFN0YXRlID09PSAxID8gc3Vydml2YWxNYXBbbmVpZ2hib3JzXSA6IGJpcnRoTWFwW25laWdoYm9yc107XHJcbiAgICAgICAgbmV4dC5zZXQoaSwgbmV4dFN0YXRlKTtcclxuXHJcbiAgICAgICAgaWYgKGN1cnJlbnRTdGF0ZSAhPT0gbmV4dFN0YXRlKSB7XHJcbiAgICAgICAgICBkaWZmLmFkZChpKTtcclxuICAgICAgICAgIGNvbnN0IG5laWdoYm91cnNJbmRpY2VzID0gY3VycmVudC5uZWlnaGJvdXJzSW5kaWNlc1tpXTtcclxuICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgbmVpZ2hib3Vyc0luZGljZXMubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgZGlmZi5hZGQobmVpZ2hib3Vyc0luZGljZXNbal0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBjb25zdCB0ZW1wID0gY3VycmVudDtcclxuICAgICAgY3VycmVudCA9IG5leHQ7XHJcbiAgICAgIG5leHQgPSB0ZW1wO1xyXG4gICAgICByZXR1cm4gZGlmZjtcclxuICAgIH07XHJcblxyXG4gICAgY29uc3QgdGljayA9ICgpID0+IHtcclxuICAgICAgY29uc3Qgc3RhcnRUaW1lID0gcGVyZm9ybWFuY2Uubm93KCksXHJcbiAgICAgICAgbXNFbGFwc2VkID0gc3RhcnRUaW1lIC0gbGFzdFRpY2tUaW1lO1xyXG4gICAgICBtc1RpbGxOZXh0RnJhbWUgLT0gbXNFbGFwc2VkO1xyXG4gICAgICBpZiAobXNUaWxsTmV4dEZyYW1lIDw9IDApIHtcclxuICAgICAgICBzdGF0cy5iZWdpbigpO1xyXG4gICAgICAgIGNvbnN0IGRpZmYgPSBjb21wdXRlTmV4dFN0YXRlKCk7XHJcbiAgICAgICAgb25UaWNrKGN1cnJlbnQsIGRpZmYpO1xyXG4gICAgICAgIHN0YXRzLmVuZCgpO1xyXG4gICAgICAgIGxhc3RUaWNrVGltZSA9IHBlcmZvcm1hbmNlLm5vdygpO1xyXG4gICAgICAgIGNvbnN0IHRpbWVGb3JGcmFtZSA9IGxhc3RUaWNrVGltZSAtIHN0YXJ0VGltZTtcclxuICAgICAgICBtc1RpbGxOZXh0RnJhbWUgPSBtc1BlckZyYW1lIC0gdGltZUZvckZyYW1lO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxhc3RUaWNrVGltZSA9IHBlcmZvcm1hbmNlLm5vdygpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoaXNSdW5uaW5nKSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRpY2spO1xyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdCBzZXRNb2RlbCA9IG1vZGVsID0+IHtcclxuICAgICAgYmlydGggPSBtb2RlbC5iaXJ0aCB8fCBcIjNcIjtcclxuICAgICAgc3Vydml2YWwgPSBtb2RlbC5zdXJ2aXZhbCB8fCBcIjIzXCI7XHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgODsgaSsrKSB7XHJcbiAgICAgICAgYmlydGhNYXBbaV0gPSBiaXJ0aC5pbmRleE9mKGkpID49IDAgPyAxIDogMDtcclxuICAgICAgICBzdXJ2aXZhbE1hcFtpXSA9IHN1cnZpdmFsLmluZGV4T2YoaSkgPj0gMCA/IDEgOiAwO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByYW5kb21TdGFydCA9IG1vZGVsLnJhbmRvbVN0YXJ0O1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLnN0YXJ0ID0gbW9kZWwgPT4ge1xyXG4gICAgICBzZXRNb2RlbChtb2RlbCk7XHJcbiAgICAgIGN1cnJlbnQgPSBuZXcgV29ybGQocm93cywgY29scywgcmFuZG9tU3RhcnQpO1xyXG4gICAgICBuZXh0ID0gbmV3IFdvcmxkKHJvd3MsIGNvbHMpO1xyXG4gICAgICBpc1J1bm5pbmcgPSB0cnVlO1xyXG4gICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRpY2spO1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLnBhdXNlID0gKCkgPT4ge1xyXG4gICAgICBpc1J1bm5pbmcgPSBmYWxzZTtcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5wbGF5ID0gKCkgPT4ge1xyXG4gICAgICBpc1J1bm5pbmcgPSB0cnVlO1xyXG4gICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRpY2spO1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLm9uRHJhdyA9IChpLCBqKSA9PiB7XHJcbiAgICAgIGN1cnJlbnQuY3Jvc3MoaSwgaik7XHJcbiAgICB9O1xyXG4gIH1cclxufVxyXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9FbmdpbmUuanNcbi8vIG1vZHVsZSBpZCA9IDFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgV29ybGQge1xyXG4gIGNvbnN0cnVjdG9yKHJvd3MsIGNvbHMsIHJhbmRvbVN0YXJ0KSB7XHJcbiAgICB0aGlzLmNlbGxzID0gbmV3IFVpbnQ4QXJyYXkobmV3IEFycmF5QnVmZmVyKHJvd3MgKiBjb2xzKSk7XHJcbiAgICBjb25zdCBpbmRleCA9IChpLCBqKSA9PiBpICogY29scyArIGo7XHJcbiAgICB0aGlzLm5laWdoYm91cnNJbmRpY2VzID0gbmV3IEFycmF5KGNvbHMgKiByb3dzKTtcclxuICAgIHRoaXMuZ2V0ID0gaSA9PlxyXG4gICAgICBpID49IDAgJiYgaSA8IHRoaXMuY2VsbHMubGVuZ3RoID8gdGhpcy5jZWxsc1tpXSA6IHVuZGVmaW5lZDtcclxuXHJcbiAgICB0aGlzLnNldCA9IChpLCB2YWwpID0+ICh0aGlzLmNlbGxzW2ldID0gdmFsKTtcclxuXHJcbiAgICB0aGlzLmNyb3NzID0gKGksIGopID0+IHtcclxuICAgICAgaWYgKGkgLSAxID4gMCkgdGhpcy5jZWxsc1tpbmRleChpIC0gMSwgaildID0gMTtcclxuICAgICAgaWYgKGogLSAxID4gMCkgdGhpcy5jZWxsc1tpbmRleChpLCBqIC0gMSldID0gMTtcclxuICAgICAgdGhpcy5jZWxsc1tpbmRleChpLCBqKV0gPSAxO1xyXG4gICAgICBpZiAoaiArIDEgPiBjb2xzKSB0aGlzLmNlbGxzW2luZGV4KGksIGogKyAxKV0gPSAxO1xyXG4gICAgICBpZiAoaSArIDEgPCByb3dzKSB0aGlzLmNlbGxzW2luZGV4KGkgKyAxLCBqKV0gPSAxO1xyXG4gICAgfTtcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJvd3M7IGkrKykge1xyXG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGNvbHM7IGorKykge1xyXG4gICAgICAgIHRoaXMubmVpZ2hib3Vyc0luZGljZXNbaW5kZXgoaSwgaildID0gW107XHJcbiAgICAgICAgaWYgKGkgLSAxID49IDAgJiYgaiAtIDEgPj0gMClcclxuICAgICAgICAgIHRoaXMubmVpZ2hib3Vyc0luZGljZXNbaW5kZXgoaSwgaildLnB1c2goaW5kZXgoaSAtIDEsIGogLSAxKSk7XHJcbiAgICAgICAgaWYgKGkgLSAxID49IDApXHJcbiAgICAgICAgICB0aGlzLm5laWdoYm91cnNJbmRpY2VzW2luZGV4KGksIGopXS5wdXNoKGluZGV4KGkgLSAxLCBqKSk7XHJcbiAgICAgICAgaWYgKGkgLSAxID49IDAgJiYgaiArIDEgPCBjb2xzKVxyXG4gICAgICAgICAgdGhpcy5uZWlnaGJvdXJzSW5kaWNlc1tpbmRleChpLCBqKV0ucHVzaChpbmRleChpIC0gMSwgaiArIDEpKTtcclxuXHJcbiAgICAgICAgaWYgKGogLSAxID49IDApXHJcbiAgICAgICAgICB0aGlzLm5laWdoYm91cnNJbmRpY2VzW2luZGV4KGksIGopXS5wdXNoKGluZGV4KGksIGogLSAxKSk7XHJcbiAgICAgICAgaWYgKGogKyAxIDwgY29scylcclxuICAgICAgICAgIHRoaXMubmVpZ2hib3Vyc0luZGljZXNbaW5kZXgoaSwgaildLnB1c2goaW5kZXgoaSwgaiArIDEpKTtcclxuXHJcbiAgICAgICAgaWYgKGkgKyAxIDwgcm93cyAmJiBqIC0gMSA+PSAwKVxyXG4gICAgICAgICAgdGhpcy5uZWlnaGJvdXJzSW5kaWNlc1tpbmRleChpLCBqKV0ucHVzaChpbmRleChpICsgMSwgaiAtIDEpKTtcclxuICAgICAgICBpZiAoaSArIDEgPCByb3dzKVxyXG4gICAgICAgICAgdGhpcy5uZWlnaGJvdXJzSW5kaWNlc1tpbmRleChpLCBqKV0ucHVzaChpbmRleChpICsgMSwgaikpO1xyXG4gICAgICAgIGlmIChpICsgMSA8IHJvd3MgJiYgaiArIDEgPCBjb2xzKVxyXG4gICAgICAgICAgdGhpcy5uZWlnaGJvdXJzSW5kaWNlc1tpbmRleChpLCBqKV0ucHVzaChpbmRleChpICsgMSwgaiArIDEpKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgY29uc3QgY291bnQgPSAoYSwgYikgPT4gYSArIHRoaXMuY2VsbHNbYl07XHJcbiAgICB0aGlzLm5laWdoYm91cnMgPSBpID0+IHRoaXMubmVpZ2hib3Vyc0luZGljZXNbaV0ucmVkdWNlKGNvdW50LCAwKTtcclxuXHJcbiAgICBpZiAocmFuZG9tU3RhcnQpXHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5jZWxscy5sZW5ndGg7IGkrKylcclxuICAgICAgICB0aGlzLmNlbGxzW2ldID0gTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpKTtcclxuICB9XHJcbn1cclxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvV29ybGQuanNcbi8vIG1vZHVsZSBpZCA9IDJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVuZGVyZXIge1xyXG4gIGNvbnN0cnVjdG9yKGNvbHMsIHJvd3MsIGNlbGxXaWR0aCwgY2VsbEhlaWdodCkge1xyXG4gICAgY29uc3QgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKSxcclxuICAgICAgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XHJcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGNhbnZhcyk7XHJcbiAgICBjYW52YXMud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcclxuICAgIGNhbnZhcy5oZWlnaHQgPSBkb2N1bWVudC5ib2R5Lm9mZnNldEhlaWdodDtcclxuICAgIGNvbnN0IGltYWdlID0gY29udGV4dC5jcmVhdGVJbWFnZURhdGEoY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KSxcclxuICAgICAgaW1hZ2VEYXRhID0gbmV3IEludDMyQXJyYXkoaW1hZ2UuZGF0YS5idWZmZXIpLFxyXG4gICAgICByZXNldERhdGEgPSAoKSA9PiB7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjYW52YXMud2lkdGggKiBjYW52YXMuaGVpZ2h0OyBpKyspIHtcclxuICAgICAgICAgIGltYWdlRGF0YVtpXSA9IDB4ZmYgPDwgMjQ7XHJcbiAgICAgICAgfVxyXG4gICAgICB9O1xyXG5cclxuICAgIGxldCBtb3VzZURvd24gPSBmYWxzZTtcclxuXHJcbiAgICBjb25zdCBvbkRyYXcgPSBldmVudCA9PiB7XHJcbiAgICAgIGlmICghbW91c2VEb3duKSByZXR1cm47XHJcblxyXG4gICAgICBjb25zdCByZWN0ID0gY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgICBjb25zdCBtb3VzZVBvcyA9IHtcclxuICAgICAgICB4OiBldmVudC5jbGllbnRYICogY2FudmFzLndpZHRoIC8gY2FudmFzLmNsaWVudFdpZHRoLFxyXG4gICAgICAgIHk6IGV2ZW50LmNsaWVudFkgKiBjYW52YXMuaGVpZ2h0IC8gY2FudmFzLmNsaWVudEhlaWdodFxyXG4gICAgICB9O1xyXG4gICAgICBjb25zdCBwb3MgPSB7XHJcbiAgICAgICAgaTogfn4obW91c2VQb3MueSAvIGNlbGxIZWlnaHQpLFxyXG4gICAgICAgIGo6IH5+KG1vdXNlUG9zLnggLyBjZWxsV2lkdGgpXHJcbiAgICAgIH07XHJcblxyXG4gICAgICB0aGlzLm9uRHJhdyhwb3MuaSwgcG9zLmopO1xyXG4gICAgfTtcclxuXHJcbiAgICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBldnQgPT4ge1xyXG4gICAgICBtb3VzZURvd24gPSB0cnVlO1xyXG4gICAgICBvbkRyYXcoZXZ0KTtcclxuICAgIH0pO1xyXG5cclxuICAgIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIG9uRHJhdyk7XHJcbiAgICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgZXZ0ID0+IChtb3VzZURvd24gPSBmYWxzZSkpO1xyXG5cclxuICAgIGNvbnN0IGxpdmVDb2xvciA9IDB4ZmYgfCAoMHhmZiA8PCA4KSB8ICgweGZmIDw8IDE2KSB8ICgweGZmIDw8IDI0KSxcclxuICAgICAgZGVhZENvbG9yID0gMHgwMCB8ICgweDAwIDw8IDgpIHwgKDB4MDAgPDwgMTYpIHwgKDB4ZmYgPDwgMjQpO1xyXG5cclxuICAgIGNvbnN0IGhleFRvUmdiID0gaGV4ID0+IHtcclxuICAgICAgY29uc3QgcmVzdWx0ID1cclxuICAgICAgICAvXiM/KFthLWZcXGRdezJ9KShbYS1mXFxkXXsyfSkoW2EtZlxcZF17Mn0pJC9pLmV4ZWMoaGV4KSB8fCBcIiMwMDAwMDBcIjtcclxuICAgICAgcmV0dXJuIChcclxuICAgICAgICBwYXJzZUludChyZXN1bHRbMV0sIDE2KSB8XHJcbiAgICAgICAgKHBhcnNlSW50KHJlc3VsdFsyXSwgMTYpIDw8IDgpIHxcclxuICAgICAgICAocGFyc2VJbnQocmVzdWx0WzNdLCAxNikgPDwgMTYpIHxcclxuICAgICAgICAoMHhmZiA8PCAyNClcclxuICAgICAgKTtcclxuICAgIH07XHJcbiAgICBjb25zdCBmaWxsU3F1YXJlID0gKHgsIHksIGNvbG9yKSA9PiB7XHJcbiAgICAgIHZhciB3aWR0aCA9IGNlbGxXaWR0aCxcclxuICAgICAgICBoZWlnaHQgPSBjZWxsSGVpZ2h0O1xyXG5cclxuICAgICAgaWYgKHggKiBjZWxsV2lkdGggKyB3aWR0aCA+IGNhbnZhcy53aWR0aCkge1xyXG4gICAgICAgIHdpZHRoID0gY2FudmFzLndpZHRoIC0geCAqIGNlbGxXaWR0aDtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHkgKiBjZWxsSGVpZ2h0ICsgaGVpZ2h0ID4gY2FudmFzLmhlaWdodCkge1xyXG4gICAgICAgIGhlaWdodCA9IGNhbnZhcy5oZWlnaHQgLSB5ICogY2VsbEhlaWdodDtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHdpZHRoIDw9IDAgfHwgaGVpZ2h0IDw9IDApIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciBwb2ludGVyID0geCAqIGNlbGxXaWR0aCArIHkgKiBjYW52YXMud2lkdGggKiBjZWxsSGVpZ2h0LFxyXG4gICAgICAgIHJvd1dpZHRoID0gY2FudmFzLndpZHRoIC0gd2lkdGg7XHJcblxyXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGhlaWdodDsgaSsrKSB7XHJcbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCB3aWR0aDsgaisrKSB7XHJcbiAgICAgICAgICBpbWFnZURhdGFbcG9pbnRlcl0gPSBjb2xvcjtcclxuXHJcbiAgICAgICAgICBwb2ludGVyKys7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHBvaW50ZXIgKz0gcm93V2lkdGg7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5yZW5kZXIgPSAod29ybGQsIGRpZmYpID0+IHtcclxuICAgICAgZm9yIChsZXQgaW5kZXggb2YgZGlmZikge1xyXG4gICAgICAgIGZpbGxTcXVhcmUoXHJcbiAgICAgICAgICBpbmRleCAlIGNvbHMsXHJcbiAgICAgICAgICBNYXRoLmZsb29yKGluZGV4IC8gY29scyksXHJcbiAgICAgICAgICB3b3JsZC5jZWxsc1tpbmRleF0gPT09IDFcclxuICAgICAgICAgICAgPyB0aGlzLmNvbG9yc1t3b3JsZC5uZWlnaGJvdXJzKGluZGV4KV1cclxuICAgICAgICAgICAgOiAvLyA/IGxpdmVDb2xvclxyXG4gICAgICAgICAgICAgIGRlYWRDb2xvclxyXG4gICAgICAgICk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKHRoaXMubW9kZWwucmVuZGVyQ2VudGVyKSB7XHJcbiAgICAgICAgZmlsbFNxdWFyZShNYXRoLnJvdW5kKGNvbHMgLyAyKSwgTWF0aC5yb3VuZChyb3dzIC8gMiksIGxpdmVDb2xvcik7XHJcbiAgICAgIH1cclxuICAgICAgY29udGV4dC5wdXRJbWFnZURhdGEoaW1hZ2UsIDAsIDApO1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLnJlc2V0ID0gbW9kZWwgPT4ge1xyXG4gICAgICByZXNldERhdGEoKTtcclxuICAgICAgdGhpcy5jb2xvcnMgPSBtb2RlbC5jb2xvcnMubWFwKGhleFRvUmdiKTtcclxuICAgICAgdGhpcy5tb2RlbCA9IG1vZGVsO1xyXG4gICAgICBjb250ZXh0LnB1dEltYWdlRGF0YShpbWFnZSwgMCwgMCk7XHJcbiAgICB9O1xyXG4gIH1cclxufVxyXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9DYW52YXNSZW5kZXJlci5qc1xuLy8gbW9kdWxlIGlkID0gM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyBzdGF0cy5qcyAtIGh0dHA6Ly9naXRodWIuY29tL21yZG9vYi9zdGF0cy5qc1xyXG4oZnVuY3Rpb24oZixlKXtcIm9iamVjdFwiPT09dHlwZW9mIGV4cG9ydHMmJlwidW5kZWZpbmVkXCIhPT10eXBlb2YgbW9kdWxlP21vZHVsZS5leHBvcnRzPWUoKTpcImZ1bmN0aW9uXCI9PT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShlKTpmLlN0YXRzPWUoKX0pKHRoaXMsZnVuY3Rpb24oKXt2YXIgZj1mdW5jdGlvbigpe2Z1bmN0aW9uIGUoYSl7Yy5hcHBlbmRDaGlsZChhLmRvbSk7cmV0dXJuIGF9ZnVuY3Rpb24gdShhKXtmb3IodmFyIGQ9MDtkPGMuY2hpbGRyZW4ubGVuZ3RoO2QrKyljLmNoaWxkcmVuW2RdLnN0eWxlLmRpc3BsYXk9ZD09PWE/XCJibG9ja1wiOlwibm9uZVwiO2w9YX12YXIgbD0wLGM9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtjLnN0eWxlLmNzc1RleHQ9XCJwb3NpdGlvbjpmaXhlZDt0b3A6MDtsZWZ0OjA7Y3Vyc29yOnBvaW50ZXI7b3BhY2l0eTowLjk7ei1pbmRleDoxMDAwMFwiO2MuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsZnVuY3Rpb24oYSl7YS5wcmV2ZW50RGVmYXVsdCgpO1xyXG51KCsrbCVjLmNoaWxkcmVuLmxlbmd0aCl9LCExKTt2YXIgaz0ocGVyZm9ybWFuY2V8fERhdGUpLm5vdygpLGc9ayxhPTAscj1lKG5ldyBmLlBhbmVsKFwiRlBTXCIsXCIjMGZmXCIsXCIjMDAyXCIpKSxoPWUobmV3IGYuUGFuZWwoXCJNU1wiLFwiIzBmMFwiLFwiIzAyMFwiKSk7aWYoc2VsZi5wZXJmb3JtYW5jZSYmc2VsZi5wZXJmb3JtYW5jZS5tZW1vcnkpdmFyIHQ9ZShuZXcgZi5QYW5lbChcIk1CXCIsXCIjZjA4XCIsXCIjMjAxXCIpKTt1KDApO3JldHVybntSRVZJU0lPTjoxNixkb206YyxhZGRQYW5lbDplLHNob3dQYW5lbDp1LGJlZ2luOmZ1bmN0aW9uKCl7az0ocGVyZm9ybWFuY2V8fERhdGUpLm5vdygpfSxlbmQ6ZnVuY3Rpb24oKXthKys7dmFyIGM9KHBlcmZvcm1hbmNlfHxEYXRlKS5ub3coKTtoLnVwZGF0ZShjLWssMjAwKTtpZihjPmcrMUUzJiYoci51cGRhdGUoMUUzKmEvKGMtZyksMTAwKSxnPWMsYT0wLHQpKXt2YXIgZD1wZXJmb3JtYW5jZS5tZW1vcnk7dC51cGRhdGUoZC51c2VkSlNIZWFwU2l6ZS9cclxuMTA0ODU3NixkLmpzSGVhcFNpemVMaW1pdC8xMDQ4NTc2KX1yZXR1cm4gY30sdXBkYXRlOmZ1bmN0aW9uKCl7az10aGlzLmVuZCgpfSxkb21FbGVtZW50OmMsc2V0TW9kZTp1fX07Zi5QYW5lbD1mdW5jdGlvbihlLGYsbCl7dmFyIGM9SW5maW5pdHksaz0wLGc9TWF0aC5yb3VuZCxhPWcod2luZG93LmRldmljZVBpeGVsUmF0aW98fDEpLHI9ODAqYSxoPTQ4KmEsdD0zKmEsdj0yKmEsZD0zKmEsbT0xNSphLG49NzQqYSxwPTMwKmEscT1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO3Eud2lkdGg9cjtxLmhlaWdodD1oO3Euc3R5bGUuY3NzVGV4dD1cIndpZHRoOjgwcHg7aGVpZ2h0OjQ4cHhcIjt2YXIgYj1xLmdldENvbnRleHQoXCIyZFwiKTtiLmZvbnQ9XCJib2xkIFwiKzkqYStcInB4IEhlbHZldGljYSxBcmlhbCxzYW5zLXNlcmlmXCI7Yi50ZXh0QmFzZWxpbmU9XCJ0b3BcIjtiLmZpbGxTdHlsZT1sO2IuZmlsbFJlY3QoMCwwLHIsaCk7Yi5maWxsU3R5bGU9ZjtiLmZpbGxUZXh0KGUsdCx2KTtcclxuYi5maWxsUmVjdChkLG0sbixwKTtiLmZpbGxTdHlsZT1sO2IuZ2xvYmFsQWxwaGE9Ljk7Yi5maWxsUmVjdChkLG0sbixwKTtyZXR1cm57ZG9tOnEsdXBkYXRlOmZ1bmN0aW9uKGgsdyl7Yz1NYXRoLm1pbihjLGgpO2s9TWF0aC5tYXgoayxoKTtiLmZpbGxTdHlsZT1sO2IuZ2xvYmFsQWxwaGE9MTtiLmZpbGxSZWN0KDAsMCxyLG0pO2IuZmlsbFN0eWxlPWY7Yi5maWxsVGV4dChnKGgpK1wiIFwiK2UrXCIgKFwiK2coYykrXCItXCIrZyhrKStcIilcIix0LHYpO2IuZHJhd0ltYWdlKHEsZCthLG0sbi1hLHAsZCxtLG4tYSxwKTtiLmZpbGxSZWN0KGQrbi1hLG0sYSxwKTtiLmZpbGxTdHlsZT1sO2IuZ2xvYmFsQWxwaGE9Ljk7Yi5maWxsUmVjdChkK24tYSxtLGEsZygoMS1oL3cpKnApKX19fTtyZXR1cm4gZn0pO1xyXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2xpYi9zdGF0cy5taW4uanNcbi8vIG1vZHVsZSBpZCA9IDRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgT3B0aW9ucyB7XHJcbiAgY29uc3RydWN0b3IoZ3VpLCByZXNldCwgcGF1c2UsIHBsYXkpIHtcclxuICAgIHRoaXMubW9kZWwgPSB7XHJcbiAgICAgIGJpcnRoOiBcIjNcIixcclxuICAgICAgc3Vydml2YWw6IFwiMjNcIixcclxuICAgICAgcmFuZG9tU3RhcnQ6IHRydWUsXHJcbiAgICAgIGNvbG9yczogbmV3IEFycmF5KDkpLFxyXG4gICAgICB2aXNpYmxlOiB0cnVlLFxyXG4gICAgICByZW5kZXJDZW50ZXI6IGZhbHNlXHJcbiAgICB9O1xyXG4gICAgdGhpcy5tZXRob2RzID0ge1xyXG4gICAgICByZXNldDogKCkgPT4gcmVzZXQodGhpcy5tb2RlbCksXHJcbiAgICAgIHBhdXNlLFxyXG4gICAgICBwbGF5LFxyXG4gICAgICByZXNldENvbG9yczogKCkgPT4ge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5tb2RlbC5jb2xvcnMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgICB0aGlzLm1vZGVsLmNvbG9yc1tpXSA9IFwiI0ZGRkZGRlwiO1xyXG4gICAgICB9LFxyXG4gICAgICByYW5kb206ICgpID0+IHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubW9kZWwuY29sb3JzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICB0aGlzLm1vZGVsLmNvbG9yc1tpXSA9IHJhbmRvbUNvbG9yKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICByYW5kb21SdWxlczogKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGNoYW5jZUIgPSBNYXRoLnJhbmRvbSgpO1xyXG4gICAgICAgIGRvIHtcclxuICAgICAgICAgIHRoaXMubW9kZWwuYmlydGggPSBbMSwgMiwgMywgNCwgNSwgNiwgNywgOF1cclxuICAgICAgICAgICAgLmZpbHRlcihpID0+IE1hdGgucmFuZG9tKCkgPiBjaGFuY2VCKVxyXG4gICAgICAgICAgICAuam9pbigpXHJcbiAgICAgICAgICAgIC5yZXBsYWNlKC8sL2csIFwiXCIpO1xyXG4gICAgICAgIH0gd2hpbGUgKCF0aGlzLm1vZGVsLmJpcnRoKTtcclxuICAgICAgICBjb25zdCBjaGFuY2VTID0gTWF0aC5yYW5kb20oKTtcclxuICAgICAgICBkbyB7XHJcbiAgICAgICAgICB0aGlzLm1vZGVsLnN1cnZpdmFsID0gWzEsIDIsIDMsIDQsIDUsIDYsIDcsIDhdXHJcbiAgICAgICAgICAgIC5maWx0ZXIoaSA9PiBNYXRoLnJhbmRvbSgpID4gY2hhbmNlUylcclxuICAgICAgICAgICAgLmpvaW4oKVxyXG4gICAgICAgICAgICAucmVwbGFjZSgvLC9nLCBcIlwiKTtcclxuICAgICAgICB9IHdoaWxlICghdGhpcy5tb2RlbC5zdXJ2aXZhbCk7XHJcbiAgICAgIH0sXHJcbiAgICAgIGJsYWNrV2hpdGU6ICgpID0+IHRoaXMubWV0aG9kcy5yZXNldENvbG9ycygpLFxyXG4gICAgICB0d2VldDogKCkgPT5cclxuICAgICAgICB3aW5kb3cub3BlbihcclxuICAgICAgICAgIFwiaHR0cHM6Ly90d2l0dGVyLmNvbS9pbnRlbnQvdHdlZXQ/dGV4dD1IZWxsbyUyMHdvcmxkXCIsXHJcbiAgICAgICAgICBcIl9ibGFua1wiLFxyXG4gICAgICAgICAgXCJsb2NhdGlvbj15ZXNcIlxyXG4gICAgICAgICksXHJcbiAgICAgIGNvcHlMaW5rOiAoKSA9PiB7XHJcbiAgICAgICAgY29uc3Qgc3RyID0gYnRvYShKU09OLnN0cmluZ2lmeSh0aGlzLm1vZGVsKSk7XHJcbiAgICAgICAgY29uc29sZS5sb2coc3RyKTtcclxuICAgICAgfSxcclxuICAgICAgYWJvdXQ6ICgpID0+IHtcclxuICAgICAgICBtaXhwYW5lbC50cmFjayhcIkFib3V0IENsaWNrXCIpO1xyXG4gICAgICAgIHdpbmRvdy5vcGVuKFxyXG4gICAgICAgICAgXCJodHRwczovL2dpdGh1Yi5jb20vb2RlZHcvY2VsbHVsYXItYXV0b21hdGEtcGxheWdyb3VuZC9ibG9iL21hc3Rlci9SRUFETUUubWRcIixcclxuICAgICAgICAgIFwiX2JsYW5rXCJcclxuICAgICAgICApO1xyXG4gICAgICB9LFxyXG4gICAgICBnbzogKCkgPT4ge1xyXG4gICAgICAgIG1peHBhbmVsLnRyYWNrKFwiR28gQ2xpY2tcIiwge1xyXG4gICAgICAgICAgUnVsZXM6IGBCJHt0aGlzLm1vZGVsLmJpcnRofS9TJHt0aGlzLm1vZGVsLnN1cnZpdmFsfWBcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXNldCh0aGlzLm1vZGVsKTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuICAgIGNvbnN0IGxldHRlcnMgPSBcIjAxMjM0NTY3ODlBQkNERUZcIixcclxuICAgICAgcmFuZG9tQ29sb3IgPSAoKSA9PiB7XHJcbiAgICAgICAgbGV0IGNvbG9yID0gXCIjXCI7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA2OyBpKyspIHtcclxuICAgICAgICAgIGNvbG9yICs9IGxldHRlcnNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTYpXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGNvbG9yO1xyXG4gICAgICB9O1xyXG5cclxuICAgIC8vcnVsZXNcclxuICAgIGNvbnN0IHJ1bGVzRm9sZGVyID0gZ3VpLmFkZEZvbGRlcihcInJ1bGVzXCIpO1xyXG4gICAgcnVsZXNGb2xkZXIuYWRkKHRoaXMubW9kZWwsIFwiYmlydGhcIikubGlzdGVuKCk7XHJcbiAgICBydWxlc0ZvbGRlci5hZGQodGhpcy5tb2RlbCwgXCJzdXJ2aXZhbFwiKS5saXN0ZW4oKTtcclxuICAgIHJ1bGVzRm9sZGVyLmFkZCh0aGlzLm1ldGhvZHMsIFwicmFuZG9tUnVsZXNcIikubmFtZShcInJhbmRvbVwiKTtcclxuXHJcbiAgICAvL2NvbG9yc1xyXG4gICAgY29uc3QgY29sb3JzRm9sZGVyID0gZ3VpLmFkZEZvbGRlcihcImNvbG9ycyBieSBuZWlnaGJvdXJzXCIpO1xyXG4gICAgdGhpcy5tZXRob2RzLnJlc2V0Q29sb3JzKCk7XHJcbiAgICBmb3IgKGxldCBpID0gMTsgaSA8IHRoaXMubW9kZWwuY29sb3JzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGNvbG9yc0ZvbGRlci5hZGRDb2xvcih0aGlzLm1vZGVsLmNvbG9ycywgaSkubGlzdGVuKCk7XHJcbiAgICB9XHJcbiAgICBjb2xvcnNGb2xkZXIuYWRkKHRoaXMubWV0aG9kcywgXCJyYW5kb21cIik7XHJcbiAgICBjb2xvcnNGb2xkZXIuYWRkKHRoaXMubWV0aG9kcywgXCJibGFja1doaXRlXCIpLm5hbWUoXCJibGFjayAmIHdoaXRlXCIpO1xyXG5cclxuICAgIGd1aVxyXG4gICAgICAuYWRkKHRoaXMubW9kZWwsIFwicmFuZG9tU3RhcnRcIilcclxuICAgICAgLm5hbWUoXCJyYW5kb20gc3RhcnRcIilcclxuICAgICAgLmxpc3RlbigpO1xyXG4gICAgZ3VpLmFkZCh0aGlzLm1ldGhvZHMsIFwiZ29cIikubmFtZShcInNldCAmIGdvXCIpO1xyXG4gICAgZ3VpLmFkZCh0aGlzLm1ldGhvZHMsIFwiYWJvdXRcIik7XHJcblxyXG4gICAgZ3VpLmNsb3NlZCA9IHRydWU7XHJcbiAgICBkb2N1bWVudC5vbmtleWRvd24gPSBldiA9PiB7XHJcbiAgICAgIGlmIChldi5rZXlDb2RlID09IDMyKSB7XHJcbiAgICAgICAgLy9zcGFjZVxyXG4gICAgICAgIHRoaXMubWV0aG9kcy5yZXNldCgpO1xyXG4gICAgICB9IGVsc2UgaWYgKGV2LmtleUNvZGUgPT0gODIpIHtcclxuICAgICAgICAvL3JcclxuICAgICAgICB0aGlzLm1vZGVsLnJhbmRvbVN0YXJ0ID0gIXRoaXMubW9kZWwucmFuZG9tU3RhcnQ7XHJcbiAgICAgIH0gZWxzZSBpZiAoZXYua2V5Q29kZSA9PSA2Nykge1xyXG4gICAgICAgIC8vY1xyXG4gICAgICAgIHRoaXMubWV0aG9kcy5yYW5kb20oKTtcclxuICAgICAgfSBlbHNlIGlmIChldi5rZXlDb2RlID09IDY2KSB7XHJcbiAgICAgICAgLy9jXHJcbiAgICAgICAgdGhpcy5tZXRob2RzLnJhbmRvbVJ1bGVzKCk7XHJcbiAgICAgIH0gZWxzZSBpZiAoZXYua2V5Q29kZSA9PSA2OCkge1xyXG4gICAgICAgIC8vZFxyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXHJcbiAgICAgICAgICBcImNsb3NlLWJ1dHRvblwiXHJcbiAgICAgICAgKVswXS5zdHlsZS52aXNpYmlsaXR5ID0gdGhpcy5tb2RlbC52aXNpYmxlID8gXCJoaWRkZW5cIiA6IFwiaW5pdGlhbFwiO1xyXG4gICAgICAgIHRoaXMubW9kZWwudmlzaWJsZSA9ICF0aGlzLm1vZGVsLnZpc2libGU7XHJcbiAgICAgIH0gZWxzZSBpZiAoZXYua2V5Q29kZSA9PSA2OSkge1xyXG4gICAgICAgIHRoaXMubW9kZWwucmVuZGVyQ2VudGVyID0gIXRoaXMubW9kZWwucmVuZGVyQ2VudGVyO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG4gIH1cclxufVxyXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9PcHRpb25zLmpzXG4vLyBtb2R1bGUgaWQgPSA1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJzb3VyY2VSb290IjoiIn0=