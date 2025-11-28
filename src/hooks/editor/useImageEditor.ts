'use client';

import { useEffect, useState } from 'react';
import { Area } from 'react-easy-crop';

export function useImageEditor(file: File | null) {
  const [imgUrl, setImgUrl] = useState<string>('');
  const [originalWidth, setOriginalWidth] = useState<number>(0);
  const [originalHeight, setOriginalHeight] = useState<number>(0);

  const [outputWidth, setOutputWidth] = useState<number>(0);
  const [outputHeight, setOutputHeight] = useState<number>(0);

  const [crop, setCrop] = useState<{x: number; y: number}>({x: 0, y: 0});
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(100);

  // aspect = null    → 원본 비율 모드
  // aspect = undefined → 자유 비율 모드
  // aspect = number  → 고정 비율
  const [aspect, setAspect] = useState<number | null | undefined>(null);

  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  useEffect(() => {
    if(!file) return;

    const url = URL.createObjectURL(file);
    setImgUrl(url);

    const img = new Image();
    img.src = url;

    img.onload = () => {
      setOriginalWidth(img.width);
      setOriginalHeight(img.height);

      setOutputWidth(img.width);
      setOutputHeight(img.height);
    };

    return () => URL.revokeObjectURL(url);
  }, [file]);

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });

  async function getCroppedImg(): Promise<Blob | null> {
    if(!imgUrl) return null;

    const image = await createImage(imgUrl);

    const canvas = document.createElement('canvas');
    canvas.width = outputWidth;
    canvas.height = outputHeight;

    const ctx = canvas.getContext('2d');
    if(!ctx) return null;

    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;

    // crop 모드가 아닐 때: 원본 비율 모드 or 자유 비율 모드
    if(aspect === null || aspect === undefined || !croppedAreaPixels) {
      ctx.drawImage(image, 0, 0, outputWidth, outputHeight);

      return new Promise((resolve) =>
        canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.95),
      );
    }

    // crop 모드일 때
    ctx.drawImage(
      image,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      outputWidth,
      outputHeight,
    );

    return new Promise((resolve) =>
      canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.95),
    );
  }

  return {
    crop,
    zoom,
    rotation,
    brightness,
    contrast,
    aspect,
    outputWidth,
    outputHeight,
    imgUrl,

    setCrop,
    setZoom,
    setRotation,
    setBrightness,
    setContrast,
    setAspect,
    setOutputWidth,
    setOutputHeight,
    setCroppedAreaPixels,

    getCroppedImg,
  };
}
