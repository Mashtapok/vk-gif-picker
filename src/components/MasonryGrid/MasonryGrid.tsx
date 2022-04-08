import React, { CSSProperties, memo, ReactNode } from "react";

type MasonryGridProps = {
  columns: number;
  gap: number;
  children: ReactNode;
  itemHeights: number[];
  itemWidth: number;
};

const fillArray = (length: number): number[] => {
  return Array.from({ length }).fill(0) as number[];
};

export const MasonryGrid = memo(
  ({ columns, gap, itemWidth, itemHeights, children }: MasonryGridProps) => {
    const containerStyle: CSSProperties = {};

    const renderChildren = (): ReactNode => {
      let columnTarget: number;
      const columnHeights: number[] = fillArray(columns);

      const result = React.Children.map(children, (child: React.ReactNode, index: number) => {
        const style: CSSProperties = {
          position: "absolute",
        };

        columnTarget = columnHeights.indexOf(Math.min(...columnHeights));
        const top = `${columnHeights[columnTarget]}px`;
        const left = `${columnTarget * itemWidth + columnTarget * gap}px`;
        style.transform = `translate3d(${left}, ${top}, 0)`;
        const height = itemHeights[index];

        if (height) {
          columnHeights[columnTarget] += height + gap;
        }

        return React.cloneElement(child as React.ReactElement, { style });
      });

      containerStyle.position = "relative";
      containerStyle.width = `${columns * itemWidth + (columns - 1) * gap}px`;
      containerStyle.height = `${Math.max(...columnHeights) - gap}px`;

      return result;
    };

    return <div style={containerStyle}>{renderChildren()}</div>;
  },
);

MasonryGrid.displayName = "MasonryGrid";
