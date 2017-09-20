import World from "./World";

export default class Engine {
  constructor(cols, rows, onTick, desiredFps, stats) {
    let engineTime = 0,
      current,
      next,
      birth = "",
      survival = "",
      randomStart = false,
      birthMap = new Array(8),
      survivalMap = new Array(8),
      msTillNextFrame = 0,
      lastTickTime = 0;

    const msPerFrame = 1000 / desiredFps;

    const computeNextState = () => {
      let nextState = 0;
      const diff = [];
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          let neighbors = current.neighbours(i, j),
            currentState = current.get(i, j);

          nextState =
            currentState === 1 ? survivalMap[neighbors] : birthMap[neighbors];
          next.set(i, j, nextState);

          if (currentState !== nextState) diff.push({ i, j, nextState });
        }
      }
      const temp = current;
      current = next;
      next = temp;
      return diff;
    };

    const tick = () => {
      const startTime = performance.now(),
        msElapsed = startTime - lastTickTime;
      msTillNextFrame -= msElapsed;
      if (msTillNextFrame <= 0) {
        // console.time("step");
        const diff = computeNextState();
        onTick(diff);
        // console.timeEnd("step");
        lastTickTime = performance.now();
        const timeForFrame = lastTickTime - startTime;
        msTillNextFrame = msPerFrame - timeForFrame;
        console.log(msTillNextFrame);
      } else {
        lastTickTime = performance.now();
      }

      // if (cur)
      // const elapsed = timeStamp - engineTime;
      // if (elapsed > 1000 / desiredFps) {
      //   const diff = computeNextState();
      //   engineTime = timeStamp - elapsed % (1000 / desiredFps);
      //   onTick(current, diff);
      // }
      window.requestAnimationFrame(tick);
    };

    const setOptions = options => {
      birth = options.birth || "2";
      survival = options.survival || "23";
      for (let i = 0; i < 8; i++) {
        birthMap[i] = birth.indexOf(i) >= 0 ? 1 : 0;
        survivalMap[i] = survival.indexOf(i) >= 0 ? 1 : 0;
      }

      randomStart = options.randomStart;
    };

    this.start = options => {
      setOptions(options);
      current = new World(rows, cols, randomStart);
      next = new World(rows, cols);
      window.requestAnimationFrame(tick);
    };

    this.onDraw = (i, j) => {
      current.cross(i, j);
    };
  }
}
