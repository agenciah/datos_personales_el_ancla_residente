// cropUtils.js
import { createCanvas, loadImage } from 'canvas';

export const getCroppedImg = async (imageSrc, croppedAreaPixels) => {
  const image = await loadImage(imageSrc);
  const canvas = createCanvas(croppedAreaPixels.width, croppedAreaPixels.height);
  const ctx = canvas.getContext('2d');

  ctx.drawImage(
    image,
    croppedAreaPixels.x,
    croppedAreaPixels.y,
    croppedAreaPixels.width,
    croppedAreaPixels.height,
    0,
    0,
    croppedAreaPixels.width,
    croppedAreaPixels.height
  );

  return canvas.toDataURL('image/png');
};