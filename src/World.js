export default class World {
  constructor(rows, cols, randomStart) {
    const arr = new Uint8Array(new ArrayBuffer(rows * cols)),
      index = (i, j) => i * cols + j;
    const neighboursIndices = new Array(cols * rows);
    this.get = i => (i >= 0 && i < arr.length ? arr[i] : undefined);

    this.set = (i, val) => (arr[i] = val);

    this.cross = (i, j) => {
      if (i - 1 > 0) arr[index(i - 1, j)] = 1;
      if (j - 1 > 0) arr[index(i, j - 1)] = 1;
      arr[index(i, j)] = 1;
      if (j + 1 > cols) arr[index(i, j + 1)] = 1;
      if (i + 1 < rows) arr[index(i + 1, j)] = 1;
    };

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        neighboursIndices[index(i, j)] = [];
        if (i - 1 >= 0 && j - 1 >= 0)
          neighboursIndices[index(i, j)].push(index(i - 1, j - 1));
        if (i - 1 >= 0) neighboursIndices[index(i, j)].push(index(i - 1, j));
        if (i - 1 >= 0 && j + 1 < cols)
          neighboursIndices[index(i, j)].push(index(i - 1, j + 1));

        if (j - 1 >= 0) neighboursIndices[index(i, j)].push(index(i, j - 1));
        if (j + 1 < cols) neighboursIndices[index(i, j)].push(index(i, j + 1));

        if (i + 1 < rows && j - 1 >= 0)
          neighboursIndices[index(i, j)].push(index(i + 1, j - 1));
        if (i + 1 < rows) neighboursIndices[index(i, j)].push(index(i + 1, j));
        if (i + 1 < rows && j + 1 < cols)
          neighboursIndices[index(i, j)].push(index(i + 1, j + 1));
      }
    }
    const count = (a, b) => a + arr[b];
    this.neighbours = i => neighboursIndices[i].reduce(count, 0);

    if (randomStart)
      for (let i = 0; i < arr.length; i++) arr[i] = Math.round(Math.random());
  }
}
