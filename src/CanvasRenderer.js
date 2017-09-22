export default class Renderer {
  constructor(cols, rows, cellWidth, cellHeight) {
    const canvas = document.createElement("canvas"),
      context = canvas.getContext("2d");
    document.body.appendChild(canvas);
    canvas.width = window.innerWidth;
    canvas.height = document.body.offsetHeight;
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

    this.render = diff => {
      context.fillStyle = "white";
      const deadCells = [];
      context.beginPath();
      context.fillStyle = "rgba(255, 255, 255, 255)";
      diff
        .filter(cell => cell.nextState === 1)
        .forEach(cell =>
          context.fillRect(
            cell.j * cellWidth,
            cell.i * cellHeight,
            cellWidth,
            cellHeight
          )
        );
      context.fillStyle = "rgba(0, 0, 0, 255)";
      diff
        .filter(cell => cell.nextState === 0)
        .forEach(cell =>
          context.fillRect(
            cell.j * cellWidth,
            cell.i * cellHeight,
            cellWidth,
            cellHeight
          )
        );
      context.closePath();
    };

    this.reset = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
    };
  }
}
