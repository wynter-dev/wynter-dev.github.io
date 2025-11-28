'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Area } from 'react-easy-crop';

export function useImageEditor(file: File | null) {
  const [crop, setCrop] = useState({x: 0, y: 0});
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);

  const [aspect, setAspect] = useState<number | undefined | null>(1); // null = 원본비율
  const [outputWidth, setOutputWidth] = useState(1200);
  const [originalWidth, setOriginalWidth] = useState<number | null>(null);

  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const imgUrl = useMemo(() => (file ? URL.createObjectURL(file) : ''), [file]);

  // ⭐ 업로드된 원본 이미지 width 자동 설정
  useEffect(() => {
    if(!file) return;

    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const w = img.width;
      const limited = Math.min(w, 3000);
      setOriginalWidth(w);
      setOutputWidth(limited);
    };
    img.src = url;
  }, [file]);

  const createImage = (url: string) =>
    new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });

  const getCroppedImg = useCallback(async() => {
    if(!file) return null;

    const image = await createImage(imgUrl);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if(!ctx) return null;

    // ⭐ 원본 비율 모드
    if(aspect === null) {
      const scale = outputWidth / image.width;

      const finalWidth = outputWidth;
      const finalHeight = image.height * scale;

      canvas.width = finalWidth;
      canvas.height = finalHeight;

      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;
      ctx.drawImage(image, 0, 0, finalWidth, finalHeight);

      return new Promise<Blob | null>((resolve) =>
        canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.9),
      );
    }

    // ⭐ crop 모드
    if(!croppedAreaPixels) return null;

    const scale = outputWidth / croppedAreaPixels.width;
    const finalWidth = outputWidth;
    const finalHeight = croppedAreaPixels.height * scale;

    canvas.width = finalWidth;
    canvas.height = finalHeight;

    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;

    ctx.drawImage(
      image,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      finalWidth,
      finalHeight,
    );

    return new Promise<Blob | null>((resolve) =>
      canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.9),
    );
  }, [
    aspect,
    brightness,
    contrast,
    croppedAreaPixels,
    file,
    imgUrl,
    outputWidth,
  ]);

  return {
    // state
    crop,
    zoom,
    rotation,
    brightness,
    contrast,
    aspect,
    outputWidth,
    originalWidth,
    croppedAreaPixels,
    imgUrl,

    // setters
    setCrop,
    setZoom,
    setRotation,
    setBrightness,
    setContrast,
    setAspect,
    setOutputWidth,
    setCroppedAreaPixels,

    // core
    getCroppedImg,
  };
}
