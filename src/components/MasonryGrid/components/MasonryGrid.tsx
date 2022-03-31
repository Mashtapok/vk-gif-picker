import React, { memo, ReactNode } from 'react';
import { CSSProperties } from 'react';

function fillArray(length: number) {
  return Array.apply(null, Array(length)).map((_, index) => 0);
}

type MasonryGridProps = {
  columns: number
  gap: number
  children: ReactNode
  itemHeights: number[]
  itemWidth: number
}

export const MasonryGrid = memo(({
                                         columns,
                                         gap,
                                         itemWidth,
                                         itemHeights,
                                         children,
                                       }: MasonryGridProps) => {
    const containerStyle: CSSProperties = {};

    const getChildren = (): ReactNode => {
      let columnTarget: number;
      const columnHeights: number[] = fillArray(columns);

      const result = React.Children.map(children, (child: React.ReactNode, index: number) => {
        const style: CSSProperties = {
          position: 'absolute',
        };
        columnTarget = columnHeights.indexOf(Math.min.apply(Math, columnHeights));
        const top = `${columnHeights[columnTarget]}px`;
        const left = `${columnTarget * itemWidth + columnTarget * gap}px`;
        style.transform = `translate3d(${left}, ${top}, 0)`;
        const height = itemHeights[index];
        if (height) {
          columnHeights[columnTarget] += height + gap;
        }
        return React.cloneElement(child as React.ReactElement, { style });
      });

      containerStyle.position = 'relative';
      containerStyle.width = `${columns * itemWidth + (columns - 1) * gap}px`;
      containerStyle.height = `${Math.max.apply(Math, columnHeights) - gap}px`;

      return result;
    };

    return <div style={containerStyle}>{getChildren()}</div>;
  },
);

MasonryGrid.displayName = 'MasonryGrid';
