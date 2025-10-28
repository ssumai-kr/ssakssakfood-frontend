import { useEffect, useId, useState, forwardRef } from "react";
import Camera from "@assets/icons/camera.svg";

type Props = {
  boxClass?: string;
  file?: File | null;
  previewUrl?: string;
  onChange?: (file: File | null, previewUrl: string) => void;
  accept?: string;
  className?: string;
  label?: string;
  editing?: boolean;
};

const ImagePickerBox2 = forwardRef<HTMLInputElement, Props>(
  (
    {
      boxClass = "w-full h-[240px]",
      previewUrl,
      onChange,
      accept = "image/*",
      className = "",
      label = "이미지 업로드",
      editing = false,
    },
    ref,
  ) => {
    const id = useId();
    const [innerPreview, setInnerPreview] = useState<string>("");

    const currentPreview = previewUrl !== undefined ? previewUrl : innerPreview;

    useEffect(() => {
      return () => {
        if (currentPreview?.startsWith("blob:"))
          URL.revokeObjectURL(currentPreview);
      };
    }, [currentPreview]);

    const handleFile = (f: File | null) => {
      if (!f) {
        if (previewUrl === undefined) setInnerPreview("");
        onChange?.(null, "");
        return;
      }
      const url = URL.createObjectURL(f);
      if (previewUrl === undefined) setInnerPreview(url);
      onChange?.(f, url);
    };

    const clickable = editing; // 편집 중에만 파일 선택 허용

    return (
      <div className={`relative ${className}`}>
        {/* 편집 중에만 클릭 가능하도록 htmlFor/포인터 제어 */}
        <label
          htmlFor={clickable ? id : undefined}
          aria-label={label}
          className={[
            "block rounded-xl border border-grey-4 overflow-hidden bg-neutral-50",
            boxClass,
            clickable ? "cursor-pointer" : "pointer-events-none", // 클릭 차단
          ].join(" ")}
        >
          {currentPreview ? (
            <div className="relative w-full h-full">
              <img
                src={currentPreview}
                alt="업로드 미리보기"
                className="w-full h-full object-cover"
              />
              {editing && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <img src={Camera} alt="사진 변경" className="w-10 h-10" />
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="flex flex-col items-center justify-center gap-2">
                <img src={Camera} alt="사진 업로드" />
                <span className="body-r-14 text-grey-3">사진 첨부하기</span>
              </div>
            </div>
          )}
        </label>

        <input
          id={id}
          ref={ref}
          type="file"
          className="hidden"
          accept={accept}
          onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
        />
      </div>
    );
  },
);

ImagePickerBox2.displayName = "ImagePickerBox2";
export default ImagePickerBox2;
