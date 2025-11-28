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
                height: `${outputHeight}px`,
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

                if(v === 'origin') {
                  setAspect(null);
                } else if(v === 'free') {
                  setAspect(undefined);
                } else {
                  const ratio = Number(v);
                  setAspect(ratio);
                  // 고정비율이면 height 자동 계산
                  setOutputHeight(Math.round(outputWidth / ratio));
                }
              }}
            >
              <option value="origin">원본 비율</option>
              <option value="free">자유 비율</option>
              <option value="1">1 : 1</option>
              <option value="1.33">4 : 3</option>
              <option value="0.75">3 : 4</option>
              <option value="1.77">16 : 9</option>
            </select>
          </div>

          {/* 가로/세로 px 입력 */}
          <div className="flex items-center gap-6">
            <div>
              <label className="text-sm font-medium">가로(px)</label>
              <input
                type="number"
                className="ml-2 w-28 border rounded px-2 py-1"
                value={outputWidth}
                onChange={(e) => {
                  const w = Number(e.target.value);
                  setOutputWidth(w);

                  if(aspect && aspect !== undefined) {
                    setOutputHeight(Math.round(w / aspect));
                  }
                }}
              />
            </div>

            <div>
              <label className="text-sm font-medium">세로(px)</label>
              <input
                type="number"
                className="ml-2 w-28 border rounded px-2 py-1"
                value={outputHeight}
                onChange={(e) => {
                  const h = Number(e.target.value);
                  setOutputHeight(h);

                  if(aspect && aspect !== undefined) {
                    setOutputWidth(Math.round(h * aspect));
                  }
                }}
              />
            </div>
          </div>

          {/* crop 모드 옵션만 활성 */}
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

          {/* 공통 옵션 */}
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
