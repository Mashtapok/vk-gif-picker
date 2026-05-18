import { IGif, IImages } from "@giphy/js-types";
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

export const getBestSize = (images: IImages, gifWidth: number, gifHeight: number) => {
  // Pick renditions that fit our use case
  const matchedSizes = pick(images, [
    "original",
    "fixed_width",
    "fixed_height",
    "fixed_width_small",
    "fixed_height_small",
  ]);
  // Attach size names to each rendition as sizeName
  const testImages = Object.entries(matchedSizes).map(([sizeName, val]) => ({
    sizeName,
    ...val,
  }));

  return findBestfit(testImages, gifWidth, gifHeight);
};

const findBestfit = (renditions: Rendition[], width: number, height: number) => {
  let [largestRendition] = renditions;
  // Filter out images smaller than the target width and height
  const testRenditions = renditions.filter(rendition => {
    if (rendition.width * rendition.height > largestRendition.width * largestRendition.height) {
      largestRendition = rendition;
    }
    return width - rendition.width <= height - rendition.height;
  });
  // If all images are smaller than the target, use the largest one
  if (testRenditions.length === 0) {
    return largestRendition;
  }
  // Pick the closest matching rendition from the filtered set
  return findClosestRendition(width, height, testRenditions);
};

const findClosestRendition = (width: number, height: number, renditions: Rendition[]) => {
  let currentBest = Infinity;
  let result: Rendition;
  // Prefer larger renditions to avoid upscaling small images
  renditions.forEach(rendition => {
    const widthPercentage = rendition.width / width;
    const heightPercentage = rendition.height / height;
    // Area ratio match: 1x1, 2x1, 1x2, etc.
    const areaPercentage = widthPercentage * heightPercentage;

    const testBest = Math.abs(1 - areaPercentage); // closer to 0 is better
    if (testBest < currentBest) {
      currentBest = testBest;
      result = rendition;
    }
  });
  return result!;
};
