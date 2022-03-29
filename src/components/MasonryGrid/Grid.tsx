import { IGif } from '@giphy/js-types';
import React, { GetDerivedStateFromProps, PureComponent } from 'react';
import { Gif } from './components/Gif';
import { MasonryGrid } from './components/MasonryGrid';


const defaultProps = Object.freeze({ gap: 6, user: {}, initialGifs: [] });

const getGifHeight = ({ images }: IGif, gifWidth: number) => {
  const { fixed_width } = images;
  if (fixed_width) {
    const { width, height } = fixed_width;
    const aspectRatio = width / height;
    return Math.round(gifWidth / aspectRatio);
  }
  return 0;
};

// const itemHeights = images.map((gif) => getGifHeight(gif, gifWidth))

type State = {
  gifWidth: number
  isFetching: boolean
  isError: boolean
  gifs: IGif[]
  isLoaderVisible: boolean
  isDoneFetching: boolean
}

type GridProps = {
  gifs: IGif[],
  columns: number,
  width: number,
  gap: number,
}

const initialState = Object.freeze({
  isFetching: false,
  isError: false,
  gifWidth: 0,
  gifs: [] as IGif[],
  isLoaderVisible: false,
  isDoneFetching: false,
});

export class Grid extends PureComponent<GridProps, State> {
  static className = 'giphy-grid';
  static loaderClassName = 'loader';
  static fetchDebounce = 250;
  static readonly defaultProps = defaultProps;
  readonly state = { ...initialState, gifs: [] };
  bricks?: any;
  el?: HTMLDivElement | null;
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
    } = this.props;

    const { gifWidth, isError, isDoneFetching } = this.state;

    const showLoader = !isDoneFetching;
    const isFirstLoad = gifs.length === 0;
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
            />
          ))}
        </MasonryGrid>
      </div>
    );
  }
}
