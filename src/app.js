import Engine from './Engine';
import Renderer from './Renderer';
import Stats from '../lib/stats.min';

const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

const pixelsPerCell = 5,
  canvas = document.getElementById('canvas'),
  cols = Math.ceil(canvas.clientWidth / pixelsPerCell),
  rows = Math.ceil(canvas.clientHeight / pixelsPerCell),
  renderer = new Renderer(canvas, cols, rows),
  engine = new Engine(
    cols, //number of columns
    rows, //number of rows
    renderer.render, //onTick
    60, //desired fps
    stats
  );

renderer.onDraw = engine.onDraw;
window.onload = engine.start;
