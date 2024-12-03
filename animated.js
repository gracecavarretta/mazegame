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

    selectRandomStartEnd() {
        // Find all free spaces in the maze (value 0)
        let freeSpaces = [];
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                if (!this.grid[i][j].visited) {
                    freeSpaces.push([i, j]);
                }
            }
        }

        // Select a random start and end from freeSpaces
        const getRandomIndex = () => Math.floor(Math.random() * freeSpaces.length);

        let start = freeSpaces[getRandomIndex()];
        let end = freeSpaces[getRandomIndex()];

        // Ensure start and end are not the same
        while (start[0] === end[0] && start[1] === end[1]) {
            end = freeSpaces[getRandomIndex()];
        }

        return {start, end};
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
                    walls: {top: true, right: true, bottom: true, left: true}
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
        const {x, y} = cell;

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
    generateStep() {
        const next = this.getUnvisitedNeighbor(this.current);

        if (next) {
            // Push the current cell to the stack
            this.stack.push(this.current);

            // Remove the wall between the current cell and the next cell
            this.removeWall(this.current, next);

            // Move to the next cell and mark it as visited
            this.current = next;
            this.current.visited = true;
        } else if (this.stack.length > 0) {
            // Backtrack if no unvisited neighbors
            this.current = this.stack.pop();
        }
    }
}
// Set up the canvas and initialize the maze
const canvas = document.getElementById("mazeCanvas");
const cellSize = 20;
const rows = 100; // Adjust to desired size
const cols = 100;

canvas.width = cols * cellSize;
canvas.height = rows * cellSize;

const ctx = canvas.getContext("2d");
const maze = new Maze(rows, cols, cellSize);
const{start, end} = maze.selectRandomStartEnd();
// Animation loop to generate the maze step by step
function animate() {
  maze.generateStep();
  maze.draw(ctx);

  ctx.fillStyle = 'red';
  ctx.fillRect((start[1]+0.1)*cellSize,(start[0]+0.1)*cellSize,0.85*cellSize,0.85*cellSize);

  ctx.fillStyle = 'green';
  ctx.fillRect((end[1]+0.1)*cellSize,(end[0]+0.1)*cellSize,0.85*cellSize,0.85*cellSize);

  if (maze.stack.length > 0) {
      requestAnimationFrame(animate);
  }
}

animate();

