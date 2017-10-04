# Life-like Cellular Automata Playground

This project is a way to explore different rules and colors for life-like cellular automata. The parameters can be changed via the interface on the top right corner.

![Imgur](https://github.com/odedw/cellular-automata-playground/raw/gifs/giphy-downsized-large.gif)

A cellular automaton is [Life-like](https://en.wikipedia.org/wiki/Life-like_cellular_automaton) (in the sense of being similar to Conway's Game of Life) if it meets the following criteria:

* The array of cells of the automaton has two dimensions.
* Each cell of the automaton has two states (conventionally referred to as "alive" and "dead", or alternatively "on" and "off")
* The neighborhood of each cell is the Moore neighborhood; it consists of the eight adjacent cells to the one under consideration and (possibly) the cell itself.
* In each time step of the automaton, the new state of a cell can be expressed as a function of the number of adjacent cells that are in the alive state and of the cell's own state.

[Conway's Game of Life](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life) is a specific example of a life-like cellular automaton.

## Rules
The rules are written as a string where each of characters is a sequence of distinct digits from 0 to 8.

The presence of a digit ***d*** in the 'birth' parameter means that a dead cell with ***d*** live neighbors becomes alive in the next generation of the pattern and the presence of ***d*** in the 'survival' parameter means that a live cell with ***d*** live neighbors survives into the next generation.

Clicking on 'random' will create randomized rules.

![Rules](https://i.imgur.com/zRKPoAW.png?1)

## Colors
The color of a living cell is determined by the number of living neighbours it has.

Clicking on 'random' will select random colors, while clicking on 'black & white' will set the color of a living cell to white regardless of the number of living neighbours it has.

![Colors](https://i.imgur.com/Qxzfnrg.png?1) 

## Keyboard Shortcuts
  `R` - Toggle 'random start'.

  `B` - Randomize rules.

  `C` - Randomize colors.

  `Space` - Set & go.

## Implementation

This implementation is using the `CanvasRenderingContext2D` interface. I am initializing a data array and using it as data for an image. Each generation I iterate over the differences from the previous generation and fill the colors according to the new state. For more information see the [`CanvasRenderer`](https://github.com/odedw/cellular-automata-playground/blob/master/src/CanvasRenderer.js) file.

## Examples
B2345/S2345

![B2345/S2345](https://github.com/odedw/cellular-automata-playground/raw/gifs/giphy-downsized-large%20(1).gif)

B3/S2345

![B3/S2345](https://media.giphy.com/media/26n798XxNu7t1OZTq/giphy.gif)

B45/S2345

![B45/S2345](https://media.giphy.com/media/3ov9k6DaKsnqTfLSzm/giphy.gif)
