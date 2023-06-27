# Maze
Generate Mazes, of any width and height, of any start and end point and more
![image](https://github.com/Y0ursTruly/maze/assets/60293767/b5a1d8aa-9497-4caf-a0f6-d1926711a93c)

_in this example, orange is the starting point and cyan is the ending point_

# Usage
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
            <li><b>width </b><code>number</code> The width of the maze(amount of columns)</li>
            <li><b>height </b><code>number</code> The height of the maze(amount of rows)</li>
          </ul>
        </li>
      </ul>
    </details>
  </li>
  <li>
    <details>
      <summary><code>makeRandomMaze([maxSize[,minSize[,minDist]]])</code></summary>
      <ul>
        <li><b>Description: </b></li>
        <li><b>Returns: </b>
<pre></pre>
        </li>
        <li><b>Arguments: </b>
          <ul>
            <li><b> </b><code></code> </li>
          </ul>
        </li>
      </ul>
    </details>
  </li>
  <li>
    <details>
      <summary><code>makeMove(map,move[,start])</code></summary>
      <ul>
        <li><b>Description: </b></li>
        <li><b>Returns: </b>
<pre></pre>
        </li>
        <li><b>Arguments: </b>
          <ul>
            <li><b>map </b><code>makeMaze(...)</code> a maze object</li>
          </ul>
        </li>
      </ul>
    </details>
  </li>
</ul>
