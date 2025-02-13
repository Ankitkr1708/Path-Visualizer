import React from 'react'

const Cell = ({row, col, isStart, isEnd, isWall, isHovered, isVisited, isPath, onMouseDown, onMouseEnter, onMouseUp, onMouseMove, onMouseLeave}) => {
  let cellColor = '';
  if (isStart) cellColor = 'bg-red-500';
  else if (isEnd) cellColor = 'bg-green-500';
  else if (isPath) cellColor = 'bg-yellow-500';
  else if (isVisited) cellColor = 'bg-blue-500';
  else if (isWall) cellColor = 'bg-gray-800';
  else if (isHovered) cellColor = 'bg-gray-300'; 
  else cellColor = 'bg-red-100';
  
  return(
    <div
    id = {`cell-${row}-${col}`}
    className = {`w-6 h-6 border border-black ${cellColor}`}
    onMouseDown={() => onMouseDown(row, col)}
    onMouseEnter={() => onMouseEnter(row, col)}
    onMouseMove={() => onMouseMove(row, col)}
    onMouseLeave={() => onMouseLeave(row, col)}
    onMouseUp={() => onMouseUp(row, col)}
    ></div>
  )
}

const Grid = ({grid, onMouseDown, onMouseEnter, onMouseUp, onMouseMove, onMouseLeave}) => {
    return (
        <div className = "grid grid-cols-50 gap-0">
        {grid.map((row, rowIdx) => (
          <div key = {rowIdx} className="flex">
            {row.map((cell, cellIdx) => (
                <Cell
                key = {cellIdx}
                {...cell}
                onMouseDown={onMouseDown}
                onMouseEnter={onMouseEnter}
                onMouseMove={onMouseMove}
                onMouseLeave={onMouseLeave}
                onMouseUp={onMouseUp}
                />
            ))}
            </div>
        ))}
        </div>
    )
}

export default Grid
