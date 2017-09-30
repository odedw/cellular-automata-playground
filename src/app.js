import Engine from "./Engine";
import Renderer from "./CanvasRenderer";
import Stats from "../lib/stats.min";
import Options from "./Options";

const stats = new Stats();
stats.showPanel(1);
// document.body.appendChild(stats.dom);

const pixelsPerCell = 4,
  cols = Math.ceil(window.innerWidth / pixelsPerCell),
  rows = Math.ceil(window.innerHeight / pixelsPerCell),
  renderer = new Renderer(cols, rows, pixelsPerCell, pixelsPerCell),
  engine = new Engine(
    cols, //number of columns
    rows, //number of rows
    renderer.render, //onTick
    60, //desired fps
    stats
  );
renderer.onDraw = engine.onDraw;
window.onload = () => {
  const gui = new dat.GUI();
  const options = new Options(
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
