export default class World {
  constructor(rows, cols, randomStart) {
    this.cells = new Uint8Array(new ArrayBuffer(rows * cols));
    const index = (i, j) => i * cols + j;
    const neighboursIndices = new Array(cols * rows);
    this.get = i =>
      i >= 0 && i < this.cells.length ? this.cells[i] : undefined;

    this.set = (i, val) => (this.cells[i] = val);

    this.cross = (i, j) => {
      if (i - 1 > 0) this.cells[index(i - 1, j)] = 1;
      if (j - 1 > 0) this.cells[index(i, j - 1)] = 1;
      this.cells[index(i, j)] = 1;
      if (j + 1 > cols) this.cells[index(i, j + 1)] = 1;
      if (i + 1 < rows) this.cells[index(i + 1, j)] = 1;
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
    const count = (a, b) => a + this.cells[b];
    this.neighbours = i => neighboursIndices[i].reduce(count, 0);

    if (randomStart)
      for (let i = 0; i < this.cells.length; i++)
        this.cells[i] = Math.round(Math.random());
  }
}
