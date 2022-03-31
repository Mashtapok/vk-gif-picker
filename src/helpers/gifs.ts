import { IGif } from "@giphy/js-types";

export const GRID_COLORS = ['#a86868', '#41af82', '#8549c1', '#5486a0', '#fff35c'];

export const getRandomColor = () => GRID_COLORS[Math.round(Math.random() * (GRID_COLORS.length - 1))];

export const getGifHeight = ({ images }: IGif, gifWidth: number) => {
  const { fixed_width } = images;
  if (fixed_width) {
    const { width, height } = fixed_width;
    const aspectRatio = width / height;
    return Math.round(gifWidth / aspectRatio);
  }
  return 0;
};
