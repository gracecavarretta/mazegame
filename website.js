// The word "toggle" means turn on/off.
function toggleButton(selector) {
  const button = document.querySelector(selector);
  if (!button.classList.contains('is-toggled')) {
    button.classList.add('is-toggled');
  } else {
    button.classList.remove('is-toggled');
    //make sure to clear bfs/dfs when toggle off
  }
}

function refreshPage(selector) {
  const button = document.querySelector(selector);
  button.addEventListener('click', () => {
      location.reload(); // Refreshes the page
  });
}

function depthFS(selector) {
  //code here DFS
  const button = document.querySelector(selector);
  button.addEventListener('click', () => {
      toggleButton(selector);

      if (button.classList.contains('is-toggled')) {
          const solutionPath = solveMazeDFS(maze, start, end);
          drawSolution(ctx, solutionPath, cellSize);
      } else {
          // Clear DFS visualization if toggled off
          maze.draw(ctx);
      }
  });
}

function breadthFS(selector) {
  //code here for BFS
  const button = document.querySelector(selector);
  button.addEventListener('click', () => {
      toggleButton(selector);

      if (button.classList.contains('is-toggled')) {
          const solutionPath = solveMazeBFS(maze, start, end);
          drawSolution(ctx, solutionPath, cellSize);
      } else {
          // Clear BFS visualization if toggled off
          maze.draw(ctx);
      }
  });
}


refreshPage('#refreshButton');
depthFS('#dfsButton');
breadthFS('#bfsButton');