import React from "react";
import { ICell } from "./wsGen";
import cn from "classnames";

interface CellProps {
  cell: ICell;
  selected?: string;
  reveal?: boolean;
}

export const Cell: React.FC<CellProps> = ({ cell, selected, reveal }) => {
  return (
    <div
      style={{
        width: 24,
        height: 24,
        borderColor: reveal || cell.word === selected ? cell.color : "white",
        backgroundColor: reveal || cell.word === selected ? cell.color : "white",
      }}
      className={cn("flex flex-col justify-center border text-center align-middle", {
        "font-extrabold text-red-500": reveal && cell.mysteryUsed,
      })}
      id={cell.id}
    >
      {cell.letter.toUpperCase()}
    </div>
  );
};
