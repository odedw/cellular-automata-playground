export default class Options {
  constructor(gui, reset, pause, play) {
    this.model = {
      birth: '3',
      survival: '23',
      randomStart: true,
      colors: new Array(9)
    };
    this.methods = {
      reset: () => reset(this.model),
      pause,
      play,
      resetColors: () => {
        for (let i = 0; i < this.model.colors.length; i++)
          this.model.colors[i] = '#FFFFFF';
      },
      random: () => {
        for (let i = 0; i < this.model.colors.length; i++) {
          this.model.colors[i] = randomColor();
        }
      },
      blackWhite: () => this.methods.resetColors(),
      tweet: () =>
        window.open(
          'https://twitter.com/intent/tweet?text=Hello%20world',
          '_blank',
          'location=yes'
        ),
      copyLink: () => {
        const str = btoa(JSON.stringify(this.model));
        console.log(str);
      },
      about: () => {
        mixpanel.track('About Click');
        window.open(
          'https://github.com/odedw/cellular-automata-playground/blob/master/README.md',
          '_blank'
        );
      },
      go: () => {
        mixpanel.track('Go Click', {
          Rules: `B${this.model.birth}/S${this.model.survival}`
        });
        reset(this.model);
      }
    };
    const letters = '0123456789ABCDEF',
      randomColor = () => {
        let color = '#';
        for (let i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      };

    //rules
    const rulesFolder = gui.addFolder('rules');
    rulesFolder.add(this.model, 'birth');
    rulesFolder.add(this.model, 'survival');

    //colors
    const colorsFolder = gui.addFolder('colors by neighbours');
    this.methods.resetColors();
    for (let i = 1; i < this.model.colors.length; i++) {
      colorsFolder.addColor(this.model.colors, i).listen();
    }
    colorsFolder.add(this.methods, 'random');
    colorsFolder.add(this.methods, 'blackWhite').name('black & white');

    //share
    // const shareFolder = gui.addFolder("share");
    // shareFolder.add(this.methods, "tweet");
    // shareFolder.add(this.methods, "copyLink").name("copy link");

    gui
      .add(this.model, 'randomStart')
      .name('random start')
      .listen();
    gui.add(this.methods, 'go').name('set & go');
    gui.add(this.methods, 'about');

    gui.closed = true;
    document.onkeydown = ev => {
      if (ev.keyCode == 32) {
        //space
        this.methods.reset();
      } else if (ev.keyCode == 82) {
        //r
        this.model.randomStart = !this.model.randomStart;
      } else if (ev.keyCode == 67) {
        //c
        this.methods.random();
      }
    };
  }
}
