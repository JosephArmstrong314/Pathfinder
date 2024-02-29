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

function Pathfinder() {
  const [grid, setGrid] = useState([]);
  const [mouseIsPressed, setMouseIsPressed] = useState(false);
  const [isVisualized, setIsVisualized] = useState(false);

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
    console.log("here");
    for (let row = 0; row < grid.length; row++) {
      console.log("here row");
      for (let col = 0; col < grid[row].length; col++) {
        console.log("here col");
        document
          .getElementById(`node-${row}-${col}`)
          .classList.remove("node-visited", "node-wall", "node-shortest-path");
      }
    }
    const newGrid = getInitialGrid();
    setGrid(newGrid);
    console.log(grid);
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

  return (
    <>
      <h1>Pathfinder</h1>
      <button onClick={handleReset}>Reset</button>
      <button onClick={visualizeDijkstra}>Visualize</button>
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
