export default class Options {
  constructor(gui, start, pause, play) {
    this.birth = "3";
    this.survival = "23";
    this.randomStart = true;
    this.start = () => start(this);
    this.pause = pause;
    this.play = play;
    gui.add(this, "birth");
    gui.add(this, "survival");
    gui.add(this, "randomStart");
    gui.add(this, "start");
    gui.add(this, "pause");
    gui.add(this, "play");
    gui.closed = true;
  }
}
