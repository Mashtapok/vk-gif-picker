import React, { useCallback, useEffect, useRef, useState } from "react";
import { useHttpRequest } from "../../hooks/useHttpRequest";
import { Result } from "../../types";
import { Grid } from "../MasonryGrid/Grid";
import { useDebounce } from "../../hooks/useDebounce";
// @ts-ignore
import { CSSTransition } from "react-transition-group";
import "./GifPicker.css";
import { IGif } from "@giphy/js-types";
import { Loader } from "../common/Loader/Loader";
import { useMessagesContext } from "../../hooks/useMessagesContext";

const GIFS_PAGE_SIZE = 25;

type GifPickerProps = {
  searchQuery: string,
  clearInput: () => void
}

export const GifPicker: React.FC<GifPickerProps> = ({ searchQuery, clearInput }) => {
  const [gifs, setGifs] = useState<IGif[]>([]);
  const [styles, setStyles] = useState<Record<string, string>>({});
  const [pages, setPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const scrollViewportRef = useRef<HTMLDivElement>(null);

  const { request } = useHttpRequest();
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const { addMessage } = useMessagesContext();

  const loadGifs = useCallback(async () => {
    try {
      const { data, pagination }: Result = await request("search", {
        method: "GET",
        urlParams: { q: debouncedSearchQuery, limit: GIFS_PAGE_SIZE },
      });
      setGifs(data);
      setTotalCount(pagination.total_count);
    } catch (e) {
      console.error(e);
    }
  }, [debouncedSearchQuery, request]);

  // const loadTrendingGifs = useCallback(async () => {
  //   try {
  //     const { data, pagination }: Result = await request("trending", {
  //       method: "GET",
  //       urlParams: { limit: GIFS_PAGE_SIZE },
  //     });
  //     setGifs(data);
  //     setTotalCount(pagination.total_count);
  //   } catch (e) {
  //     console.error(e);
  //   }
  // }, [debouncedSearchQuery, request]);

  const clearInputWithClosingPicker = () => {
    clearInput();
    setStyles({ display: "none" });
  };

  const restoreStyles = () => {
    setStyles({});
  };

  const scrollHandler = (e: any) => {
    const scrollHeight = e.currentTarget.scrollHeight;
    const scrollFromTop = e.currentTarget.scrollTop;
    const viewportHeight = e.currentTarget.clientHeight;

    if (scrollHeight - (scrollFromTop + viewportHeight) < 50 && gifs.length < totalCount) {
      setIsFetching(true);
    }
  };

  useEffect(() => {
    if (debouncedSearchQuery) {
      loadGifs();
    }
    // else if(debouncedSearchQuery === '') { // TODO: подумать как сделать тренды на пробеле
    //   loadTrendingGifs();
    // }
  }, [loadGifs, debouncedSearchQuery]);

  useEffect(() => {
    if (isFetching) {
      try {
        request("search", {
          method: "GET",
          urlParams: { q: debouncedSearchQuery, limit: GIFS_PAGE_SIZE, offset: pages * GIFS_PAGE_SIZE },
        })
          .then(({ data }: Result) => {
            setGifs(gifs.concat(data));
            setPages(pages + 1);
          })
          .finally(() => setIsFetching(false));

      } catch (e) {
        console.error(e);
      }
    }
  }, [isFetching]);

  const clickHandler = (event: React.MouseEvent<HTMLDivElement>) => {
    // Если клик не по гифке => ничего не предпринимаем
    if (!(event.target instanceof HTMLImageElement)) {
      return;
    }
    const newGifId = event.target.dataset.gif;
    const newGif = gifs.find(({ id }) => id === newGifId);

    addMessage({ gif: newGif, created: new Date(), id: Date.now() });
    clearInputWithClosingPicker();
  };

  const keyDownHandler = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.code === "Enter") {
      // @ts-ignore
      const newGifId = event.target.dataset.gif;
      const newGif = gifs.find(({ id }) => id === newGifId);

      addMessage({ gif: newGif, created: new Date(), id: Date.now() });
      clearInputWithClosingPicker();
    }
  };

  return (
    <CSSTransition classNames="gif-picker"
                   in={!!debouncedSearchQuery}
                   timeout={300}
                   onExit={restoreStyles}
                   unmountOnExit>
      <div className="gif-picker" style={styles} aria-label="Выбор gif изображения.">
        <div className="gif-picker__viewport"
             ref={scrollViewportRef}
             onScroll={scrollHandler}
             onClick={clickHandler}
             onKeyDown={keyDownHandler}>
          {gifs.length ? <Grid
            width={390}
            columns={3}
            gap={10}
            gifs={gifs}
          /> : <div className="gif-picker--empty">По вашему запросу ничего не найдено</div>}
          <Loader visible={isFetching} />
        </div>
      </div>
    </CSSTransition>
  );
};
