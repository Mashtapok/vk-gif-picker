import React, { useCallback, useEffect, useState } from 'react';
import { useHttpRequest } from '../../hooks/useHttpRequest';
import { Result } from '../../types';
import { Grid } from '../MasonryGrid/Grid';
import { useDebounce } from '../../hooks/useDebounce';

// @ts-ignore
import { CSSTransition } from 'react-transition-group';
import './GifPicker.css'
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
        urlParams: { q: debouncedSearchQuery, limit: 10 },
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
    <CSSTransition in={!!debouncedSearchQuery} timeout={200} classNames='gif-picker'>
      <div className='gif-picker'>
        <div className='gif-picker__viewport'>
          <Grid
            width={390}
            columns={3}
            gap={10}
            gifs={gifs}
          />
        </div>
      </div>
    </CSSTransition>
  )
    ;
};
