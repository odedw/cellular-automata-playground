export default class Renderer {
  constructor(canvas, cols, rows) {
    canvas.width *= 10;
    canvas.height *= 10;
    const context = canvas.getContext('2d'),
      cellWidth = Math.ceil(canvas.width / cols),
      cellHeight = Math.ceil(canvas.height / rows);
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

    canvas.addEventListener('mousedown', evt => {
      mouseDown = true;
      onDraw(evt);
    });

    canvas.addEventListener('mousemove', onDraw);
    canvas.addEventListener('mouseup', evt => (mouseDown = false));

    const colorForCell = (state, neighbours) => {
      return state === 1 ? 'white' : '#282828';
    };

    this.render = world => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = 'white';
      const deadCells = [];
      context.beginPath();
      context.fillStyle = 'rgba(255, 255, 255, 255)';
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          const jPx = cellWidth * j;
          const iPx = cellHeight * i;
          if (world.get(i, j) === 1)
            context.fillRect(jPx, iPx, cellWidth, cellHeight);
          else deadCells.push[{ iPx, jPx }];
        }
      }
      context.fillStyle = 'rgba(40, 40, 40, 255)';
      deadCells.forEach(point =>
        context.fillRect(point.jPx, point.iPx, cellWidth, cellHeight)
      );
      context.closePath();
    };
  }
}
