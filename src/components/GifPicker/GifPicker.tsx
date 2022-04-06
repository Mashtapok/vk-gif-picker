import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useHttpRequest } from "../../hooks/useHttpRequest";
import { Result } from "../../types";
import { Grid } from "../MasonryGrid/Grid";
import { useDebounce } from "../../hooks/useDebounce";
// @ts-ignore
import { CSSTransition } from "react-transition-group";
import { IGif } from "@giphy/js-types";
import { useMessagesContext } from "../../hooks/useMessagesContext";
import { debounce } from "../../helpers/shared";
import { Loader } from "../Loader/Loader";

import "./GifPicker.css";

const GIFS_PAGE_SIZE = 25;
const QUERY_MAX_LENGTH = 50;

type GifPickerProps = {
  searchQuery: undefined | string,
  clearInput: () => void
}

export const GifPicker: React.FC<GifPickerProps> = ({ searchQuery, clearInput }) => {
  const [gifs, setGifs] = useState<IGif[]>([]);
  const [styles, setStyles] = useState<Record<string, string>>({});
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [pages, setPages] = useState<number>(1);
  const scrollViewportRef = useRef<HTMLDivElement>(null);

  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const { request, error } = useHttpRequest();
  const { addMessage } = useMessagesContext();

  const loadGifs = useCallback(async () => {
    setIsFetching(true);

    if (debouncedSearchQuery) {
      const { data, pagination }: Result = await request("search", {
        method: "GET",
        urlParams: { q: debouncedSearchQuery as string, limit: GIFS_PAGE_SIZE },
      });
      setGifs(data);
      setTotalCount(pagination?.total_count || 0);
    } else if (debouncedSearchQuery === "") {
      const { data, pagination }: Result = await request("trending", {
        method: "GET",
        urlParams: { limit: GIFS_PAGE_SIZE },
      });
      setGifs(data);
      setTotalCount(pagination.total_count);
    }
    setIsFetching(false);
  }, [debouncedSearchQuery, request]);

  const clearInputWithClosingPicker = () => {
    clearInput();
    setGifs([]);
    setStyles({ display: "none" });
  };

  const restoreStyles = () => {
    setStyles({});
  };

  const scrollHandler = debounce(async (e: any) => {
    if (isFetching) return;

    const scrollHeight = e.target.scrollHeight;
    const scrollFromTop = e.target.scrollTop;
    const viewportHeight = e.target.clientHeight;

    if (scrollHeight - (scrollFromTop + viewportHeight) < 100 && gifs.length < totalCount) {
      setIsFetching(true);

      if (debouncedSearchQuery === "") {
        const { data }: Result = await request("trending", {
          method: "GET",
          urlParams: { limit: GIFS_PAGE_SIZE, offset: pages * GIFS_PAGE_SIZE },
        });
        setGifs(gifs.concat(data));
        setPages(prevPage => prevPage + 1);
      } else {
        const { data }: Result = await request("search", {
          method: "GET",
          urlParams: { q: debouncedSearchQuery!, limit: GIFS_PAGE_SIZE, offset: pages * GIFS_PAGE_SIZE },
        });
        setGifs(gifs.concat(data));
        setPages(pages + 1);
      }

      setIsFetching(false);
    }
  }, 150);

  const sendMessage = (newGifId: string): void => {
    const newGif = gifs.find(({ id }) => id === newGifId);

    addMessage({ gif: newGif, created: new Date(), id: Date.now() });
    clearInputWithClosingPicker();
  };

  const clickHandler = (event: React.MouseEvent<HTMLDivElement>) => {
    // Если клик не по гифке => ничего не предпринимаем
    if (!(event.target instanceof HTMLImageElement)) {
      return;
    }
    sendMessage(event.target.dataset.gif!);
  };

  const keyDownHandler = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.code === "Enter") {
      // @ts-ignore
      sendMessage(event.target.dataset.gif);
    }
  };

  const pickerContent = useMemo(() => {
    if (debouncedSearchQuery && debouncedSearchQuery.length > QUERY_MAX_LENGTH) {
      return <div
        className="gif-picker--empty">{`Запрос не может быть длиннее ${QUERY_MAX_LENGTH} символов`}</div>;
    }

    if (error) {
      return <div
        className="gif-picker--empty">При загрузке произошла ошибка. Попробуйте ещё раз, либо обновите
        страницу</div>;
    }

    if (gifs.length) {
      return <Grid
        width={390}
        columns={3}
        gap={10}
        gifs={gifs}
      />;
    } else {
      if (isFetching) {
        return null;
      } else {
        return <div
          className="gif-picker--empty">По вашему запросу ничего не найдено</div>;
      }
    }
  }, [debouncedSearchQuery, error, gifs, isFetching]);

  useEffect(() => {
    loadGifs();
  }, [loadGifs]);

  // Сброс пагинации и скролл наверх при смене поискового запроса
  useEffect(() => {
    scrollViewportRef.current?.scrollTo(0, 0);
    setPages(1);
  }, [debouncedSearchQuery]);

  return (
    <CSSTransition classNames="gif-picker"
                   in={debouncedSearchQuery !== undefined}
                   timeout={200}
                   onExit={restoreStyles}
                   unmountOnExit>
      <div className="gif-picker"
           style={styles}
           aria-label="Выбор gif изображения.">
        <div className="gif-picker__viewport"
             ref={scrollViewportRef}
             onScroll={scrollHandler}
             onClick={clickHandler}
             onKeyDown={keyDownHandler}>
          {pickerContent}
          <Loader visible={isFetching && !error} />
        </div>
      </div>
    </CSSTransition>
  );
};
