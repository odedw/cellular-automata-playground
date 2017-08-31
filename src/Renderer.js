export default class Renderer {
  constructor(canvas, fpsElem, cols, rows) {
    canvas.width *= 10;
    canvas.height *= 10;
    const context = canvas.getContext('2d'),
      cellWidth = Math.ceil(canvas.width / cols),
      cellHeight = Math.ceil(canvas.height / rows);
    let mouseDown = false;

    this.renderFps = value => (fpsElem.textContent = `${value.toFixed(2)} FPS`);
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

    canvas.addEventListener('mousedown', evt => {
      mouseDown = true;
      onDraw(evt);
    });

    canvas.addEventListener('mousemove', onDraw);
    canvas.addEventListener('mouseup', evt => (mouseDown = false));

    const colorForCell = (state, neighbours) => {
      return state === 0 ? '#282828' : 'white';
    };

    this.render = board => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = 'white';
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          const jPx = cellWidth * j;
          const iPx = cellHeight * i;
          context.fillStyle = colorForCell(
            board.get(i, j),
            board.neighbours(i, j)
          );
          context.fillRect(jPx, iPx, cellWidth, cellHeight);
        }
      }
    };
  }
}
