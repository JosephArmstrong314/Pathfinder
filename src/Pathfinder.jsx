import { useEffect, useState } from "react";
import Node from "./Node.jsx";
import "./Pathfinder.css";

const START_NODE_ROW = 2;
const START_NODE_COL = 2;
const FINISH_NODE_ROW = 7;
const FINISH_NODE_COL = 7;

function Pathfinder() {
  const [grid, setGrid] = useState([]);
  const [mouseIsPressed, setMouseIsPressed] = useState(false);

  useEffect(() => {
    setGrid(getInitialGrid());
  }, []);

  const getInitialGrid = () => {
    const grid_init = [];
    for (let rowIdx = 0; rowIdx < 10; rowIdx++) {
      const row = [];
      for (let colIdx = 0; colIdx < 10; colIdx++) {
        row.push(createNode(rowIdx, colIdx));
      }
      grid_init.push(row);
    }
    return grid_init;
  };

  const createNode = (row, col) => {
    return {
      row,
      col,
      isStart: row === START_NODE_ROW && col === START_NODE_COL,
      isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
      distance: Infinity,
      isVisited: false,
      isWall: false,
      previousNode: null,
    };
  };

  const checkIfSpecial = (row, col) => {
    return grid[row][col].isStart || grid[row][col].isFinish;
  };

  const handleClick = (row, col) => {
    if (checkIfSpecial(row, col)) {
      return;
    }
    const newGrid = getNewGrid_ToggleWall(row, col);
    setGrid(newGrid);
  };

  const handleMouseDown = (row, col) => {
    setMouseIsPressed(true);
    console.log("mouse was set to true");
    handleClick(row, col);
  };

  const handleMouseEnter = (row, col) => {
    if (!mouseIsPressed) {
      return;
    }
    console.log("mouse is down and has entered");
    handleClick(row, col);
  };

  const handleMouseUp = () => {
    setMouseIsPressed(false);
    console.log("mouse was set to false");
  };

  const getNewGrid_ToggleWall = (row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
      ...node,
      isWall: !node.isWall,
    };
    newGrid[row][col] = newNode;
    return newGrid;
  };

  const handleReset = () => {
    const newGrid = getInitialGrid();
    setGrid(newGrid);
  };

  return (
    <>
      <h1>Pathfinder</h1>
      <button onClick={handleReset}>Reset</button>
      <div className="grid">
        {grid?.map((row, rowIdx) => {
          return (
            <div key={rowIdx} className="row">
              {row.map((node, nodeIdx) => {
                return (
                  <Node
                    key={nodeIdx}
                    node={node}
                    mouseIsPressed={mouseIsPressed}
                    //onClick={(row, col) => handleClick(row, col)}
                    //onClick={(row, col) => handleClick(row, col)}
                    handleClick={handleClick}
                    handleMouseDown={handleMouseDown}
                    handleMouseEnter={handleMouseEnter}
                    handleMouseUp={handleMouseUp}
                  ></Node>
                );
              })}
            </div>
          );
        })}
      </div>
    </>
  );
}

export default Pathfinder;
