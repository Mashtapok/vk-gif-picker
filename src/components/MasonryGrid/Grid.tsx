import { IGif } from '@giphy/js-types';
import React, { GetDerivedStateFromProps, PureComponent } from 'react';
import { getGifHeight } from '../../helpers/gifs';
import { Gif } from './components/Gif';
import { MasonryGrid } from './MasonryGrid';

type State = {
  gifWidth: number
  gifs: IGif[]
}

type Props = {
  gifs: IGif[],
  columns: number,
  width: number,
  gap: number,
}

const initialState = {
  gifWidth: 0,
  gifs: [] as IGif[],
};

export class Grid extends PureComponent<Props, State> {
  readonly state = { ...initialState };

  static getDerivedStateFromProps: GetDerivedStateFromProps<Props, State> = (
    { columns, gap, width },
    prevState: State,
  ) => {
    const gapOffset = gap * (columns - 1);
    const gifWidth = Math.floor((width - gapOffset) / columns);
    if (prevState.gifWidth !== gifWidth) {
      return { gifWidth };
    }
    return null;
  };

  render() {
    const {
      gifs,
      columns,
      width,
      gap,
    } = this.props;

    const { gifWidth } = this.state;

    // Получаем высоты каждой гифки в виде [heightImage1, heightImage2, heightImage3, ...]
    const itemHeights = gifs.map((gif) => getGifHeight(gif, gifWidth));

    return (
      <div style={{ width }}>
        <MasonryGrid
          itemHeights={itemHeights}
          itemWidth={gifWidth}
          columns={columns}
          gap={gap}
        >
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
  }
}
