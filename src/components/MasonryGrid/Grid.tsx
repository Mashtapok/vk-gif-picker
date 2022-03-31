import { IGif } from '@giphy/js-types';
import React, { GetDerivedStateFromProps, PureComponent } from 'react';
import { getGifHeight } from '../../helpers/gifs';
import { Gif } from './components/Gif';
import { MasonryGrid } from './components/MasonryGrid';

type State = {
  gifWidth: number
  gifs: IGif[]
}

type GridProps = {
  gifs: IGif[],
  columns: number,
  width: number,
  gap: number,
  clearInput: () => void
}

const initialState = Object.freeze({
  gifWidth: 0,
  gifs: [] as IGif[],
});

export class Grid extends PureComponent<GridProps, State> {
  readonly state = { ...initialState };
  unmounted: boolean = false;
  // paginator = gifPaginator(this.props.fetchGifs, this.state.gifs)
  static getDerivedStateFromProps: GetDerivedStateFromProps<GridProps, State> = (
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

  componentWillUnmount() {
    this.unmounted = true;
  }

  render() {
    const {
      gifs,
      columns,
      width,
      gap,
      clearInput
    } = this.props;

    const { gifWidth } = this.state;

    // const isEmpty = gifs.length === 0;

    // Получаем высоты каждой гифки
    const itemHeights = gifs.map((gif) => getGifHeight(gif, gifWidth));

    return (
      <div style={{ width }}>
        <MasonryGrid
          itemHeights={itemHeights}
          itemWidth={gifWidth}
          columns={columns}
          gap={gap}
        >
          {gifs.map((gif) => (
            <Gif
              gif={gif}
              key={gif.id}
              width={gifWidth}
              clearInput={clearInput}
            />
          ))}
        </MasonryGrid>
      </div>
    );
  }
}
