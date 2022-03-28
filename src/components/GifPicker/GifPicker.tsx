import React, { useCallback, useEffect, useState } from 'react';
import { CSSTransition } from 'react-transition-group';

import './GifPicker.css';
import { useHttpRequest } from '../../hooks/useHttpRequest';
import { Result } from '../../types';

export const GifPicker = ({ candidate }) => {
  const { request, loading } = useHttpRequest();
  const [images, setImages] = useState([]);

  const loadGifs = useCallback(async () => {
    try {
      const { data }: Result = await request('search', {
        method: 'GET',
        urlParams: { q: candidate },
      });
      setImages(data);
    } catch (e) {
      console.error(e);
    }
  }, [candidate, request]);

  useEffect(() => {
    if (candidate) {
      loadGifs();
    }
  }, [loadGifs, candidate]);

  return (
    <CSSTransition in={!!candidate} timeout={200} classNames="gif-picker">
      <div className="gif-picker">
        <div className="gif-picker__viewport">
          {images.map(({ images, title, id }) => (
            <img src={images.preview_gif.url} className="gif" alt={title} key={id} />
          ))}
        </div>
      </div>
    </CSSTransition>
  );
};
