import Engine from './Engine';
import Renderer from './Renderer';

const canvas = document.getElementById('canvas'),
  cols = 300,
  rows = Math.ceil(canvas.clientHeight / (canvas.clientWidth / 100)),
  renderer = new Renderer(canvas, document.getElementById('fps'), cols, rows),
  engine = new Engine(
    canvas.clientWidth, //width
    canvas.clientHeight, //height
    cols, //number of columns
    rows, //number of rows
    renderer.render, //onTick
    60, //desired fps
    1000, //fps update interval
    renderer.renderFps //fps updated handler
  );

renderer.onDraw = engine.onDraw;
window.onload = engine.start;
