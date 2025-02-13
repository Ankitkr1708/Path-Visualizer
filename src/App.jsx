import React, { useState, useEffect, useRef } from 'react';
import Grid from './Path visualizer components/Grid'
import { bfs, dfs, astar, getShortestPath} from './algorithms';

const createNode = (row, col) => {
  return {
    row,
    col,
    isStart: row === 10 && col === 5,
    isEnd: row === 10 && col === 44,
    isWall: false,
    isHovered: false,
    distance: Infinity,
    isVisited: false,
    isPath: false,
    previousNode: null,
    g: Infinity,
    f: Infinity,
  };
};

const createGrid = () => {
  const grid = [];
  for (let row = 0; row < 20; row++) {
    const currentRow = [];
    for (let col = 0; col < 50; col++) {
      currentRow.push(createNode(row, col));
    }
    grid.push(currentRow);
  }
  return grid;
};

const App = () => {
  const [grid, setGrid] = useState([]);
  const [isMousePressed, setIsMousePressed] = useState(false);
  const [algorithm, setAlgorithm] = useState('bfs');
  const [algorithmRunning, setAlgorithmRunning] = useState(false);
  const [isMousePressedOnStart, setIsMousePressedOnStart] = useState(false);
  const [isMousePressedOnEnd, setIsMousePressedOnEnd] = useState(false);
  const [startNode, setStartNode] = useState(createNode(10,5)); 
  const [endNode, setEndNode] = useState(createNode(10,44));
  const timersRef = useRef([]);
  
   
  useEffect(() => {
    const newGrid = createGrid();
    setGrid(newGrid);
  }, []);




  const handleMouseDown = (row, col) => {
    if (algorithmRunning) return;
   
  const newGrid = grid.slice();
    if (newGrid[row][col].isStart) {
      setIsMousePressedOnStart(true);
    } else if (newGrid[row][col].isEnd) {
      setIsMousePressedOnEnd(true);
    } else {
      const updatedGrid = getNewGridWithWallToggled(grid, row, col);
      setGrid(updatedGrid);
    }
    setIsMousePressed(true);
  };
  
  const handleMouseEnter = (row, col) => {
    if (!isMousePressed) return;
    if(!isMousePressedOnStart && !isMousePressedOnEnd){
    const newGrid = getNewGridWithWallToggled(grid, row, col);
    setGrid(newGrid);
    }
  };


  const handleMouseMove = (row, col) => {
    if (row < 0 || row >= 20 || col < 0 || col >= 50) return;
    const newGrid = grid.slice();
    if (isMousePressedOnStart) {
      newGrid[row][col].isStart = true;
      newGrid[row][col].isWall = false;
      setStartNode({...newGrid[row][col]})
      setGrid(newGrid);
    }
    else if (isMousePressedOnEnd) {
      newGrid[row][col].isEnd = true;
      newGrid[row][col].isWall = false;
      setEndNode({...newGrid[row][col]})
      setGrid(newGrid);
    }
      const newGrid1 = hoveredCell(grid, row, col);
      setGrid(newGrid1);
  };


  const handleMouseLeave = (row, col) => {
    const newGrid = grid.slice();
    if (isMousePressedOnStart) {
      newGrid[row][col].isStart = false;
      setGrid(newGrid);
    }
    else if (isMousePressedOnEnd) {
      newGrid[row][col].isEnd = false;
      setGrid(newGrid);
    }
      const newGrid1 = getNewGridWithHoverReset(grid, row, col);
      setGrid(newGrid1);
  }



  const handleMouseUp = (row, col) => {
    setIsMousePressed(false);
    setIsMousePressedOnEnd(false);
    setIsMousePressedOnStart(false);
  }


  const handleAlgorithmChange = (event) => {
    setAlgorithm(event.target.value);
  };

  const clearAllTimers = () => {
    timersRef.current.forEach((timer) => clearTimeout(timer));
    timersRef.current = []; // Reset the timer array
  };

  const handleVisualize = () => {
    if(algorithmRunning) return;
    setAlgorithmRunning(true);
    let visitedNodesInOrder;
    let shortestPathNodes;
    const currentStartNode = startNode;
    const currentEndNode = endNode;
    switch (algorithm) {
      case 'bfs':
        visitedNodesInOrder = bfs(grid, currentStartNode, currentEndNode);
        shortestPathNodes = getShortestPath(visitedNodesInOrder.pop());
        break;
      case 'dfs':
        visitedNodesInOrder = dfs(grid, currentStartNode, currentEndNode);
        shortestPathNodes = getShortestPath(visitedNodesInOrder.pop());
        break;
      case 'astar':
        visitedNodesInOrder = astar(grid, currentStartNode, currentEndNode);
        shortestPathNodes = getShortestPath(visitedNodesInOrder.pop());
        break;
      default:
        return;
    }
    if(visitedNodesInOrder.length == 0){
      setAlgorithmRunning(false);
      clearGridWithoutWalls();
      return;
    }
      animateAlgorithm(visitedNodesInOrder, shortestPathNodes);
  };

  const animateAlgorithm = (visitedNodesInOrder, shortestPathNodes) => {
    for (let i = 0; i < visitedNodesInOrder.length; i++) {
      const timer = setTimeout(() => {
        const node = visitedNodesInOrder[i];
        if (node.isStart || node.isEnd) return;
        const newGrid = grid.slice();
        const newNode = {
           ...node,
            isVisited: true,
          };
        newGrid[node.row][node.col] = newNode;
        setGrid(newGrid);
      }, 10 * i);
      timersRef.current.push(timer);
    }
  
    // Animate the shortest path after visited nodes are done
    const shortestPathTimer = setTimeout(() => {
      animateShortestPath(shortestPathNodes);
    }, 10 * visitedNodesInOrder.length);
    timersRef.current.push(shortestPathTimer); 
  };

  const animateShortestPath = (shortestPathNodes) => {
    for (let i = 0; i < shortestPathNodes.length; i++) {
      const timer = setTimeout(() => {
        const node = shortestPathNodes[i];
        if (node.isStart || node.isEnd) return;
        const newGrid = grid.slice();
        const newNode = {
           ...node,
            isPath: true,
            previousNode: null
          };
        newGrid[node.row][node.col] = newNode;
        setGrid(newGrid);
      }, 50 * i); // Slower animation for the shortest path
      timersRef.current.push(timer); 
    }
  };

  const clearGridWithoutWalls = () => {
    const newGrid = grid.map(row =>
      row.map(node => ({
        ...node,
        isVisited: false,
        isPath: false,
        distance: Infinity,
        previousNode: null,
        g: Infinity,
        f: Infinity,
      }))
    );
    setGrid(newGrid);
  };

  const clearGrid = (() => {
    setAlgorithmRunning(false);
    clearAllTimers();
    const newGrid = createGrid();
    setGrid(newGrid);
  })

  const clearAnimation = (() => {
  setAlgorithmRunning(false);
  clearAllTimers();
  clearGridWithoutWalls();
  })

  // const handleGenerateMaze = () => {
  //   if (algorithmRunning) return;

  //   const mazeGrid = generateMaze(grid);
  //   setGrid(mazeGrid);
  // };

  return (
    <div className="min-h-screen bg-zinc-600">
      <h1 className="text-5xl text-center mb-4 font-bold">Path Visualizer</h1>
      <div className="flex justify-center mb-4">
        <select className="mr-4 p-2 border" onChange={handleAlgorithmChange} value={algorithm}>
          <option value="bfs">BFS</option>
          <option value="dfs">DFS</option>
          <option value="astar">Astar</option>
        </select>
        <button className="p-2 bg-blue-500 text-white" onClick={handleVisualize}>Visualize</button>
        {/* <button className="p-2 bg-green-500 text-white ml-4" onClick={handleGenerateMaze}>Generate Maze</button> */}
      </div>
      <div className="flex justify-center">
      <Grid
        grid={grid}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      />
      </div>
      <div className="flex justify-center gap-5 mt-5">
      <button className="p-2 bg-red-500 text-white " onClick={clearGrid}>Clear all</button>
      <button className="p-2 bg-red-500 text-white " onClick={clearAnimation}>Clear animation</button>
      </div>
    </div>
  );

};

const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  if(node.isEnd || node.isStart) return;
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};

const hoveredCell = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isHovered: true,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};

const getNewGridWithHoverReset = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
     ...node,
     isHovered: false
    };
  newGrid[row][col] = newNode;
  return newGrid;
};

export default App;