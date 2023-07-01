# Maze
Generate Mazes, of any width and height, of any start and end point and more
![image](https://github.com/Y0ursTruly/maze/assets/60293767/b5a1d8aa-9497-4caf-a0f6-d1926711a93c)

_in this example, orange is the starting point and cyan is the ending point_

# Usage
## Installation
```
git clone https://github.com/Y0ursTruly/maze.git
```
## Importing
```
const {makeMaze, makeRandomMaze, makeMove} = require('path/to/maze/folder');
```
## Exports
There are three functions that are exported for use
<ul>
  <li>
    <details>
      <summary><code>makeMaze([width[,height[,start[,end[,odds[,lineWidth[,space[,startColour[,endColour]]]]]]]]])</code></summary>
      <ul>
        <li><b>Description: </b>This function generates the maze object based on the arguments given</li>
        <li><b>Returns: </b>
<pre>{
  ...maze column positions(0 through width-1){
    ...maze row positions(0 through height-1){
      N: boolean, //if the position's north end has a wall
      E: boolean, //if the position's east end has a wall
      S: boolean, //if the position's south end has a wall
      W: boolean, //if the position's west end has a wall
      touched: boolean //if a position has already been reached
      //by the time it returns, every point on the maze should have its 'touched' attribute as true
    }
  },
  height: number, //representing the height of the maze
  width: number, //representing the width of the maze
  paths: number, //was a helpful counter during the maze's generatoin but is 0 when returned
  DRAW:{
    s: number, //the size(pixels) of the space inside each maze position
    l: number, //the thickness(pixels) of each line inside the maze
    f: number, //half of the attribute l(pixels)
    ctx: createCanvas(...).getContext('2d') //a property derived from the usage of the npm 'canvas' package
  },
  ODDS:{
    numerator: number, //an integer that's more than 0 and less than denominator
    denominator: number //an integer that satisfies the above description of numerator
  },
  canvas: createCanvas(...), //a property derived from the usage of the npm 'canvas' package
  start: [number/*gx*/,  number/*gy*/], //where one starts the maze
  end: [number/*px*/,  number/*py*/] //where one completes the maze
}</pre>
        </li>
        <li><b>Arguments: </b>
          <ul>
            <li><b>width </b><code>number (default is 20)</code> The width of the maze(amount of columns, more than 0)</li>
            <li><b>height </b><code>number (default is 20)</code> The height of the maze(amount of rows, more than 0)</li>
            <li><b>start </b><code>Array (default is [0, 0])</code> An array [gx, gy] where one would start the maze<br>gx ranges from 0 through width-1, gy ranges from 0 through height-1</li>
            <li><b>end </b><code>Array (default is [19, 19])</code> An array [px, py] where one would complete the maze<br>px ranges from 0 through width-1, py ranges from 0 through height-1</li>
            <li><b>odds </b><code>Array (default is [2, 11])</code> An array [numerator, denominator] fitting the constraints defined in the <i>ODDS</i><br>An attribute of the maze object described above</li>
            <li><b>lineWidth </b><code>number (default is 2)</code> The thickness(pixels) of each line inside the maze</li>
            <li><b>space </b><code>number (default is 30)</code> The size(pixels) of the space inside each maze position</li>
            <li><b>startColour </b><code>string (default is "#FF7F00")</code> The colour(hex or rgb) of the position where one starts the maze</li>
            <li><b>endColour </b><code>string (default is "#00F7FF")</code> The colour(hex or rgb) of the position where one completes the maze</li>
          </ul>
        </li>
      </ul>
    </details>
  </li>
  <li>
    <details>
      <summary><code>makeRandomMaze([maxSize[,minSize[,minDist]]])</code></summary>
      <ul>
        <li><b>Description: </b>Generates a maze where both the width and height are each discrete but random integers from minSize through maxSize<br>The start and end points are random but always at least minDist away from each other. The odds are also randomly generated and this affects the length of the maze's path</li>
        <li><b>Returns: </b>
<pre>the maze object generated from the makeMaze function</pre>
        </li>
        <li><b>Arguments: </b>
          <ul>
            <li><b>maxSize </b><code>number (default is 25)</code> the maximum height or width of the maze(more than 0)</li>
            <li><b>minSize </b><code>number (default is 10)</code> the minimum height or width of the maze(more than 0)</li>
            <li><b>minDist </b><code>number (default is 5)</code> the minimum distance between the start point and the end point of the maze(more than 1)</li>
          </ul>
        </li>
      </ul>
    </details>
  </li>
  <li>
    <details>
      <summary><code>makeMove(map,move[,start])</code></summary>
      <ul>
        <li><b>Description: </b>This function takes a maze object and a string, evaluates the string from a start point(or the maze's start point) and evaluates the new position<br>Eg <i>"SSEE"</i> means move south twice, then east once because it hits a wall when it tries to move east a second time</li>
        <li><b>Returns: </b>
<pre>[
  x, //x position of new evaluated position after the string of north, east, south, west commands
  y //y position of new evaluated position after the string of north, east, south, west commands
]</pre>
        </li>
        <li><b>Arguments: </b>
          <ul>
            <li><b>map </b><code>makeMaze(...)</code> A maze object</li>
            <li><b>move </b><code>string</code> A string with each character being either 'N','E','S','W'<br>'N' to go north, 'E' to go east, 'S' to go south, 'W' to go west</li>
            <li><b>start </b><code>Array (default is Array.from(map.start))</code> An array [x, y] representing the starting position to evaluate the move from</li>
          </ul>
        </li>
      </ul>
    </details>
  </li>
</ul>

# Logic
- The idea is to have a grid of positions, each position having boolean attributes for all 4 directions(true if blocked, false if open) and a boolean *"touched"* attribute
- Then recursion is used to traverse over every single position in the grid by every *untouched(touched is false) AND open(direction attribute to and from are both false) position*
- The recursive function, *`traverseMaze`*, ensures that where it comes from is never blocked, hence there is always a path
<br>Eg: if the recursion at [19, 19] calls [19, 18] then the directions between those 2 points remain unblocked
- Even after reaching the goal, the maze is still filled in every position because in any position, if all directions are blocked BUT there is an untouched position, that direction changes to open(the boolean for that direction is made false) and recursion would resume in said untouched position
- Odds are used in 2 ways, the first one being that low odds means a low chance for a direction to be open(high chance a direction is blocked) with the intent of having **low odds mean longer mazes and high odds mean shorter mazes**
- The second application of odds sealed the deal, by also making odds decide the *order of recursion*. In this instance of recursion, one function call may get finished after a good chunk of path is already made.
<br>So "order of recursion" would be the odds' chance(odds is true) of the directions sorted in order of which is CLOSEST to the goal, else(odds is false) they're sorted in order of which is FURTHEST from the goal
