import World from './World';

export default class Engine {
  constructor(
    width,
    height,
    cols,
    rows,
    onTick,
    desiredFps,
    fpsUpdateInterval,
    fpsUpdated
  ) {
    let fps = 0,
      engineTime = 0,
      fpsTime = 0,
      frameNumber = 0,
      current = new World(rows, cols),
      next = new World(rows, cols);

    const cellSize = canvas.clientWidth / cols;

    const computeNextState = () => {
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          let neighbors = current.neighbours(i, j);

          if (neighbors === 3) next.set(i, j, 1);
          else if (neighbors === 2) next.set(i, j, current.get(i, j));
          else next.set(i, j, 0);
        }
      }
      const temp = current;
      current = next;
      next = temp;
    };

    const tick = timeStamp => {
      window.requestAnimationFrame(tick);

      const elapsed = timeStamp - engineTime;
      if (elapsed > 1000 / desiredFps) {
        computeNextState();
        frameNumber += 1;
        engineTime = timeStamp - elapsed % (1000 / desiredFps);
        onTick(current);
      }

      const fpsElapsed = timeStamp - fpsTime;
      if (fpsElapsed > fpsUpdateInterval && fpsUpdated) {
        fps = 1000 / fpsElapsed * frameNumber;
        fpsTime = timeStamp;
        frameNumber = 0;
        fpsUpdated(fps);
      }
    };

    this.start = () => {
      window.requestAnimationFrame(tick);
    };

    this.onDraw = (i, j) => {
      current.cross(i, j);
    };
  }
}
