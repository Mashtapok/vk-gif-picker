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
  // Из всех размеров выбираем подходящие нам
  const matchedSizes = pick(images, [
    "original",
    "fixed_width",
    "fixed_height",
    "fixed_width_small",
    "fixed_height_small",
  ]);
  // Добавляем названия размеров в сам объект с ключом sizeName
  const testImages = Object.entries(matchedSizes).map(([sizeName, val]) => ({
    sizeName,
    ...val,
  }));

  return findBestfit(testImages, gifWidth, gifHeight);
};

const findBestfit = (renditions: Rendition[], width: number, height: number) => {
  let [largestRendition] = renditions;
  // Отфильтровываем изображения, которые меньше заданной ширины и высоты
  const testRenditions = renditions.filter(rendition => {
    if (rendition.width * rendition.height > largestRendition.width * largestRendition.height) {
      largestRendition = rendition;
    }
    return width - rendition.width <= height - rendition.height;
  });
  // Если все изображения оказались меньше заданного, выбираем наибольшее из них
  if (testRenditions.length === 0) {
    return largestRendition;
  }
  // Находим ближайшее по размерам разрешение из отфильтрованных
  return findClosestRendition(width, height, testRenditions);
};

const findClosestRendition = (width: number, height: number, renditions: Rendition[]) => {
  let currentBest = Infinity;
  let result: Rendition;
  // Сортируем по разрешению в порядке убывания, чтобы избежать увеличения малых изображений
  renditions.forEach(rendition => {
    const widthPercentage = rendition.width / width;
    const heightPercentage = rendition.height / height;
    // процент сходства - 1x1, 2x1 , 1x2 и т.д
    const areaPercentage = widthPercentage * heightPercentage;

    const testBest = Math.abs(1 - areaPercentage); // чем ближе к 0, тем лучше
    if (testBest < currentBest) {
      currentBest = testBest;
      result = rendition;
    }
  });
  return result!;
};
