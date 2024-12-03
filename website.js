// The word "toggle" means turn on/off.
function toggleButton(selector)
{
    const button = document.querySelector(selector);
    if (!button.classList.contains('is-toggled'))
    {
        button.classList.add('is-toggled');
    }
    else
    {
        button.classList.remove('is-toggled');
        // Clear any active paths or reset the maze visualization
        const ctx = canvas.getContext("2d");
        maze.draw(ctx); // Redraw the maze without paths
    }
}

// Refreshes the page to generate a new maze
function refreshPage(selector)
{
    const button = document.querySelector(selector);
    button.addEventListener('click', () =>
    {
        location.reload(); // Refreshes the page
    });
}

// Animated Depth First Search (DFS)
function DFS(selector)
{
    const button = document.querySelector(selector);
    const timeDisplay = document.getElementById("dfsTime");
    const numVisited = document.getElementById("dfsVisited");

    button.addEventListener('click', () =>
    {
        // Stack for DFS
        const stack = [];
        // Keep track of nodes already visited
        const visited = new Set();
        const visitedCells = [];

        // Begins the search at the starting position
        stack.push(maze.grid[start[0]][start[1]]);
        visited.add(maze.grid[start[0]][start[1]]);

        const ctx = canvas.getContext("2d");

        // Gets the starting time
        const startTime = performance.now();

        // Animating the search
        function animateDFS() {

            // Allows the speed of the DFS to be scaled
            const stepsPerFrame = 5;
            for (let i = 0; i < stepsPerFrame && stack.length > 0; i++) {
                const current = stack.pop();

                // Marks visited cells with light blue
                ctx.fillStyle = "darkblue";
                ctx.fillRect(current.x * maze.cellSize + 0.25*maze.cellSize, current.y * maze.cellSize + 0.25*maze.cellSize, maze.cellSize - 0.5*maze.cellSize, maze.cellSize - 0.5*maze.cellSize);

                // Recolors the start with just red
                ctx.fillStyle = "red";
                ctx.fillRect(start[1] * maze.cellSize + 0.1*maze.cellSize, start[0] * maze.cellSize + 0.1*maze.cellSize, maze.cellSize - 0.2*maze.cellSize, maze.cellSize - 0.2*maze.cellSize);

                visitedCells.push(current);

                if (current === maze.grid[end[0]][end[1]])
                {
                    // Draws the path
                    drawPath(maze.grid[end[0]][end[1]], ctx);
                    // Removes the visited markers
                    cleanupVisited(visitedCells, ctx, true);
                    

                    // Ending time
                    const endTime = performance.now();
                    const elapsedTime = (endTime - startTime)/1000;
                    timeDisplay.textContent = `${elapsedTime.toFixed(4)} seconds`;

                    numVisited.textContent = `${visitedCells.length} nodes`;
                    return;
                }

                // Adds all the neigbors from the current node to the stack
                const neighbors = getTraversableNeighbors(current);
                for (let neighbor of neighbors)
                {
                    if (!visited.has(neighbor))
                    {
                        stack.push(neighbor);
                        visited.add(neighbor);
                        neighbor.previous = current;
                    }
                }
            }


            if (stack.length > 0) {
                requestAnimationFrame(animateDFS);
            } else {
                // The maze is unsolvable
            }
        }
        animateDFS();
    });
}

// Animated Breadth First Search (BFS)
function BFS(selector)
{
    const button = document.querySelector(selector);
    const timeDisplay = document.getElementById("bfsTime");
    const numVisited = document.getElementById("bfsVisited");

    button.addEventListener('click', () =>
    {
        // Queue for BFS
        const queue = [];
        // Keep track of the nodes already visited
        const visited = new Set();
        const visitedCells = [];

        // Begins the search at the starting position
        queue.push(maze.grid[start[0]][start[1]]);
        visited.add(maze.grid[start[0]][start[1]]);

        const ctx = canvas.getContext("2d");

         // Gets the starting time
         const startTime = performance.now();

        // Animates the search
        function animateBFS()
        {

            // Allows the speed of the BFS to be scaled
            const stepsPerFrame = 5;
            for (let i = 0; i < stepsPerFrame && queue.length > 0; i++)
            {
                const current = queue.shift();

                // Marks visited cells with light green
                ctx.fillStyle = "darkgreen";
                ctx.fillRect(current.x * maze.cellSize + 0.25*maze.cellSize, current.y * maze.cellSize + 0.25*maze.cellSize, maze.cellSize - 0.5*maze.cellSize, maze.cellSize - 0.5*maze.cellSize);

                // Recolors the start with just red
                ctx.fillStyle = "red";
                ctx.fillRect(start[1] * maze.cellSize + 0.1*maze.cellSize, start[0] * maze.cellSize + 0.1*maze.cellSize, maze.cellSize - 0.2*maze.cellSize, maze.cellSize - 0.2*maze.cellSize);

                visitedCells.push(current);

                if (current === maze.grid[end[0]][end[1]])
                {
                    // Draws the path
                    drawPath(maze.grid[end[0]][end[1]], ctx);
                    // Removes the visited markers
                    cleanupVisited(visitedCells, ctx, true);


                    // Ending time
                    const endTime = performance.now();
                    const elapsedTime = (endTime - startTime)/1000;
                    timeDisplay.textContent = `${elapsedTime.toFixed(4)} seconds`;

                    numVisited.textContent = `${visitedCells.length} nodes`;
                    return;
                }

                // Adds all the neigbors from the current node to the queue
                const neighbors = getTraversableNeighbors(current);
                for (let neighbor of neighbors)
                {
                    if (!visited.has(neighbor))
                    {
                        queue.push(neighbor);
                        visited.add(neighbor);
                        neighbor.previous = current;
                    }
                }
            }

            if (queue.length > 0) {
                requestAnimationFrame(animateBFS);
            } else {
                // The maze is unsolvable
            }
        }
        animateBFS();
    });
}

// Function to remove the visited markers
function cleanupVisited(visitedCells, ctx, preservePath)
{
    // Clears the markers
    for (const cell of visitedCells)
    {
        ctx.clearRect(cell.x * maze.cellSize + 0.25*maze.cellSize, cell.y * maze.cellSize + 0.25*maze.cellSize, maze.cellSize - 0.5*maze.cellSize, maze.cellSize - 0.5*maze.cellSize);
    }

    clearPath(maze.grid[end[0]][end[1]], ctx)

    // Draws the path if it is to be preserved
    if (preservePath)
        {
            drawPath(maze.grid[end[0]][end[1]], ctx);
        }

    // Recolors the start and the end
    ctx.fillStyle = "red";
    ctx.fillRect(start[1] * maze.cellSize + 0.1*maze.cellSize, start[0] * maze.cellSize + 0.1*maze.cellSize, maze.cellSize - 0.2*maze.cellSize, maze.cellSize - 0.2*maze.cellSize);

    ctx.fillStyle = "green";
    ctx.fillRect(end[1] * maze.cellSize + 0.1*maze.cellSize, end[0] * maze.cellSize + 0.1*maze.cellSize, maze.cellSize - 0.2*maze.cellSize, maze.cellSize - 0.2*maze.cellSize);
}

// Function to get all of the neighbors which can be reached by the current node
function getTraversableNeighbors(cell)
{
    const {x, y} = cell;
    const neighbors = [];

    // Checks if there are walls on the top, bottom, left, and right
    if (!cell.walls.top && y > 0) {
        neighbors.push(maze.grid[y - 1][x]);
    }

    if (!cell.walls.right && x < maze.cols - 1) {
        neighbors.push(maze.grid[y][x + 1]);
    }

    if (!cell.walls.bottom && y < maze.rows - 1) {
        neighbors.push(maze.grid[y + 1][x]);
    }

    if (!cell.walls.left && x > 0) {
        neighbors.push(maze.grid[y][x - 1]);
    }

    return neighbors;
}

// Function to draw the line between the start and end points
function drawPath(end, ctx)
{
    // Starts at the end point
    let current = end;
    // Set the path color
    ctx.strokeStyle = "purple";
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.moveTo((current.x + 0.5) * maze.cellSize, (current.y + 0.5) * maze.cellSize);

    // Back tracks from the end point through the path
    while (current.previous)
    {
        current = current.previous;
        ctx.lineTo((current.x + 0.5) * maze.cellSize, (current.y + 0.5) * maze.cellSize);
    }

    ctx.stroke();
}

// Function to clear the line between the start and end points
function clearPath(end, ctx)
{
    let current = end;
    ctx.strokeStyle = "white";
    ctx.lineWidth = 4;

    ctx.beginPath();
    ctx.moveTo((current.x + 0.5) * maze.cellSize, (current.y + 0.5) * maze.cellSize);

    while (current.previous)
    {
        current = current.previous;
        ctx.lineTo((current.x + 0.5) * maze.cellSize, (current.y + 0.5) * maze.cellSize);
    }

    ctx.stroke();
}

