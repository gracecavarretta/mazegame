class Maze {
  constructor(rows, cols, cellSize) {
    this.rows = rows;
    this.cols = cols;
    this.cellSize = cellSize;
    this.grid = [];
    this.stack = [];
    this.current = null;
    this.initGrid();
  }

  initGrid() {
    // Initialize the grid with cells
    for (let row = 0; row < this.rows; row++) {
      this.grid[row] = [];
      for (let col = 0; col < this.cols; col++) {
        this.grid[row][col] = {
          x: col,
          y: row,
          visited: false,
          walls: { top: true, right: true, bottom: true, left: true }
        };
      }
    }
    this.current = this.grid[0][0]; // Start from the top-left corner
    this.current.visited = true;
  }

  draw(ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.lineWidth = 2;

    // Draw cells
    for (let row of this.grid) {
      for (let cell of row) {
        const x = cell.x * this.cellSize;
        const y = cell.y * this.cellSize;

        // Draw walls if present
        ctx.strokeStyle = "black";
        if (cell.walls.top) ctx.strokeRect(x, y, this.cellSize, 1);
        if (cell.walls.right) ctx.strokeRect(x + this.cellSize, y, 1, this.cellSize);
        if (cell.walls.bottom) ctx.strokeRect(x, y + this.cellSize, this.cellSize, 1);
        if (cell.walls.left) ctx.strokeRect(x, y, 1, this.cellSize);
      }
    }
  }

  // Get a random unvisited neighbor of the current cell
  getUnvisitedNeighbor(cell) {
    const neighbors = [];
    const { x, y } = cell;

    if (y > 0 && !this.grid[y - 1][x].visited) neighbors.push(this.grid[y - 1][x]); // Top
    if (x < this.cols - 1 && !this.grid[y][x + 1].visited) neighbors.push(this.grid[y][x + 1]); // Right
    if (y < this.rows - 1 && !this.grid[y + 1][x].visited) neighbors.push(this.grid[y + 1][x]); // Bottom
    if (x > 0 && !this.grid[y][x - 1].visited) neighbors.push(this.grid[y][x - 1]); // Left

    return neighbors.length > 0
      ? neighbors[Math.floor(Math.random() * neighbors.length)]
      : null;
  }

  // Remove the wall between two cells
  removeWall(cell1, cell2) {
    const dx = cell1.x - cell2.x;
    const dy = cell1.y - cell2.y;

    if (dx === 1) {
      cell1.walls.left = false;
      cell2.walls.right = false;
    } else if (dx === -1) {
      cell1.walls.right = false;
      cell2.walls.left = false;
    }

    if (dy === 1) {
      cell1.walls.top = false;
      cell2.walls.bottom = false;
    } else if (dy === -1) {
      cell1.walls.bottom = false;
      cell2.walls.top = false;
    }
  }

  // Generate the maze using a recursive backtracking algorithm
  generate() {
    const stack = [this.current];
    this.current.visited = true;

    while (stack.length > 0) {
      const current = stack[stack.length - 1];
      const next = this.getUnvisitedNeighbor(current);

      if (next) {
        // Push the current cell to the stack
        stack.push(next);

        // Remove the wall between the current cell and the next cell
        this.removeWall(current, next);

        // Move to the next cell and mark it as visited
        next.visited = true;
      } else {
        // Backtrack if no unvisited neighbors
        stack.pop();
      }
    }
  }
}

// Set up the canvas and initialize the maze
const canvas = document.getElementById("mazeCanvas");
const cellSize = 20;
const rows = 15; // Adjust to desired size
const cols = 15;

canvas.width = cols * cellSize;
canvas.height = rows * cellSize;

const ctx = canvas.getContext("2d");
const maze = new Maze(rows, cols, cellSize);

// Function to generate the maze synchronously
function generateMaze() {
  maze.generate(); // Generate the maze without animation
  maze.draw(ctx); // Draw the generated maze
}

generateMaze(); // Call the function to generate the maze immediately
