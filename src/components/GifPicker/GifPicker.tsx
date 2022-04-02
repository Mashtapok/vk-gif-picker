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

  const loadGifs = useCallback(async () => {
    try {
      const { data, pagination }: Result = await request("search", {
        method: "GET",
        urlParams: { q: debouncedSearchQuery, limit: 25 },
      });
      setGifs(data);
      setTotalCount(pagination.total_count);
    } catch (e) {
      console.error(e);
    }
  }, [debouncedSearchQuery, request]);

  const newClearInput = () => {
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
  }, [loadGifs, debouncedSearchQuery]);

  useEffect(() => {
    if (isFetching) {
      try {
        request("search", {
          method: "GET",
          urlParams: { q: debouncedSearchQuery, limit: 25, offset: pages * 25 },
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

  return (
    <CSSTransition classNames="gif-picker"
                   in={!!debouncedSearchQuery}
                   timeout={300}
                   onExit={restoreStyles}
                   unmountOnExit>
      <div className="gif-picker" style={styles} area-label="Выбор gif изображения">
        <div className="gif-picker__viewport" onScroll={scrollHandler} ref={scrollViewportRef}>
          {gifs.length ? <Grid
            width={390}
            columns={3}
            gap={10}
            gifs={gifs}
            clearInput={newClearInput}
          /> : <div className="gif-picker--empty">По вашему запросу ничего не найдено</div>}
          <Loader visible={isFetching} />
        </div>
      </div>
    </CSSTransition>
  );
};
