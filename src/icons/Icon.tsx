import React from "react";

type Props = {
  className?: string;
  height: number;
  width: number;
};

export const Icon: React.FC<Props> = ({ className, height, width, children }) => {
  return (
    <svg
      className={className || ""}
      fill="none"
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      xmlns="http://www.w3.org/2000/svg"
    >
      {children}
    </svg>
  );
};
