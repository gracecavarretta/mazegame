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
}

function breadthFS(selector) {
  //code here for BFS
}