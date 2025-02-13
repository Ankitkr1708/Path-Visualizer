export const bfs = (grid, startNode, endNode) => {
  // Validate input nodes
  if (!startNode || !endNode || startNode.isWall || endNode.isWall) {
    return []; // No valid path if start or end is a wall
  }

  const queue = [startNode];
  const visitedNodesInOrder = [];
  const directions = [
    [0, 1],  // Right
    [0, -1], // Left
    [1, 0],  // Down
    [-1, 0], // Up
  ];

  // Create a copy of the grid to avoid direct mutation
  const gridCopy = grid.map(row =>
    row.map(node => ({
      ...node,
      isVisited: false,
      previousNode: null,
    }))
  );

  const start = gridCopy[startNode.row][startNode.col];
  const end = gridCopy[endNode.row][endNode.col];

  start.isVisited = true;

  while (queue.length) {
    const currentNode = queue.shift();
    visitedNodesInOrder.push(currentNode);

    // Check if we reached the end node
    if (currentNode.row === end.row && currentNode.col === end.col) {
      return visitedNodesInOrder;
    }

    // Explore neighbors
    for (const [dRow, dCol] of directions) {
      const newRow = currentNode.row + dRow;
      const newCol = currentNode.col + dCol;

      // Ensure the neighbor is within bounds
      if (newRow < 0 || newRow >= grid.length || newCol < 0 || newCol >= grid[0].length) {
        continue;
      }

      const neighbor = gridCopy[newRow][newCol];

      if (!neighbor.isWall && !neighbor.isVisited) {
        neighbor.isVisited = true;
        neighbor.previousNode = currentNode;
        queue.push(neighbor);
      }
    }
  }
  alert('No path found')
  return [];
};

export const dfs = (grid, startNode, endNode) => {
  // Validate input nodes
  if (!startNode || !endNode || startNode.isWall || endNode.isWall) {
    return []; // No valid path if start or end is a wall
  }

  const stack = [startNode];
  const visitedNodesInOrder = [];
  const directions = [
    [0, 1],  // Right
    [0, -1], // Left
    [1, 0],  // Down
    [-1, 0], // Up
  ];

  // Create a copy of the grid to avoid direct mutation
  const gridCopy = grid.map(row =>
    row.map(node => ({
      ...node,
      isVisited: false,
      previousNode: null,
    }))
  );

  const start = gridCopy[startNode.row][startNode.col];
  const end = gridCopy[endNode.row][endNode.col];

  start.isVisited = true;

  while (stack.length) {
    const currentNode = stack.pop();
    visitedNodesInOrder.push(currentNode);

    // Check if we reached the end node
    if (currentNode.row === end.row && currentNode.col === end.col) {
      return visitedNodesInOrder;
    }

    // Explore neighbors
    for (const [dRow, dCol] of directions) {
      const newRow = currentNode.row + dRow;
      const newCol = currentNode.col + dCol;

      // Ensure the neighbor is within bounds
      if (newRow < 0 || newRow >= grid.length || newCol < 0 || newCol >= grid[0].length) {
        continue;
      }

      const neighbor = gridCopy[newRow][newCol];

      if (!neighbor.isWall && !neighbor.isVisited) {
        neighbor.isVisited = true;
        neighbor.previousNode = currentNode;
        stack.push(neighbor);
      }
    }
  }

  alert('No path found')
  return [];
};

export const astar = (grid, startNode, endNode) => {
  const openSet = [startNode];
  const visitedNodesInOrder = [];
  startNode.g = 0;
  startNode.f = heuristic(startNode, endNode);

  while (openSet.length) {
    sortNodesByF(openSet);
    const currentNode = openSet.shift();
    visitedNodesInOrder.push(currentNode);

    if (currentNode.row === endNode.row && currentNode.col === endNode.col) {
      return visitedNodesInOrder;
    }

    const { row, col } = currentNode;
    const neighbors = getNeighbors(grid, row, col);

    for (const neighbor of neighbors) {
      if (neighbor.isWall) continue;

      const tentativeG = currentNode.g + 1;
      if (tentativeG < neighbor.g) {
        neighbor.previousNode = currentNode;
        neighbor.g = tentativeG;
        neighbor.f = neighbor.g + heuristic(neighbor, endNode);
        if (!openSet.includes(neighbor)) {
          openSet.push(neighbor);
        }
      }
    }
  }
  alert('No path found')
  return [];
};


const getNeighbors = (grid, row, col) => {
  const neighbors = [];
  if (row > 0) neighbors.push(grid[row - 1][col]); // Up
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]); // Down
  if (col > 0) neighbors.push(grid[row][col - 1]); // Left
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]); // Right
  return neighbors;
};


  export const getShortestPath = (node) => {
    if (!node || !node.previousNode) return [];
    const shortestPath = [];
    let currentNode = node;
    while (currentNode) {
      shortestPath.push(currentNode);
      currentNode = currentNode.previousNode;
    }
    return shortestPath.reverse();
  };

  const sortNodesByF = openSet => {
    openSet.sort((nodeA, nodeB) => nodeA.f - nodeB.f);
  };
  
  const heuristic = (node, endNode) => {
    return Math.abs(node.row - endNode.row) + Math.abs(node.col - endNode.col);
  };
  


  // export const generateMaze = (grid) => {
  //   const newGrid = grid.map(row => row.map(node => ({ ...node, isWall: false }))); // Reset walls
  //   const visited = Array.from({ length: 20 }, () => Array(50).fill(false));
    
  //   const dfsMaze = (row, col) => {
  //     visited[row][col] = true;
  //     const directions = [
  //       [0, 2], [2, 0], [0, -2], [-2, 0], // Move in steps of 2 for maze paths
  //     ];
  //     directions.sort(() => Math.random() - 0.5); // Shuffle directions for randomness
      
  //     for (const [dr, dc] of directions) {
  //       const newRow = row + dr;
  //       const newCol = col + dc;
        
  //       if (
  //         newRow > 0 && newRow < 19 &&
  //         newCol > 0 && newCol < 49 &&
  //         !visited[newRow][newCol]
  //       ) {
  //         const wallRow = row + dr / 2;
  //         const wallCol = col + dc / 2;
          
  //         newGrid[wallRow][wallCol].isWall = false; // Open path
  //         newGrid[newRow][newCol].isWall = false;
  //         dfsMaze(newRow, newCol);
  //       }
  //     }
  //   };
    
  //   // Initialize with walls
  //   for (let row = 0; row < 20; row++) {
  //     for (let col = 0; col < 50; col++) {
  //       newGrid[row][col].isWall = true;
  //     }
  //   }
    
  //   // Start DFS from a random cell
  //   const startRow = Math.floor(Math.random() * 10) * 2;
  //   const startCol = Math.floor(Math.random() * 25) * 2;
  //   newGrid[startRow][startCol].isWall = false;
  //   dfsMaze(startRow, startCol);
    
  //   return newGrid;
  // };
  //    // Apply random openings to the second topmost row
  // for (let col = 2; col < 50; col++) {
  //   if (Math.random() > 0.2) {
  //     newGrid[1][col].isWall = false;
  //   }
  // }

  // // Apply random openings to the second leftmost column
  // for (let row = 2; row < 20; row++) {
  //   if (Math.random() > 0.2) {
  //     newGrid[row][1].isWall = false;
  //   }
  // }
  
    // Start DFS from a random cell
    // const startRow = Math.floor(Math.random() * 10) * 2;
    // const startCol = Math.floor(Math.random() * 25) * 2;
    // newGrid[startRow][startCol].isWall = false;
    // dfsMaze(startRow, startCol);
    
    // newGrid[1][49].isWall = true;
    // newGrid[19][1].isWall = true;
  //   return newGrid;
  // };