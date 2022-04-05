import { IGif } from "@giphy/js-types";
import React, { useRef } from "react";
import { getBestSize, getGifHeight, getRandomColor } from "../../../helpers/gifs";
import "./Gif.css";

type GifProps = {
  gif: IGif,
  width: number,
  style?: any,
}

export const Gif = ({
                      gif,
                      width,
                      style,
                    }: GifProps) => {
  const defaultBgColor = useRef(getRandomColor());
  const container = useRef<HTMLDivElement | null>(null);
  const image = useRef<HTMLImageElement | null>(null);

  const height = getGifHeight(gif, width);
  const bestSize = getBestSize(gif.images, width, height);
  // @ts-ignore
  const rendition = gif.images[bestSize.sizeName];
  const background = defaultBgColor.current;

  return (
    <div
      style={{
        width,
        height,
        ...style,
      }}
      tabIndex={0}
      data-gif={gif.id}
      className="gif-container"
      ref={container}
    >
      <img
        ref={image}
        srcSet={rendition.webp || rendition.url}
        style={{ background }}
        width={width}
        height={height}
        alt={gif.title}
        data-gif={gif.id}
        className="gif"
      />
    </div>
  );
};
