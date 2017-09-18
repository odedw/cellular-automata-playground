export default class Options {
  constructor(gui, start) {
    this.birth = '3';
    this.survival = '23';
    this.randomStart = true;
    this.go = () => start(this);
    gui.add(this, 'birth');
    gui.add(this, 'survival');
    gui.add(this, 'randomStart');
    gui.add(this, 'go');
    gui.closed = true;
  }
}
