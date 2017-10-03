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
      birth: '3',
      survival: '23',
      randomStart: true,
      colors: new Array(9)
    };
    this.methods = {
      reset: () => reset(this.model),
      pause,
      play,
      resetColors: () => {
        for (let i = 0; i < this.model.colors.length; i++)
          this.model.colors[i] = '#FFFFFF';
      },
      random: () => {
        for (let i = 0; i < this.model.colors.length; i++) {
          this.model.colors[i] = randomColor();
        }
      },
      blackWhite: () => this.methods.resetColors(),
      tweet: () =>
        window.open(
          'https://twitter.com/intent/tweet?text=Hello%20world',
          '_blank',
          'location=yes'
        ),
      copyLink: () => {
        const str = btoa(JSON.stringify(this.model));
        console.log(str);
      },
      about: () => {
        mixpanel.track('About Click');
        window.open(
          'https://github.com/odedw/cellular-automata-playground/blob/master/README.md',
          '_blank'
        );
      },
      go: () => {
        mixpanel.track('Go Click', {
          Rules: `B${this.model.birth}/S${this.model.survival}`
        });
        reset(this.model);
      }
    };
    const letters = '0123456789ABCDEF',
      randomColor = () => {
        let color = '#';
        for (let i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      };

    //rules
    const rulesFolder = gui.addFolder('rules');
    rulesFolder.add(this.model, 'birth');
    rulesFolder.add(this.model, 'survival');

    //colors
    const colorsFolder = gui.addFolder('colors by neighbours');
    this.methods.resetColors();
    for (let i = 1; i < this.model.colors.length; i++) {
      colorsFolder.addColor(this.model.colors, i).listen();
    }
    colorsFolder.add(this.methods, 'random');
    colorsFolder.add(this.methods, 'blackWhite').name('black & white');

    //share
    // const shareFolder = gui.addFolder("share");
    // shareFolder.add(this.methods, "tweet");
    // shareFolder.add(this.methods, "copyLink").name("copy link");

    gui
      .add(this.model, 'randomStart')
      .name('random start')
      .listen();
    gui.add(this.methods, 'go').name('set & go');
    gui.add(this.methods, 'about');

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgODhlNGI0NDFlNzE4NDQzNDY0Y2QiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FwcC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvRW5naW5lLmpzIiwid2VicGFjazovLy8uL3NyYy9Xb3JsZC5qcyIsIndlYnBhY2s6Ly8vLi9saWIvc3RhdHMubWluLmpzIiwid2VicGFjazovLy8uL3NyYy9PcHRpb25zLmpzIiwid2VicGFjazovLy8uL3NyYy9DYW52YXNSZW5kZXJlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7O0FDN0RBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7Ozs7Ozs7O0FDbENEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EscUJB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QUFrQztBQUN6RDtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EscUJBQXFCLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRTtBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLHFCQUFxQixZQUFZO0FBQ2pDLHVCQUF1QixXQUFXO0FBQ2xDOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDg4ZTRiNDQxZTcxODQ0MzQ2NGNkIiwiaW1wb3J0IEVuZ2luZSBmcm9tICcuL0VuZ2luZSc7XHJcbmltcG9ydCBSZW5kZXJlciBmcm9tICcuL0NhbnZhc1JlbmRlcmVyJztcclxuaW1wb3J0IFN0YXRzIGZyb20gJy4uL2xpYi9zdGF0cy5taW4nO1xyXG5pbXBvcnQgT3B0aW9ucyBmcm9tICcuL09wdGlvbnMnO1xyXG5cclxuY29uc3Qgc3RhdHMgPSBuZXcgU3RhdHMoKTtcclxuc3RhdHMuc2hvd1BhbmVsKDEpO1xyXG4vLyBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHN0YXRzLmRvbSk7XHJcblxyXG5jb25zdCBwaXhlbHNQZXJDZWxsID0gNCxcclxuICBjb2xzID0gTWF0aC5jZWlsKHdpbmRvdy5pbm5lcldpZHRoIC8gcGl4ZWxzUGVyQ2VsbCksXHJcbiAgcm93cyA9IE1hdGguY2VpbCh3aW5kb3cuaW5uZXJIZWlnaHQgLyBwaXhlbHNQZXJDZWxsKSxcclxuICByZW5kZXJlciA9IG5ldyBSZW5kZXJlcihjb2xzLCByb3dzLCBwaXhlbHNQZXJDZWxsLCBwaXhlbHNQZXJDZWxsKSxcclxuICBlbmdpbmUgPSBuZXcgRW5naW5lKFxyXG4gICAgY29scywgLy9udW1iZXIgb2YgY29sdW1uc1xyXG4gICAgcm93cywgLy9udW1iZXIgb2Ygcm93c1xyXG4gICAgcmVuZGVyZXIucmVuZGVyLCAvL29uVGlja1xyXG4gICAgMzAsIC8vZGVzaXJlZCBmcHNcclxuICAgIHN0YXRzXHJcbiAgKTtcclxucmVuZGVyZXIub25EcmF3ID0gZW5naW5lLm9uRHJhdztcclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiB7XHJcbiAgbWl4cGFuZWwudHJhY2soJ1ZpZXcnKTtcclxuICBjb25zdCBndWkgPSBuZXcgZGF0LkdVSSgpO1xyXG4gIGNvbnN0IG9wdGlvbnMgPSBuZXcgT3B0aW9ucyhcclxuICAgIGd1aSxcclxuICAgIG1vZGVsID0+IHtcclxuICAgICAgcmVuZGVyZXIucmVzZXQobW9kZWwpO1xyXG4gICAgICBlbmdpbmUuc3RhcnQobW9kZWwpO1xyXG4gICAgfSxcclxuICAgIGVuZ2luZS5wYXVzZSxcclxuICAgIGVuZ2luZS5wbGF5XHJcbiAgKTtcclxuICBvcHRpb25zLm1ldGhvZHMucmVzZXQoKTtcclxufSk7XHJcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2FwcC5qc1xuLy8gbW9kdWxlIGlkID0gMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgV29ybGQgZnJvbSBcIi4vV29ybGRcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRW5naW5lIHtcbiAgY29uc3RydWN0b3IoY29scywgcm93cywgb25UaWNrLCBkZXNpcmVkRnBzLCBzdGF0cykge1xuICAgIGxldCBlbmdpbmVUaW1lID0gMCxcbiAgICAgIGN1cnJlbnQsXG4gICAgICBuZXh0LFxuICAgICAgYmlydGggPSBcIlwiLFxuICAgICAgc3Vydml2YWwgPSBcIlwiLFxuICAgICAgcmFuZG9tU3RhcnQgPSBmYWxzZSxcbiAgICAgIGJpcnRoTWFwID0gbmV3IEFycmF5KDgpLFxuICAgICAgc3Vydml2YWxNYXAgPSBuZXcgQXJyYXkoOCksXG4gICAgICBtc1RpbGxOZXh0RnJhbWUgPSAwLFxuICAgICAgbGFzdFRpY2tUaW1lID0gMCxcbiAgICAgIHRvdGFsID0gcm93cyAqIGNvbHMsXG4gICAgICBpc1J1bm5pbmcgPSBmYWxzZTtcblxuICAgIGNvbnN0IG1zUGVyRnJhbWUgPSAxMDAwIC8gZGVzaXJlZEZwcztcblxuICAgIGNvbnN0IGNvbXB1dGVOZXh0U3RhdGUgPSAoKSA9PiB7XG4gICAgICBsZXQgbmV4dFN0YXRlID0gMDtcbiAgICAgIGNvbnN0IGRpZmYgPSBuZXcgU2V0KCk7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRvdGFsOyBpKyspIHtcbiAgICAgICAgbGV0IG5laWdoYm9ycyA9IGN1cnJlbnQubmVpZ2hib3VycyhpKSxcbiAgICAgICAgICBjdXJyZW50U3RhdGUgPSBjdXJyZW50LmdldChpKTtcblxuICAgICAgICBuZXh0U3RhdGUgPVxuICAgICAgICAgIGN1cnJlbnRTdGF0ZSA9PT0gMSA/IHN1cnZpdmFsTWFwW25laWdoYm9yc10gOiBiaXJ0aE1hcFtuZWlnaGJvcnNdO1xuICAgICAgICBuZXh0LnNldChpLCBuZXh0U3RhdGUpO1xuXG4gICAgICAgIGlmIChjdXJyZW50U3RhdGUgIT09IG5leHRTdGF0ZSkge1xuICAgICAgICAgIGRpZmYuYWRkKGkpO1xuICAgICAgICAgIGNvbnN0IG5laWdoYm91cnNJbmRpY2VzID0gY3VycmVudC5uZWlnaGJvdXJzSW5kaWNlc1tpXTtcbiAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IG5laWdoYm91cnNJbmRpY2VzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICBkaWZmLmFkZChuZWlnaGJvdXJzSW5kaWNlc1tqXSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBjb25zdCB0ZW1wID0gY3VycmVudDtcbiAgICAgIGN1cnJlbnQgPSBuZXh0O1xuICAgICAgbmV4dCA9IHRlbXA7XG4gICAgICByZXR1cm4gZGlmZjtcbiAgICB9O1xuXG4gICAgY29uc3QgdGljayA9ICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YXJ0VGltZSA9IHBlcmZvcm1hbmNlLm5vdygpLFxuICAgICAgICBtc0VsYXBzZWQgPSBzdGFydFRpbWUgLSBsYXN0VGlja1RpbWU7XG4gICAgICBtc1RpbGxOZXh0RnJhbWUgLT0gbXNFbGFwc2VkO1xuICAgICAgaWYgKG1zVGlsbE5leHRGcmFtZSA8PSAwKSB7XG4gICAgICAgIHN0YXRzLmJlZ2luKCk7XG4gICAgICAgIGNvbnN0IGRpZmYgPSBjb21wdXRlTmV4dFN0YXRlKCk7XG4gICAgICAgIG9uVGljayhjdXJyZW50LCBkaWZmKTtcbiAgICAgICAgc3RhdHMuZW5kKCk7XG4gICAgICAgIGxhc3RUaWNrVGltZSA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgICAgICBjb25zdCB0aW1lRm9yRnJhbWUgPSBsYXN0VGlja1RpbWUgLSBzdGFydFRpbWU7XG4gICAgICAgIG1zVGlsbE5leHRGcmFtZSA9IG1zUGVyRnJhbWUgLSB0aW1lRm9yRnJhbWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsYXN0VGlja1RpbWUgPSBwZXJmb3JtYW5jZS5ub3coKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGlzUnVubmluZykgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aWNrKTtcbiAgICB9O1xuXG4gICAgY29uc3Qgc2V0TW9kZWwgPSBtb2RlbCA9PiB7XG4gICAgICBiaXJ0aCA9IG1vZGVsLmJpcnRoIHx8IFwiM1wiO1xuICAgICAgc3Vydml2YWwgPSBtb2RlbC5zdXJ2aXZhbCB8fCBcIjIzXCI7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDg7IGkrKykge1xuICAgICAgICBiaXJ0aE1hcFtpXSA9IGJpcnRoLmluZGV4T2YoaSkgPj0gMCA/IDEgOiAwO1xuICAgICAgICBzdXJ2aXZhbE1hcFtpXSA9IHN1cnZpdmFsLmluZGV4T2YoaSkgPj0gMCA/IDEgOiAwO1xuICAgICAgfVxuXG4gICAgICByYW5kb21TdGFydCA9IG1vZGVsLnJhbmRvbVN0YXJ0O1xuICAgIH07XG5cbiAgICB0aGlzLnN0YXJ0ID0gbW9kZWwgPT4ge1xuICAgICAgc2V0TW9kZWwobW9kZWwpO1xuICAgICAgY3VycmVudCA9IG5ldyBXb3JsZChyb3dzLCBjb2xzLCByYW5kb21TdGFydCk7XG4gICAgICBuZXh0ID0gbmV3IFdvcmxkKHJvd3MsIGNvbHMpO1xuICAgICAgaXNSdW5uaW5nID0gdHJ1ZTtcbiAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGljayk7XG4gICAgfTtcblxuICAgIHRoaXMucGF1c2UgPSAoKSA9PiB7XG4gICAgICBpc1J1bm5pbmcgPSBmYWxzZTtcbiAgICB9O1xuXG4gICAgdGhpcy5wbGF5ID0gKCkgPT4ge1xuICAgICAgaXNSdW5uaW5nID0gdHJ1ZTtcbiAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGljayk7XG4gICAgfTtcblxuICAgIHRoaXMub25EcmF3ID0gKGksIGopID0+IHtcbiAgICAgIGN1cnJlbnQuY3Jvc3MoaSwgaik7XG4gICAgfTtcbiAgfVxufVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvRW5naW5lLmpzXG4vLyBtb2R1bGUgaWQgPSAxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIFdvcmxkIHtcbiAgY29uc3RydWN0b3Iocm93cywgY29scywgcmFuZG9tU3RhcnQpIHtcbiAgICB0aGlzLmNlbGxzID0gbmV3IFVpbnQ4QXJyYXkobmV3IEFycmF5QnVmZmVyKHJvd3MgKiBjb2xzKSk7XG4gICAgY29uc3QgaW5kZXggPSAoaSwgaikgPT4gaSAqIGNvbHMgKyBqO1xuICAgIHRoaXMubmVpZ2hib3Vyc0luZGljZXMgPSBuZXcgQXJyYXkoY29scyAqIHJvd3MpO1xuICAgIHRoaXMuZ2V0ID0gaSA9PlxuICAgICAgaSA+PSAwICYmIGkgPCB0aGlzLmNlbGxzLmxlbmd0aCA/IHRoaXMuY2VsbHNbaV0gOiB1bmRlZmluZWQ7XG5cbiAgICB0aGlzLnNldCA9IChpLCB2YWwpID0+ICh0aGlzLmNlbGxzW2ldID0gdmFsKTtcblxuICAgIHRoaXMuY3Jvc3MgPSAoaSwgaikgPT4ge1xuICAgICAgaWYgKGkgLSAxID4gMCkgdGhpcy5jZWxsc1tpbmRleChpIC0gMSwgaildID0gMTtcbiAgICAgIGlmIChqIC0gMSA+IDApIHRoaXMuY2VsbHNbaW5kZXgoaSwgaiAtIDEpXSA9IDE7XG4gICAgICB0aGlzLmNlbGxzW2luZGV4KGksIGopXSA9IDE7XG4gICAgICBpZiAoaiArIDEgPiBjb2xzKSB0aGlzLmNlbGxzW2luZGV4KGksIGogKyAxKV0gPSAxO1xuICAgICAgaWYgKGkgKyAxIDwgcm93cykgdGhpcy5jZWxsc1tpbmRleChpICsgMSwgaildID0gMTtcbiAgICB9O1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCByb3dzOyBpKyspIHtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgY29sczsgaisrKSB7XG4gICAgICAgIHRoaXMubmVpZ2hib3Vyc0luZGljZXNbaW5kZXgoaSwgaildID0gW107XG4gICAgICAgIGlmIChpIC0gMSA+PSAwICYmIGogLSAxID49IDApXG4gICAgICAgICAgdGhpcy5uZWlnaGJvdXJzSW5kaWNlc1tpbmRleChpLCBqKV0ucHVzaChpbmRleChpIC0gMSwgaiAtIDEpKTtcbiAgICAgICAgaWYgKGkgLSAxID49IDApXG4gICAgICAgICAgdGhpcy5uZWlnaGJvdXJzSW5kaWNlc1tpbmRleChpLCBqKV0ucHVzaChpbmRleChpIC0gMSwgaikpO1xuICAgICAgICBpZiAoaSAtIDEgPj0gMCAmJiBqICsgMSA8IGNvbHMpXG4gICAgICAgICAgdGhpcy5uZWlnaGJvdXJzSW5kaWNlc1tpbmRleChpLCBqKV0ucHVzaChpbmRleChpIC0gMSwgaiArIDEpKTtcblxuICAgICAgICBpZiAoaiAtIDEgPj0gMClcbiAgICAgICAgICB0aGlzLm5laWdoYm91cnNJbmRpY2VzW2luZGV4KGksIGopXS5wdXNoKGluZGV4KGksIGogLSAxKSk7XG4gICAgICAgIGlmIChqICsgMSA8IGNvbHMpXG4gICAgICAgICAgdGhpcy5uZWlnaGJvdXJzSW5kaWNlc1tpbmRleChpLCBqKV0ucHVzaChpbmRleChpLCBqICsgMSkpO1xuXG4gICAgICAgIGlmIChpICsgMSA8IHJvd3MgJiYgaiAtIDEgPj0gMClcbiAgICAgICAgICB0aGlzLm5laWdoYm91cnNJbmRpY2VzW2luZGV4KGksIGopXS5wdXNoKGluZGV4KGkgKyAxLCBqIC0gMSkpO1xuICAgICAgICBpZiAoaSArIDEgPCByb3dzKVxuICAgICAgICAgIHRoaXMubmVpZ2hib3Vyc0luZGljZXNbaW5kZXgoaSwgaildLnB1c2goaW5kZXgoaSArIDEsIGopKTtcbiAgICAgICAgaWYgKGkgKyAxIDwgcm93cyAmJiBqICsgMSA8IGNvbHMpXG4gICAgICAgICAgdGhpcy5uZWlnaGJvdXJzSW5kaWNlc1tpbmRleChpLCBqKV0ucHVzaChpbmRleChpICsgMSwgaiArIDEpKTtcbiAgICAgIH1cbiAgICB9XG4gICAgY29uc3QgY291bnQgPSAoYSwgYikgPT4gYSArIHRoaXMuY2VsbHNbYl07XG4gICAgdGhpcy5uZWlnaGJvdXJzID0gaSA9PiB0aGlzLm5laWdoYm91cnNJbmRpY2VzW2ldLnJlZHVjZShjb3VudCwgMCk7XG5cbiAgICBpZiAocmFuZG9tU3RhcnQpXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY2VsbHMubGVuZ3RoOyBpKyspXG4gICAgICAgIHRoaXMuY2VsbHNbaV0gPSBNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkpO1xuICB9XG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9Xb3JsZC5qc1xuLy8gbW9kdWxlIGlkID0gMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyBzdGF0cy5qcyAtIGh0dHA6Ly9naXRodWIuY29tL21yZG9vYi9zdGF0cy5qc1xuKGZ1bmN0aW9uKGYsZSl7XCJvYmplY3RcIj09PXR5cGVvZiBleHBvcnRzJiZcInVuZGVmaW5lZFwiIT09dHlwZW9mIG1vZHVsZT9tb2R1bGUuZXhwb3J0cz1lKCk6XCJmdW5jdGlvblwiPT09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoZSk6Zi5TdGF0cz1lKCl9KSh0aGlzLGZ1bmN0aW9uKCl7dmFyIGY9ZnVuY3Rpb24oKXtmdW5jdGlvbiBlKGEpe2MuYXBwZW5kQ2hpbGQoYS5kb20pO3JldHVybiBhfWZ1bmN0aW9uIHUoYSl7Zm9yKHZhciBkPTA7ZDxjLmNoaWxkcmVuLmxlbmd0aDtkKyspYy5jaGlsZHJlbltkXS5zdHlsZS5kaXNwbGF5PWQ9PT1hP1wiYmxvY2tcIjpcIm5vbmVcIjtsPWF9dmFyIGw9MCxjPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7Yy5zdHlsZS5jc3NUZXh0PVwicG9zaXRpb246Zml4ZWQ7dG9wOjA7bGVmdDowO2N1cnNvcjpwb2ludGVyO29wYWNpdHk6MC45O3otaW5kZXg6MTAwMDBcIjtjLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLGZ1bmN0aW9uKGEpe2EucHJldmVudERlZmF1bHQoKTtcbnUoKytsJWMuY2hpbGRyZW4ubGVuZ3RoKX0sITEpO3ZhciBrPShwZXJmb3JtYW5jZXx8RGF0ZSkubm93KCksZz1rLGE9MCxyPWUobmV3IGYuUGFuZWwoXCJGUFNcIixcIiMwZmZcIixcIiMwMDJcIikpLGg9ZShuZXcgZi5QYW5lbChcIk1TXCIsXCIjMGYwXCIsXCIjMDIwXCIpKTtpZihzZWxmLnBlcmZvcm1hbmNlJiZzZWxmLnBlcmZvcm1hbmNlLm1lbW9yeSl2YXIgdD1lKG5ldyBmLlBhbmVsKFwiTUJcIixcIiNmMDhcIixcIiMyMDFcIikpO3UoMCk7cmV0dXJue1JFVklTSU9OOjE2LGRvbTpjLGFkZFBhbmVsOmUsc2hvd1BhbmVsOnUsYmVnaW46ZnVuY3Rpb24oKXtrPShwZXJmb3JtYW5jZXx8RGF0ZSkubm93KCl9LGVuZDpmdW5jdGlvbigpe2ErKzt2YXIgYz0ocGVyZm9ybWFuY2V8fERhdGUpLm5vdygpO2gudXBkYXRlKGMtaywyMDApO2lmKGM+ZysxRTMmJihyLnVwZGF0ZSgxRTMqYS8oYy1nKSwxMDApLGc9YyxhPTAsdCkpe3ZhciBkPXBlcmZvcm1hbmNlLm1lbW9yeTt0LnVwZGF0ZShkLnVzZWRKU0hlYXBTaXplL1xuMTA0ODU3NixkLmpzSGVhcFNpemVMaW1pdC8xMDQ4NTc2KX1yZXR1cm4gY30sdXBkYXRlOmZ1bmN0aW9uKCl7az10aGlzLmVuZCgpfSxkb21FbGVtZW50OmMsc2V0TW9kZTp1fX07Zi5QYW5lbD1mdW5jdGlvbihlLGYsbCl7dmFyIGM9SW5maW5pdHksaz0wLGc9TWF0aC5yb3VuZCxhPWcod2luZG93LmRldmljZVBpeGVsUmF0aW98fDEpLHI9ODAqYSxoPTQ4KmEsdD0zKmEsdj0yKmEsZD0zKmEsbT0xNSphLG49NzQqYSxwPTMwKmEscT1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO3Eud2lkdGg9cjtxLmhlaWdodD1oO3Euc3R5bGUuY3NzVGV4dD1cIndpZHRoOjgwcHg7aGVpZ2h0OjQ4cHhcIjt2YXIgYj1xLmdldENvbnRleHQoXCIyZFwiKTtiLmZvbnQ9XCJib2xkIFwiKzkqYStcInB4IEhlbHZldGljYSxBcmlhbCxzYW5zLXNlcmlmXCI7Yi50ZXh0QmFzZWxpbmU9XCJ0b3BcIjtiLmZpbGxTdHlsZT1sO2IuZmlsbFJlY3QoMCwwLHIsaCk7Yi5maWxsU3R5bGU9ZjtiLmZpbGxUZXh0KGUsdCx2KTtcbmIuZmlsbFJlY3QoZCxtLG4scCk7Yi5maWxsU3R5bGU9bDtiLmdsb2JhbEFscGhhPS45O2IuZmlsbFJlY3QoZCxtLG4scCk7cmV0dXJue2RvbTpxLHVwZGF0ZTpmdW5jdGlvbihoLHcpe2M9TWF0aC5taW4oYyxoKTtrPU1hdGgubWF4KGssaCk7Yi5maWxsU3R5bGU9bDtiLmdsb2JhbEFscGhhPTE7Yi5maWxsUmVjdCgwLDAscixtKTtiLmZpbGxTdHlsZT1mO2IuZmlsbFRleHQoZyhoKStcIiBcIitlK1wiIChcIitnKGMpK1wiLVwiK2coaykrXCIpXCIsdCx2KTtiLmRyYXdJbWFnZShxLGQrYSxtLG4tYSxwLGQsbSxuLWEscCk7Yi5maWxsUmVjdChkK24tYSxtLGEscCk7Yi5maWxsU3R5bGU9bDtiLmdsb2JhbEFscGhhPS45O2IuZmlsbFJlY3QoZCtuLWEsbSxhLGcoKDEtaC93KSpwKSl9fX07cmV0dXJuIGZ9KTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbGliL3N0YXRzLm1pbi5qc1xuLy8gbW9kdWxlIGlkID0gNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBPcHRpb25zIHtcbiAgY29uc3RydWN0b3IoZ3VpLCByZXNldCwgcGF1c2UsIHBsYXkpIHtcbiAgICB0aGlzLm1vZGVsID0ge1xuICAgICAgYmlydGg6ICczJyxcbiAgICAgIHN1cnZpdmFsOiAnMjMnLFxuICAgICAgcmFuZG9tU3RhcnQ6IHRydWUsXG4gICAgICBjb2xvcnM6IG5ldyBBcnJheSg5KVxuICAgIH07XG4gICAgdGhpcy5tZXRob2RzID0ge1xuICAgICAgcmVzZXQ6ICgpID0+IHJlc2V0KHRoaXMubW9kZWwpLFxuICAgICAgcGF1c2UsXG4gICAgICBwbGF5LFxuICAgICAgcmVzZXRDb2xvcnM6ICgpID0+IHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLm1vZGVsLmNvbG9ycy5sZW5ndGg7IGkrKylcbiAgICAgICAgICB0aGlzLm1vZGVsLmNvbG9yc1tpXSA9ICcjRkZGRkZGJztcbiAgICAgIH0sXG4gICAgICByYW5kb206ICgpID0+IHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLm1vZGVsLmNvbG9ycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIHRoaXMubW9kZWwuY29sb3JzW2ldID0gcmFuZG9tQ29sb3IoKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGJsYWNrV2hpdGU6ICgpID0+IHRoaXMubWV0aG9kcy5yZXNldENvbG9ycygpLFxuICAgICAgdHdlZXQ6ICgpID0+XG4gICAgICAgIHdpbmRvdy5vcGVuKFxuICAgICAgICAgICdodHRwczovL3R3aXR0ZXIuY29tL2ludGVudC90d2VldD90ZXh0PUhlbGxvJTIwd29ybGQnLFxuICAgICAgICAgICdfYmxhbmsnLFxuICAgICAgICAgICdsb2NhdGlvbj15ZXMnXG4gICAgICAgICksXG4gICAgICBjb3B5TGluazogKCkgPT4ge1xuICAgICAgICBjb25zdCBzdHIgPSBidG9hKEpTT04uc3RyaW5naWZ5KHRoaXMubW9kZWwpKTtcbiAgICAgICAgY29uc29sZS5sb2coc3RyKTtcbiAgICAgIH0sXG4gICAgICBhYm91dDogKCkgPT4ge1xuICAgICAgICBtaXhwYW5lbC50cmFjaygnQWJvdXQgQ2xpY2snKTtcbiAgICAgICAgd2luZG93Lm9wZW4oXG4gICAgICAgICAgJ2h0dHBzOi8vZ2l0aHViLmNvbS9vZGVkdy9jZWxsdWxhci1hdXRvbWF0YS1wbGF5Z3JvdW5kL2Jsb2IvbWFzdGVyL1JFQURNRS5tZCcsXG4gICAgICAgICAgJ19ibGFuaydcbiAgICAgICAgKTtcbiAgICAgIH0sXG4gICAgICBnbzogKCkgPT4ge1xuICAgICAgICBtaXhwYW5lbC50cmFjaygnR28gQ2xpY2snLCB7XG4gICAgICAgICAgUnVsZXM6IGBCJHt0aGlzLm1vZGVsLmJpcnRofS9TJHt0aGlzLm1vZGVsLnN1cnZpdmFsfWBcbiAgICAgICAgfSk7XG4gICAgICAgIHJlc2V0KHRoaXMubW9kZWwpO1xuICAgICAgfVxuICAgIH07XG4gICAgY29uc3QgbGV0dGVycyA9ICcwMTIzNDU2Nzg5QUJDREVGJyxcbiAgICAgIHJhbmRvbUNvbG9yID0gKCkgPT4ge1xuICAgICAgICBsZXQgY29sb3IgPSAnIyc7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNjsgaSsrKSB7XG4gICAgICAgICAgY29sb3IgKz0gbGV0dGVyc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxNildO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb2xvcjtcbiAgICAgIH07XG5cbiAgICAvL3J1bGVzXG4gICAgY29uc3QgcnVsZXNGb2xkZXIgPSBndWkuYWRkRm9sZGVyKCdydWxlcycpO1xuICAgIHJ1bGVzRm9sZGVyLmFkZCh0aGlzLm1vZGVsLCAnYmlydGgnKTtcbiAgICBydWxlc0ZvbGRlci5hZGQodGhpcy5tb2RlbCwgJ3N1cnZpdmFsJyk7XG5cbiAgICAvL2NvbG9yc1xuICAgIGNvbnN0IGNvbG9yc0ZvbGRlciA9IGd1aS5hZGRGb2xkZXIoJ2NvbG9ycyBieSBuZWlnaGJvdXJzJyk7XG4gICAgdGhpcy5tZXRob2RzLnJlc2V0Q29sb3JzKCk7XG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPCB0aGlzLm1vZGVsLmNvbG9ycy5sZW5ndGg7IGkrKykge1xuICAgICAgY29sb3JzRm9sZGVyLmFkZENvbG9yKHRoaXMubW9kZWwuY29sb3JzLCBpKS5saXN0ZW4oKTtcbiAgICB9XG4gICAgY29sb3JzRm9sZGVyLmFkZCh0aGlzLm1ldGhvZHMsICdyYW5kb20nKTtcbiAgICBjb2xvcnNGb2xkZXIuYWRkKHRoaXMubWV0aG9kcywgJ2JsYWNrV2hpdGUnKS5uYW1lKCdibGFjayAmIHdoaXRlJyk7XG5cbiAgICAvL3NoYXJlXG4gICAgLy8gY29uc3Qgc2hhcmVGb2xkZXIgPSBndWkuYWRkRm9sZGVyKFwic2hhcmVcIik7XG4gICAgLy8gc2hhcmVGb2xkZXIuYWRkKHRoaXMubWV0aG9kcywgXCJ0d2VldFwiKTtcbiAgICAvLyBzaGFyZUZvbGRlci5hZGQodGhpcy5tZXRob2RzLCBcImNvcHlMaW5rXCIpLm5hbWUoXCJjb3B5IGxpbmtcIik7XG5cbiAgICBndWlcbiAgICAgIC5hZGQodGhpcy5tb2RlbCwgJ3JhbmRvbVN0YXJ0JylcbiAgICAgIC5uYW1lKCdyYW5kb20gc3RhcnQnKVxuICAgICAgLmxpc3RlbigpO1xuICAgIGd1aS5hZGQodGhpcy5tZXRob2RzLCAnZ28nKS5uYW1lKCdzZXQgJiBnbycpO1xuICAgIGd1aS5hZGQodGhpcy5tZXRob2RzLCAnYWJvdXQnKTtcblxuICAgIGd1aS5jbG9zZWQgPSB0cnVlO1xuICAgIGRvY3VtZW50Lm9ua2V5ZG93biA9IGV2ID0+IHtcbiAgICAgIGlmIChldi5rZXlDb2RlID09IDMyKSB7XG4gICAgICAgIC8vc3BhY2VcbiAgICAgICAgdGhpcy5tZXRob2RzLnJlc2V0KCk7XG4gICAgICB9IGVsc2UgaWYgKGV2LmtleUNvZGUgPT0gODIpIHtcbiAgICAgICAgLy9yXG4gICAgICAgIHRoaXMubW9kZWwucmFuZG9tU3RhcnQgPSAhdGhpcy5tb2RlbC5yYW5kb21TdGFydDtcbiAgICAgIH0gZWxzZSBpZiAoZXYua2V5Q29kZSA9PSA2Nykge1xuICAgICAgICAvL2NcbiAgICAgICAgdGhpcy5tZXRob2RzLnJhbmRvbSgpO1xuICAgICAgfVxuICAgIH07XG4gIH1cbn1cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL09wdGlvbnMuanNcbi8vIG1vZHVsZSBpZCA9IDVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVuZGVyZXIge1xuICBjb25zdHJ1Y3Rvcihjb2xzLCByb3dzLCBjZWxsV2lkdGgsIGNlbGxIZWlnaHQpIHtcbiAgICBjb25zdCBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpLFxuICAgICAgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChjYW52YXMpO1xuICAgIGNhbnZhcy53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgIGNhbnZhcy5oZWlnaHQgPSBkb2N1bWVudC5ib2R5Lm9mZnNldEhlaWdodDtcbiAgICBjb25zdCBpbWFnZSA9IGNvbnRleHQuY3JlYXRlSW1hZ2VEYXRhKGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCksXG4gICAgICBpbWFnZURhdGEgPSBuZXcgSW50MzJBcnJheShpbWFnZS5kYXRhLmJ1ZmZlciksXG4gICAgICByZXNldERhdGEgPSAoKSA9PiB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2FudmFzLndpZHRoICogY2FudmFzLmhlaWdodDsgaSsrKSB7XG4gICAgICAgICAgaW1hZ2VEYXRhW2ldID0gMHhmZiA8PCAyNDtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgIGxldCBtb3VzZURvd24gPSBmYWxzZTtcblxuICAgIGNvbnN0IG9uRHJhdyA9IGV2ZW50ID0+IHtcbiAgICAgIGlmICghbW91c2VEb3duKSByZXR1cm47XG5cbiAgICAgIGNvbnN0IHJlY3QgPSBjYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICBjb25zdCBtb3VzZVBvcyA9IHtcbiAgICAgICAgeDogZXZlbnQuY2xpZW50WCAqIGNhbnZhcy53aWR0aCAvIGNhbnZhcy5jbGllbnRXaWR0aCxcbiAgICAgICAgeTogZXZlbnQuY2xpZW50WSAqIGNhbnZhcy5oZWlnaHQgLyBjYW52YXMuY2xpZW50SGVpZ2h0XG4gICAgICB9O1xuICAgICAgY29uc3QgcG9zID0ge1xuICAgICAgICBpOiB+fihtb3VzZVBvcy55IC8gY2VsbEhlaWdodCksXG4gICAgICAgIGo6IH5+KG1vdXNlUG9zLnggLyBjZWxsV2lkdGgpXG4gICAgICB9O1xuXG4gICAgICB0aGlzLm9uRHJhdyhwb3MuaSwgcG9zLmopO1xuICAgIH07XG5cbiAgICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBldnQgPT4ge1xuICAgICAgbW91c2VEb3duID0gdHJ1ZTtcbiAgICAgIG9uRHJhdyhldnQpO1xuICAgIH0pO1xuXG4gICAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgb25EcmF3KTtcbiAgICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgZXZ0ID0+IChtb3VzZURvd24gPSBmYWxzZSkpO1xuXG4gICAgY29uc3QgbGl2ZUNvbG9yID0gMHhmZiB8ICgweGZmIDw8IDgpIHwgKDB4ZmYgPDwgMTYpIHwgKDB4ZmYgPDwgMjQpLFxuICAgICAgZGVhZENvbG9yID0gMHgwMCB8ICgweDAwIDw8IDgpIHwgKDB4MDAgPDwgMTYpIHwgKDB4ZmYgPDwgMjQpO1xuXG4gICAgY29uc3QgaGV4VG9SZ2IgPSBoZXggPT4ge1xuICAgICAgY29uc3QgcmVzdWx0ID1cbiAgICAgICAgL14jPyhbYS1mXFxkXXsyfSkoW2EtZlxcZF17Mn0pKFthLWZcXGRdezJ9KSQvaS5leGVjKGhleCkgfHwgXCIjMDAwMDAwXCI7XG4gICAgICByZXR1cm4gKFxuICAgICAgICBwYXJzZUludChyZXN1bHRbMV0sIDE2KSB8XG4gICAgICAgIChwYXJzZUludChyZXN1bHRbMl0sIDE2KSA8PCA4KSB8XG4gICAgICAgIChwYXJzZUludChyZXN1bHRbM10sIDE2KSA8PCAxNikgfFxuICAgICAgICAoMHhmZiA8PCAyNClcbiAgICAgICk7XG4gICAgfTtcbiAgICBjb25zdCBmaWxsU3F1YXJlID0gKHgsIHksIGNvbG9yKSA9PiB7XG4gICAgICB2YXIgd2lkdGggPSBjZWxsV2lkdGgsXG4gICAgICAgIGhlaWdodCA9IGNlbGxIZWlnaHQ7XG5cbiAgICAgIGlmICh4ICogY2VsbFdpZHRoICsgd2lkdGggPiBjYW52YXMud2lkdGgpIHtcbiAgICAgICAgd2lkdGggPSBjYW52YXMud2lkdGggLSB4ICogY2VsbFdpZHRoO1xuICAgICAgfVxuXG4gICAgICBpZiAoeSAqIGNlbGxIZWlnaHQgKyBoZWlnaHQgPiBjYW52YXMuaGVpZ2h0KSB7XG4gICAgICAgIGhlaWdodCA9IGNhbnZhcy5oZWlnaHQgLSB5ICogY2VsbEhlaWdodDtcbiAgICAgIH1cblxuICAgICAgaWYgKHdpZHRoIDw9IDAgfHwgaGVpZ2h0IDw9IDApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YXIgcG9pbnRlciA9IHggKiBjZWxsV2lkdGggKyB5ICogY2FudmFzLndpZHRoICogY2VsbEhlaWdodCxcbiAgICAgICAgcm93V2lkdGggPSBjYW52YXMud2lkdGggLSB3aWR0aDtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBoZWlnaHQ7IGkrKykge1xuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHdpZHRoOyBqKyspIHtcbiAgICAgICAgICBpbWFnZURhdGFbcG9pbnRlcl0gPSBjb2xvcjtcblxuICAgICAgICAgIHBvaW50ZXIrKztcbiAgICAgICAgfVxuICAgICAgICBwb2ludGVyICs9IHJvd1dpZHRoO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB0aGlzLnJlbmRlciA9ICh3b3JsZCwgZGlmZikgPT4ge1xuICAgICAgZm9yIChsZXQgaW5kZXggb2YgZGlmZikge1xuICAgICAgICBmaWxsU3F1YXJlKFxuICAgICAgICAgIGluZGV4ICUgY29scyxcbiAgICAgICAgICBNYXRoLmZsb29yKGluZGV4IC8gY29scyksXG4gICAgICAgICAgd29ybGQuY2VsbHNbaW5kZXhdID09PSAxXG4gICAgICAgICAgICA/IHRoaXMuY29sb3JzW3dvcmxkLm5laWdoYm91cnMoaW5kZXgpXVxuICAgICAgICAgICAgOiAvLyA/IGxpdmVDb2xvclxuICAgICAgICAgICAgICBkZWFkQ29sb3JcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIGNvbnRleHQucHV0SW1hZ2VEYXRhKGltYWdlLCAwLCAwKTtcbiAgICB9O1xuXG4gICAgdGhpcy5yZXNldCA9IG1vZGVsID0+IHtcbiAgICAgIHJlc2V0RGF0YSgpO1xuICAgICAgdGhpcy5jb2xvcnMgPSBtb2RlbC5jb2xvcnMubWFwKGhleFRvUmdiKTtcbiAgICAgIGNvbnRleHQucHV0SW1hZ2VEYXRhKGltYWdlLCAwLCAwKTtcbiAgICB9O1xuICB9XG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9DYW52YXNSZW5kZXJlci5qc1xuLy8gbW9kdWxlIGlkID0gOFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9