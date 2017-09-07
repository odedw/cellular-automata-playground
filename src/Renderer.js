export default class Renderer {
  constructor(cols, rows, cellWidth, cellHeight) {
    const renderer = PIXI.autoDetectRenderer(256, 256, {
      antialias: false,
      transparent: false,
      resolution: 1
    });
    renderer.view.style.position = 'absolute';
    renderer.view.style.display = 'block';
    renderer.autoResize = true;
    renderer.resize(window.innerWidth, window.innerHeight);
    renderer.backgroundColor = 0x000000;
    document.body.appendChild(renderer.view);
    const stage = new PIXI.Container();
    const graphics = new PIXI.Graphics();
    stage.addChild(graphics);
    renderer.render(stage);

    let mouseDown = false;

    // const onDraw = event => {
    //   if (!mouseDown) return;

    //   const rect = canvas.getBoundingClientRect();
    //   const mousePos = {
    //     x: event.clientX * canvas.width / canvas.clientWidth,
    //     y: event.clientY * canvas.height / canvas.clientHeight
    //   };
    //   const pos = {
    //     i: ~~(mousePos.y / cellHeight),
    //     j: ~~(mousePos.x / cellWidth)
    //   };

    //   this.onDraw(pos.i, pos.j);
    // };

    // canvas.addEventListener('mousedown', evt => {
    //   mouseDown = true;
    //   onDraw(evt);
    // });

    // canvas.addEventListener('mousemove', onDraw);
    // canvas.addEventListener('mouseup', evt => (mouseDown = false));

    this.render = (world, diff) => {
      // context.clearRect(0, 0, canvas.width, canvas.height);
      graphics.beginFill(0xffffff);
      // context.beginPath();
      // context.fillStyle = 'rgba(255, 255, 255, 255)';
      diff.filter(cell => cell.nextState === 1).forEach(cell =>
        graphics.drawRect(
          //     context.fillRect(
          cell.j * cellWidth,
          cell.i * cellHeight,
          cellWidth,
          cellHeight
        )
      );
      graphics.endFill();
      graphics.beginFill(0x000000);
      // context.fillStyle = 'rgba(40, 40, 40, 255)';
      diff.filter(cell => cell.nextState !== 1).forEach(cell =>
        graphics.drawRect(
          // context.fillRect(
          cell.j * cellWidth,
          cell.i * cellHeight,
          cellWidth,
          cellHeight
        )
      );

      graphics.endFill();
      renderer.render(stage);

      // context.closePath();
    };
  }
}
