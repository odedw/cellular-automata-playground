export default class Options {
  constructor(gui, reset, pause, play) {
    this.birth = '3';
    this.survival = '23';
    this.randomStart = true;
    this.reset = () => reset(this);
    this.pause = pause;
    this.play = play;
    gui.add(this, 'birth');
    gui.add(this, 'survival');
    gui.add(this, 'randomStart');
    gui.add(this, 'reset');
    gui.closed = true;

    const colorsFolders = gui.addFolder('Colors (number of neighbours)');
    this.colors = [
      '',
      '#FFFFFF',
      '#FFFFFF',
      '#FFFFFF',
      '#FFFFFF',
      '#FFFFFF',
      '#FFFFFF',
      '#FFFFFF',
      '#FFFFFF'
    ];
    this.colors.dead = '#000000';
    colorsFolders.addColor(this.colors, '1');
    colorsFolders.addColor(this.colors, '2');
    colorsFolders.addColor(this.colors, '3');
    colorsFolders.addColor(this.colors, '4');
    colorsFolders.addColor(this.colors, '5');
    colorsFolders.addColor(this.colors, '6');
    colorsFolders.addColor(this.colors, '7');
    colorsFolders.addColor(this.colors, '8');
    colorsFolders.addColor(this.colors, 'dead');
  }
}
