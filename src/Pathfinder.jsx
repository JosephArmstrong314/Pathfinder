import { useEffect, useState } from "react";
import Node from "./Node.jsx";
import {
  dijkstra,
  getNodesInShortestPathOrder,
} from "./algorithms/dijkstra.js";
import "./Pathfinder.css";

const START_NODE_ROW = 2;
const START_NODE_COL = 2;
const FINISH_NODE_ROW = 7;
const FINISH_NODE_COL = 7;

const MAX_GRID_WIDTH = 20;
const MIN_GRID_WIDTH = 5;
const MAX_GRID_HEIGHT = 20;
const MIN_GRID_HEIGHT = 5;

const DEFAULT_GRID_WIDTH = 10;
const DEFAULT_GRID_HEIGHT = 10;

function Pathfinder() {
  const [grid, setGrid] = useState([]);
  const [mouseIsPressed, setMouseIsPressed] = useState(false);
  const [isVisualized, setIsVisualized] = useState(false);
  const [gridWidth, setGridWidth] = useState(DEFAULT_GRID_WIDTH);
  const [gridHeight, setGridHeight] = useState(DEFAULT_GRID_HEIGHT);
  const [inputGridWidth, setInputGridWidth] = useState(DEFAULT_GRID_WIDTH);
  const [inputGridHeight, setInputGridHeight] = useState(DEFAULT_GRID_HEIGHT);

  useEffect(() => {
    setGrid(getInitialGrid());
  }, []);

  useEffect(() => {
    setGrid(getInitialGrid());
  }, [gridWidth, gridHeight]);

  const getInitialGrid = () => {
    const grid_init = [];
    for (let rowIdx = 0; rowIdx < gridHeight; rowIdx++) {
      const row = [];
      for (let colIdx = 0; colIdx < gridWidth; colIdx++) {
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
    handleClick(row, col);
  };

  const handleMouseEnter = (row, col) => {
    if (!mouseIsPressed) {
      return;
    }
    handleClick(row, col);
  };

  const handleMouseUp = () => {
    setMouseIsPressed(false);
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
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        document
          .getElementById(`node-${row}-${col}`)
          .classList.remove("node-visited", "node-wall", "node-shortest-path");
      }
    }
    const newGrid = getInitialGrid();
    setGrid(newGrid);
    document.getElementById(
      `node-${START_NODE_ROW}-${START_NODE_COL}`
    ).className = "node node-start";
    document.getElementById(
      `node-${FINISH_NODE_ROW}-${FINISH_NODE_COL}`
    ).className = "node node-finish";
    setIsVisualized(false);
  };

  const animateDijkstra = (visitedNodesInOrder, nodesInShortestPathOrder) => {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        if (
          (node.row != START_NODE_ROW || node.col != START_NODE_COL) &&
          (node.row != FINISH_NODE_ROW || node.col != FINISH_NODE_COL)
        ) {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node node-visited";
        }
      }, 10 * i);
    }
  };

  const animateShortestPath = (nodesInShortestPathOrder) => {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        if (
          (node.row != START_NODE_ROW || node.col != START_NODE_COL) &&
          (node.row != FINISH_NODE_ROW || node.col != FINISH_NODE_COL)
        ) {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node node-shortest-path";
        }
      }, 50 * i);
    }
  };

  const visualizeDijkstra = () => {
    if (isVisualized) {
      return;
    }
    setIsVisualized(true);
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  };

  const handleGridSizeSubmit = (event) => {
    event.preventDefault();
    setGridWidth(!!inputGridWidth ? inputGridWidth : MIN_GRID_WIDTH);
    setGridHeight(!!inputGridHeight ? inputGridHeight : MIN_GRID_HEIGHT);
  };

  const handleOnInputGridWidthChange = (event) => {
    let inputValue = event.target.value;

    if (!/^\d*$/.test(inputValue)) {
      return;
    }

    inputValue = Math.min(MAX_GRID_WIDTH, inputValue);

    inputValue = Math.max(MIN_GRID_WIDTH, inputValue);

    setInputGridWidth(inputValue);
  };

  const handleOnInputGridHeightChange = (event) => {
    let inputValue = event.target.value;

    if (!/^\d*$/.test(inputValue)) {
      return;
    }

    inputValue = Math.min(MAX_GRID_HEIGHT, inputValue);

    inputValue = Math.max(MIN_GRID_HEIGHT, inputValue);

    setInputGridHeight(inputValue);
  };

  return (
    <>
      <h1>Pathfinder</h1>
      <button onClick={handleReset}>Reset</button>
      <button onClick={visualizeDijkstra}>Visualize</button>
      <form onSubmit={handleGridSizeSubmit} name="grid-size-form">
        <input
          type="number"
          min={MIN_GRID_WIDTH}
          max={MAX_GRID_WIDTH}
          value={inputGridWidth}
          placeholder="width"
          onChange={handleOnInputGridWidthChange}
          name="grid-width-input"
          className="input"
        />
        <input
          type="number"
          min={MIN_GRID_HEIGHT}
          max={MAX_GRID_HEIGHT}
          value={inputGridHeight}
          placeholder="height"
          onChange={handleOnInputGridHeightChange}
          name="grid-height-input"
          className="input"
        />
        <button type="submit">Update Grid Size</button>
      </form>
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
