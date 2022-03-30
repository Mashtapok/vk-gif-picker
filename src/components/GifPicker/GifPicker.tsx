import React, { useCallback, useEffect, useState } from 'react';
import { useHttpRequest } from '../../hooks/useHttpRequest';
import { Result } from '../../types';
import { Grid } from '../MasonryGrid/Grid';
import { useDebounce } from '../../hooks/useDebounce';

// @ts-ignore
import { CSSTransition } from 'react-transition-group';
import './GifPicker.css';
import { IGif } from '@giphy/js-types';

type GifPickerProps = {
  searchQuery: string
}

export const GifPicker: React.FC<GifPickerProps> = ({ searchQuery }) => {
  const { request, loading } = useHttpRequest();
  const [gifs, setGifs] = useState<IGif[]>([]);
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const loadGifs = useCallback(async () => {
    try {
      const { data }: Result = await request('search', {
        method: 'GET',
        urlParams: { q: debouncedSearchQuery, limit: 20 },
      });
      setGifs(data);
    } catch (e) {
      console.error(e);
    }
  }, [debouncedSearchQuery, request]);

  useEffect(() => {
    if (debouncedSearchQuery) {
      loadGifs();
    }
  }, [loadGifs, debouncedSearchQuery]);

  return (
    <CSSTransition classNames='gif-picker' in={!!debouncedSearchQuery} timeout={300} unmountOnExit>
      <div className='gif-picker' area-label='Выбор gif изображения'>
        <div className='gif-picker__viewport'>
          <Grid
            width={390}
            columns={3}
            gap={9}
            gifs={gifs}
          />
        </div>
      </div>
    </CSSTransition>
  )
    ;
};
