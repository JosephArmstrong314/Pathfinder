import React from "react";
import "./Node.css";

function Node(props) {
  const { row, col, isStart, isFinish, isWall } = props.node;

  const extraClassName = isFinish
    ? "node-finish"
    : isStart
      ? "node-start"
      : isWall
        ? "node-wall"
        : "";

  const handleMouseEnterNode = () => {
    props.handleMouseEnter(row, col);
  };

  const handleMouseUpNode = () => {
    props.handleMouseUp();
  };

  const handleMouseDownNode = () => {
    props.handleMouseDown(row, col);
  };

  return (
    <div
      id={`node-${row}-${col}`}
      className={`node ${extraClassName}`}
      onMouseDown={handleMouseDownNode}
      onMouseEnter={handleMouseEnterNode}
      onMouseUp={handleMouseUpNode}
      draggable="false"
    ></div>
  );
}

export default Node;
