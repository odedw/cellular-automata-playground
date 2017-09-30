export default class Options {
  constructor(gui, reset, pause, play) {
    //rules
    this.birth = "3";
    this.survival = "23";
    this.randomStart = true;
    this.reset = () => reset(this);
    this.pause = pause;
    this.play = play;
    const rulesFolder = gui.addFolder("rules");
    rulesFolder.add(this, "birth");
    rulesFolder.add(this, "survival");
    gui.closed = true;

    //colors
    const colorsFolders = gui.addFolder("colors by neighbours");
    this.colors = [];
    const resetColors = () => {
      this.colors[0] = "";
      this.colors[1] = "#FFFFFF";
      this.colors[2] = "#FFFFFF";
      this.colors[3] = "#FFFFFF";
      this.colors[4] = "#FFFFFF";
      this.colors[5] = "#FFFFFF";
      this.colors[6] = "#FFFFFF";
      this.colors[7] = "#FFFFFF";
      this.colors[8] = "#FFFFFF";
    };
    resetColors();
    const letters = "0123456789ABCDEF";
    const randomColor = () => {
      let color = "#";
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    };
    this.colors.random = () => {
      for (let i = 0; i < this.colors.length; i++) {
        this.colors[i] = randomColor();
      }
    };
    this.colors.blackWhite = () => resetColors();
    colorsFolders.addColor(this.colors, "1").listen();
    colorsFolders.addColor(this.colors, "2").listen();
    colorsFolders.addColor(this.colors, "3").listen();
    colorsFolders.addColor(this.colors, "4").listen();
    colorsFolders.addColor(this.colors, "5").listen();
    colorsFolders.addColor(this.colors, "6").listen();
    colorsFolders.addColor(this.colors, "7").listen();
    colorsFolders.addColor(this.colors, "8").listen();
    colorsFolders.add(this.colors, "random");
    colorsFolders.add(this.colors, "blackWhite").name("black & white");

    //share
    const shareFolder = gui.addFolder("share");
    this.tweet = () =>
      window.open(
        "https://twitter.com/intent/tweet?text=Hello%20world",
        "_blank",
        "location=yes"
      );
    shareFolder.add(this, "tweet");
    this.copyLink = () => {};
    shareFolder.add(this, "copyLink").name("copy link");

    gui
      .add(this, "randomStart")
      .name("random start")
      .listen();
    gui.add(this, "reset").name("set & go");
    this.about = () =>
      window.open(
        "https://github.com/odedw/cellular-automata-playground/blob/master/README.md",
        "_blank"
      );
    gui.add(this, "about");
  }
}
