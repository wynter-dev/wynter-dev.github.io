'use client';

import Cropper from 'react-easy-crop';
import { createPortal } from 'react-dom';
import { useImageEditor } from '@/hooks/editor/useImageEditor';

interface Props {
  file: File | null;
  onCancel: () => void;
  onCropped: (blob: Blob) => void;
}

export default function ImageCropModal({file, onCancel, onCropped}: Props) {
  const {
    crop,
    zoom,
    rotation,
    brightness,
    contrast,
    aspect,
    outputWidth,
    imgUrl,

    setCrop,
    setZoom,
    setRotation,
    setBrightness,
    setContrast,
    setAspect,
    setOutputWidth,
    setCroppedAreaPixels,

    getCroppedImg,
  } = useImageEditor(file);

  if(!file) return null;

  const portalRoot =
    (typeof document !== 'undefined' &&
      document.getElementById('modal-root')) ||
    null;

  async function handleDone() {
    const blob = await getCroppedImg();
    if(blob) onCropped(blob);
  }

  const modal = (
    <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-4 w-[90vw] max-w-[650px]">
        {/* 미리보기 */}
        <div className="relative w-full h-[350px] bg-black rounded overflow-hidden flex items-center justify-center">
          {aspect === null ? (
            <img
              src={imgUrl}
              className="rounded max-h-full object-contain"
              style={{
                width: `${outputWidth}px`,
                height: 'auto',
                filter: `brightness(${brightness}%) contrast(${contrast}%)`,
              }}
            />
          ) : (
            <Cropper
              image={imgUrl}
              crop={crop}
              zoom={zoom}
              rotation={rotation}
              aspect={aspect === undefined ? undefined : aspect}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onRotationChange={setRotation}
              onCropComplete={(_a, b) => setCroppedAreaPixels(b)}
            />
          )}
        </div>

        {/* 옵션 */}
        <div className="mt-4 space-y-4">

          {/* 비율 */}
          <div>
            <label className="text-sm font-medium">비율</label>
            <select
              className="ml-2 border px-2 py-1 rounded"
              value={
                aspect === null ? 'origin' : aspect === undefined ? 'free' : String(aspect)
              }
              onChange={(e) => {
                const v = e.target.value;
                if(v === 'origin') setAspect(null);
                else if(v === 'free') setAspect(undefined);
                else setAspect(Number(v));
              }}
            >
              <option value="origin">원본 비율</option>
              <option value="free">자유</option>
              <option value="1">1:1</option>
              <option value="1.33">4:3</option>
              <option value="0.75">3:4</option>
              <option value="1.77">16:9</option>
            </select>
          </div>

          {/* 원본 모드일 때 */}
          {aspect === null && (
            <div>
              <label className="text-sm font-medium">가로 폭(px)</label>
              <input
                type="range"
                min={150}
                max={3000}
                value={outputWidth}
                onChange={(e) => setOutputWidth(Number(e.target.value))}
                className="w-full"
              />
              <div className="text-xs text-gray-500 mt-1">{outputWidth}px</div>
            </div>
          )}

          {/* crop 모드 옵션 */}
          {aspect !== null && (
            <>
              <div>
                <label className="text-sm font-medium">확대</label>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.01}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-sm font-medium">회전</label>
                <input
                  type="range"
                  min={-180}
                  max={180}
                  value={rotation}
                  onChange={(e) => setRotation(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </>
          )}

          {/* 공통 */}
          <div>
            <label className="text-sm font-medium">밝기</label>
            <input
              type="range"
              min={50}
              max={150}
              value={brightness}
              onChange={(e) => setBrightness(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="text-sm font-medium">대비</label>
            <input
              type="range"
              min={50}
              max={150}
              value={contrast}
              onChange={(e) => setContrast(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-3">
          <button type="button" onClick={onCancel} className="px-3 py-1 border rounded">
            취소
          </button>
          <button type="button" onClick={handleDone} className="px-4 py-1 rounded bg-primary text-white">
            적용
          </button>
        </div>
      </div>
    </div>
  );

  if(!portalRoot) return modal;
  return createPortal(modal, portalRoot);
}
