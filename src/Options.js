export default class Options {
  constructor(gui, reset, pause, play) {
    this.birth = "3";
    this.survival = "23";
    this.randomStart = true;
    this.reset = () => reset(this);
    this.pause = pause;
    this.play = play;
    gui.add(this, "birth");
    gui.add(this, "survival");
    gui.add(this, "randomStart");
    gui.add(this, "reset");
    gui.closed = true;
  }
}
