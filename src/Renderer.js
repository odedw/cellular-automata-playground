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
    stage.interactive = true;
    const graphics = new PIXI.Graphics();
    stage.addChild(graphics);
    renderer.render(stage);

    let mouseDown = false;

    this.reset = () => {
      graphics.beginFill(0x000000);
      graphics.drawRect(0, 0, renderer.view.width, renderer.view.height);
      graphics.endFill();
    };
    const onDraw = event => {
      if (!mouseDown) return;
      const mousePos = {
        x: event.data.originalEvent.clientX * stage.width / stage.width,
        y: event.data.originalEvent.clientY * stage.height / stage.height
      };
      const pos = {
        i: ~~(mousePos.y / cellHeight),
        j: ~~(mousePos.x / cellWidth)
      };

      this.onDraw(pos.i, pos.j);
    };

    stage.on('pointerdown', evt => {
      mouseDown = true;
      onDraw(evt);
    });

    stage.on('pointermove', onDraw);
    stage.on('pointerup', evt => (mouseDown = false));

    this.render = (world, diff) => {
      graphics.beginFill(0xffffff);
      diff
        .filter(cell => cell.nextState === 1)
        .forEach(cell =>
          graphics.drawRect(
            cell.j * cellWidth,
            cell.i * cellHeight,
            cellWidth,
            cellHeight
          )
        );
      graphics.endFill();
      graphics.beginFill(0x000000);
      diff
        .filter(cell => cell.nextState !== 1)
        .forEach(cell =>
          graphics.drawRect(
            cell.j * cellWidth,
            cell.i * cellHeight,
            cellWidth,
            cellHeight
          )
        );

      graphics.endFill();
      renderer.render(stage);
    };
  }
}
