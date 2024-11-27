import matplotlib.pyplot as plt
import numpy as np

def mazegen(width, height):
    # filter out even numbers
    width = (width // 2) * 2 + 1
    height = (height // 2) * 2 + 1

    shape = (height, width)
    # Build actual maze
    maze = np.zeros(shape, dtype=bool)
    # Fill borders
    for i in range(width):
        maze[0, i] = 1
        maze[-1, i] = 1
    for i in range(height):
        maze[i, 0] = 1
        maze[i, -1] = 1
    #make maze walls
    for i in range(int((width // 2) * (height // 2))):
        x, y = np.random.randint(0, width // 2) * 2, np.random.randint(0, height // 2) * 2
        maze[x, y] = 1  # make the location a wall
        for j in range(int(5 * (height + width))):
            neighbors = []  # neighbors to current wall
            if x > 1:
                neighbors.append((x - 2, y))
            if x < height - 2:
                neighbors.append((x + 2, y))
            if y > 1:
                neighbors.append((x, y - 2))
            if y < width - 2:
                neighbors.append((x, y + 2))
            if len(neighbors):  # if there are neighbors, select one at random
                x_neighbor, y_neighbor = neighbors[np.random.randint(0, len(neighbors))]
                if maze[x_neighbor, y_neighbor] == 0:  # if it is empty and unvisited
                    maze[x_neighbor, y_neighbor] = 1
                    maze[x_neighbor + (x - x_neighbor) // 2, y_neighbor + (y - y_neighbor) // 2] = 1
                    x, y = x_neighbor, y_neighbor

    return maze


# Selects random start and end points
def select_random_start_end(maze):
    free_spaces = np.argwhere(maze == 0)
    start = tuple(free_spaces[np.random.randint(0, len(free_spaces))])
    end = tuple(free_spaces[np.random.randint(0, len(free_spaces))])

    #checks if start and end are the same
    while start == end:
        end = tuple(free_spaces[np.random.randint(0, len(free_spaces))])

    return start, end


#calls mazegen and creates start and end and visualizes it using mathplotlib
maze = mazegen(21, 21)
start, end = select_random_start_end(maze)
fig, ax = plt.subplots(figsize=(10, 6))
ax.imshow(maze, cmap="gray_r", interpolation="nearest")

#Mark the start point (red) and end point (green)
ax.add_patch(plt.Rectangle((start[1] - 0.5, start[0] - 0.5), 1, 1, color="red"))  # Start is red
ax.add_patch(plt.Rectangle((end[1] - 0.5, end[0] - 0.5), 1, 1, color="green"))  # End is green
ax.axis('off')

#shows the maze
plt.show()
