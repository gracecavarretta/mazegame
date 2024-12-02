// Depth First Search to solve the maze
function solveMazeDFS(maze, start, end) {
    const stack = [];
    const visited = new Set();
    const path = [];
    const [startRow, startCol] = start;
    const [endRow, endCol] = end;
  
    // Add a helper function to check if a cell is within bounds
    const isInBounds = (row, col) => row >= 0 && row < maze.rows && col >= 0 && col < maze.cols;
  
    // Add a helper function to get reachable neighbors
    const getReachableNeighbors = (row, col) => {
        const neighbors = [];
        const cell = maze.grid[row][col];
        
        if (!cell.walls.top && isInBounds(row - 1, col)) neighbors.push([row - 1, col]); // Top
        if (!cell.walls.right && isInBounds(row, col + 1)) neighbors.push([row, col + 1]); // Right
        if (!cell.walls.bottom && isInBounds(row + 1, col)) neighbors.push([row + 1, col]); // Bottom
        if (!cell.walls.left && isInBounds(row, col - 1)) neighbors.push([row, col - 1]); // Left
  
        return neighbors;
    };
  
    // Start DFS from the start cell
    stack.push([startRow, startCol]);
    visited.add(`${startRow},${startCol}`);
  
    while (stack.length > 0) {
        const [currentRow, currentCol] = stack.pop();
        path.push([currentRow, currentCol]);
  
        // Check if we've reached the end
        if (currentRow === endRow && currentCol === endCol) {
            return path;
        }
  
        // Get reachable neighbors and continue the search
        const neighbors = getReachableNeighbors(currentRow, currentCol);
        for (const [nRow, nCol] of neighbors) {
            const key = `${nRow},${nCol}`;
            if (!visited.has(key)) {
                visited.add(key);
                stack.push([nRow, nCol]);
            }
        }
    }
  
    // Return an empty path if no solution is found
    return [];
  }
  
  // Draw the solution path
  function drawSolution(ctx, path, cellSize) {
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 3;
  
    for (let i = 0; i < path.length - 1; i++) {
        const [x1, y1] = path[i];
        const [x2, y2] = path[i + 1];
  
        ctx.beginPath();
        ctx.moveTo((y1 + 0.5) * cellSize, (x1 + 0.5) * cellSize);
        ctx.lineTo((y2 + 0.5) * cellSize, (x2 + 0.5) * cellSize);
        ctx.stroke();
    }
  }
  
  // Main animation loop to generate the maze and solve it
  function animate() {
    maze.generateStep();
    maze.draw(ctx);
  
    ctx.fillStyle = 'red';
    ctx.fillRect((start[1] + 0.1) * cellSize, (start[0] + 0.1) * cellSize, 0.85 * cellSize, 0.85 * cellSize);
  
    ctx.fillStyle = 'green';
    ctx.fillRect((end[1] + 0.1) * cellSize, (end[0] + 0.1) * cellSize, 0.85 * cellSize, 0.85 * cellSize);
  
    if (maze.stack.length > 0) {
        requestAnimationFrame(animate);
    } else {
        const solutionPath = solveMazeDFS(maze, start, end);
        drawSolution(ctx, solutionPath, cellSize);
    }
  }
  
  