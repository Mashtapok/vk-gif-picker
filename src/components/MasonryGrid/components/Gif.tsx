import { IGif, IImage } from "@giphy/js-types";
import React, { useRef } from "react";
import { getRandomColor } from "../../../helpers/gifs";
import { useMessagesContext } from "../../../hooks/useMessagesContext";
import "./Gif.css";

const closestArea = (width: number, height: number, renditions: any[]) => {
  let currentBest = Infinity;
  let result: IImage;
  // sort the renditions so we can avoid scaling up low resolutions
  renditions.forEach((rendition) => {
    const widthPercentage = rendition.width / width;
    const heightPercentage = rendition.height / height;
    // a width percentage of 1 is exact, 2 is double, .5 half etc
    const areaPercentage = widthPercentage * heightPercentage;
    // img could be bigger or smaller
    const testBest = Math.abs(1 - areaPercentage); // the closer to 0 the better
    if (testBest < currentBest) {
      currentBest = testBest;
      result = rendition;
    }
  });
  return result!;
};

const findBestfit = (
  renditions: Array<IImage>,
  width: number,
  height: number,
) => {
  let [largestRendition] = renditions;
  // filter out renditions that are smaller than the target width and height by scaleUpMaxPixels value
  const testRenditions = renditions.filter(rendition => {
    if (rendition.width * rendition.height > largestRendition.width * largestRendition.height) {
      largestRendition = rendition;
    }
    return width - rendition.width <= height - rendition.height;
    // return width - rendition.width <= scaleUpMaxPixels && height - rendition.height <= scaleUpMaxPixels;
  });
  // if all are too small, use the largest we have
  if (testRenditions.length === 0) {
    return largestRendition;
  }
  // find the closest area of the filtered renditions
  return closestArea(width, height, testRenditions);
};

export function pick<T extends object, U extends keyof T>(object: T, pick: Array<U>): Pick<T, U> {
  const res: Partial<T> = {};
  pick.forEach((key: U) => {
    if (object[key] !== undefined) {
      res[key] = object[key];
    }
  });
  return res as Pick<T, U>;
}

export const getBestSize = (
  images: any,
  gifWidth: number,
  gifHeight: number,
) => {
  const matchedSizes = pick(images, [
    "original",
    "fixed_width",
    "fixed_height",
    "fixed_width_small",
    "fixed_height_small",
  ]);
  const testImages = Object.entries(matchedSizes).map(([sizeName, val]: any) => ({
    sizeName,
    ...val,
  }));

  return findBestfit(testImages, gifWidth, gifHeight);
};

export const getGifHeight = ({ images }: IGif, gifWidth: number) => {
  const { fixed_width } = images;
  if (fixed_width) {
    const { width, height } = fixed_width;
    const aspectRatio = width / height;
    return Math.round(gifWidth / aspectRatio);
  }
  return 0;
};

type GifProps = {
  gif: IGif,
  width: number,
  style?: any,
  clearInput: () => void
}

export const Gif = ({
                      gif,
                      width,
                      style,
                      clearInput,
                    }: GifProps) => {
  const defaultBgColor = useRef(getRandomColor());
  const container = useRef<HTMLDivElement | null>(null);
  const image = useRef<HTMLImageElement | null>(null);

  const { addMessage } = useMessagesContext();

  // const onMouseOver = (e: SyntheticEvent<HTMLElement, Event>) => {
  //   clearTimeout(hoverTimeout.current!)
  //   e.persist()
  //   setHovered(true)
  //   hoverTimeout.current = window.setTimeout(() => {
  //     pingback.onGifHover(gif, user?.id, e.target as HTMLElement, attributes)
  //   }, hoverTimeoutDelay)
  // }

  const height = getGifHeight(gif, width);
  const bestSize = getBestSize(gif.images, width, height);
  // @ts-ignore
  const rendition = gif.images[bestSize.sizeName];
  const background = defaultBgColor.current;

  const clickHandler = () => {
    clearInput();
    addMessage({ gif, created: new Date(), id: Date.now() }); // FIXME
  };

  const keyPressHandler = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.code === "Enter") {
      clearInput();
      addMessage({ gif, created: new Date(), id: Date.now() }); // FIXME
    }
  };

  return (
    <div
      style={{
        width,
        height,
        ...style,
      }}
      tabIndex={0}
      className="gif-container" ref={container}
      onClick={clickHandler}
      onKeyPress={keyPressHandler}
      onFocus={e => console.log(e)}
    >
      <picture>
        <source type="image/webp" srcSet={rendition.webp} />
        <img
          ref={image}
          src={rendition.ur}
          style={{ background }}
          width={width}
          height={height}
          alt={gif.title}
          className="gif"
        />
      </picture>
    </div>
  );
};