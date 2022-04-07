import { IGif } from "@giphy/js-types";
import { pick } from "./shared";
import { Rendition } from "../types";

export const GRID_COLORS = ["#a86868", "#41af82", "#8549c1", "#5486a0", "#fff35c"];

export const getRandomColor = () =>
  GRID_COLORS[Math.round(Math.random() * (GRID_COLORS.length - 1))];

export const getGifHeight = ({ images }: IGif, gifWidth: number) => {
  const { fixed_width } = images;

  if (fixed_width) {
    const { width, height } = fixed_width;
    const aspectRatio = width / height;
    return Math.round(gifWidth / aspectRatio);
  }

  return 0;
};

const closestArea = (width: number, height: number, renditions: Rendition[]) => {
  let currentBest = Infinity;
  let result: Rendition;
  // sort the renditions so we can avoid scaling up low resolutions
  renditions.forEach(rendition => {
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

const findBestfit = (renditions: Rendition[], width: number, height: number) => {
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

export const getBestSize = (images: any, gifWidth: number, gifHeight: number) => {
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
