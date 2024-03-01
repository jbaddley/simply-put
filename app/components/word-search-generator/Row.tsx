import React from "react";
import { Cell } from "./Cell"; // Assuming Cell is in the same directory
import { ICell } from "./wsGen";

interface RowProps {
  row: Array<ICell>;
  selected?: string;
  reveal?: boolean;
}

export const Row: React.FC<RowProps> = ({ row, selected, reveal }) => {
  return (
    <div style={{ height: 24 }} className='flex flex-row gap-0'>
      {row.map((item) => (
        <Cell reveal={reveal} selected={reveal ? item.word : selected} cell={item} key={item.id} />
      ))}
    </div>
  );
};
