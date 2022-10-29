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
  // Расстояние между двумя гифками
  const gapOffset = useMemo(() => gap * (columns - 1), [columns, gap]);
  // Ширина одной колонки
  const gifWidth = useMemo(
    () => Math.floor((width - gapOffset) / columns),
    [columns, gapOffset, width],
  );
  // Получаем высоты каждой гифки в виде [heightImage1, heightImage2, heightImage3, ...]
  const itemHeights = useMemo(() => gifs.map(gif => getGifHeight(gif, gifWidth)), [gifWidth, gifs]);

  return (
    <div style={{ width }}>
      <MasonryGrid itemHeights={itemHeights} itemWidth={gifWidth} columns={columns} gap={gap}>
        {gifs.map((gif, index) => (
          <Gif
            gif={gif}
            key={gif.id + String(index)} // Бывают совпадения id в разделе трендов
            width={gifWidth}
          />
        ))}
      </MasonryGrid>
    </div>
  );
});

Grid.displayName = "Grid";
