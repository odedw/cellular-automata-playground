import Engine from './Engine';
import Renderer from './Renderer';
import Stats from '../lib/stats.min';
// import PIXI from '../lib/pixi.min';

const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

const pixelsPerCell = 3,
  cols = Math.ceil(window.innerWidth / pixelsPerCell),
  rows = Math.ceil(window.innerHeight / pixelsPerCell),
  renderer = new Renderer(cols, rows, pixelsPerCell, pixelsPerCell),
  engine = new Engine(
    cols, //number of columns
    rows, //number of rows
    renderer.render, //onTick
    30, //desired fps
    stats
  );

renderer.onDraw = engine.onDraw;
window.onload = engine.start;
