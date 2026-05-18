import React, { useMemo } from "react";
import { IGif } from "@giphy/js-types";
import { getGifHeight } from "../../helpers/gifs";
import { Gif } from "../Gif/Gif";
import { MasonryGrid } from "./MasonryGrid";

type Props = {
  gifs: IGif[];
  columns: number;
  width: number;
  gap: number;
};

export const Grid = React.memo<Props>(({ gifs, columns, width, gap }: Props) => {
  // Total horizontal gap between columns
  const gapOffset = useMemo(() => gap * (columns - 1), [columns, gap]);
  // Width of a single column
  const gifWidth = useMemo(
    () => Math.floor((width - gapOffset) / columns),
    [columns, gapOffset, width],
  );
  // Heights per GIF: [height1, height2, height3, ...]
  const itemHeights = useMemo(() => gifs.map(gif => getGifHeight(gif, gifWidth)), [gifWidth, gifs]);

  return (
    <div style={{ width }}>
      <MasonryGrid itemHeights={itemHeights} itemWidth={gifWidth} columns={columns} gap={gap}>
        {gifs.map((gif, index) => (
          <Gif
            gif={gif}
            key={gif.id + String(index)} // Trending GIFs can share duplicate ids
            width={gifWidth}
          />
        ))}
      </MasonryGrid>
    </div>
  );
});

Grid.displayName = "Grid";
