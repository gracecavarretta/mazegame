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

function refreshPage(selector)
{
    const button = document.querySelector(selector);
    button.addEventListener('click', () =>
    {
        location.reload(); // Refreshes the page
    });
}

// Animate Depth First Search (DFS)
function DFS(selector)
{
    const button = document.querySelector(selector);
    button.addEventListener('click', () =>
    {
        const stack = [];
        const visited = new Set();
        const visitedCells = [];

        stack.push(maze.grid[start[0]][start[1]]);
        visited.add(maze.grid[start[0]][start[1]]);

        const ctx = canvas.getContext("2d");

        function animateDFS() {
            if (stack.length > 0) {
                const current = stack.pop();

                ctx.fillStyle = "lightblue";
                ctx.fillRect(current.x * maze.cellSize + 5, current.y * maze.cellSize + 5, maze.cellSize - 10, maze.cellSize - 10);

                ctx.fillStyle = "red";
                ctx.fillRect(start[1] * maze.cellSize + 2, start[0] * maze.cellSize + 2, maze.cellSize - 4, maze.cellSize - 4);

                visitedCells.push(current);

                if (current === maze.grid[end[0]][end[1]])
                {
                    drawPath(maze.grid[end[0]][end[1]], ctx);
                    cleanupVisited(visitedCells, ctx, true);
                    return;
                }

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
                setTimeout(animateDFS, 50);
            }
            else
            {
                //Some kind of marker that DFS was completed
            }
        }
        animateDFS();
    });
}

function BFS(selector)
{
    const button = document.querySelector(selector);
    button.addEventListener('click', () =>
    {
        const queue = [];
        const visited = new Set();
        const visitedCells = [];

        queue.push(maze.grid[start[0]][start[1]]);
        visited.add(maze.grid[start[0]][start[1]]);

        const ctx = canvas.getContext("2d");

        function animateBFS()
        {
            if (queue.length > 0)
            {
                const current = queue.shift();

                ctx.fillStyle = "lightgreen";
                ctx.fillRect(current.x * maze.cellSize + 5, current.y * maze.cellSize + 5, maze.cellSize - 10, maze.cellSize - 10);

                ctx.fillStyle = "red";
                ctx.fillRect(start[1] * maze.cellSize + 2, start[0] * maze.cellSize + 2, maze.cellSize - 4, maze.cellSize - 4);

                visitedCells.push(current);

                if (current === maze.grid[end[0]][end[1]])
                {
                    drawPath(maze.grid[end[0]][end[1]], ctx);
                    cleanupVisited(visitedCells, ctx, true);
                    return;
                }

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

                setTimeout(animateBFS, 50);
            }
            else
            {
                //Output something to show BFS was completed
            }
        }
        animateBFS();
    });
}

function cleanupVisited(visitedCells, ctx, preservePath)
{
    for (const cell of visitedCells)
    {
        ctx.clearRect(cell.x * maze.cellSize + 5, cell.y * maze.cellSize + 5, maze.cellSize - 10, maze.cellSize - 10);
    }

    ctx.fillStyle = "red";
    ctx.fillRect(start[1] * maze.cellSize + 2, start[0] * maze.cellSize + 2, maze.cellSize - 4, maze.cellSize - 4);

    ctx.fillStyle = "green";
    ctx.fillRect(end[1] * maze.cellSize + 2, end[0] * maze.cellSize + 2, maze.cellSize - 4, maze.cellSize - 4);


    if (preservePath)
    {
        drawPath(maze.grid[end[0]][end[1]], ctx);
    }
}

function getTraversableNeighbors(cell)
{
    const {x, y} = cell;
    const neighbors = [];

    //Check neighbors
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

function drawPath(end, ctx)
{
    let current = end;
    ctx.strokeStyle = "purple";
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.moveTo((current.x + 0.5) * maze.cellSize, (current.y + 0.5) * maze.cellSize);

    while (current.previous)
    {
        current = current.previous;
        ctx.lineTo((current.x + 0.5) * maze.cellSize, (current.y + 0.5) * maze.cellSize);
    }

    ctx.stroke();
}

