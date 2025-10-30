import React, { useId, useState, useEffect, forwardRef } from "react";
import Camera from "@assets/icons/camera.svg";

type ImagePickerBoxProps = {
  boxClass?: string;
  file?: File | null;
  previewUrl?: string;
  onChange?: (file: File | null, previewUrl: string) => void;
  accept?: string;
  className?: string;
  label?: string;
  disabled?: boolean;
};

const ImagePickerBox = forwardRef<HTMLInputElement, ImagePickerBoxProps>(
  (
    {
      boxClass = "w-full h-[240px]",
      //   file,
      previewUrl,
      onChange,
      accept = "image/*",
      className = "",
      label = "이미지 업로드",
      disabled = false,
    },
    ref,
  ) => {
    const id = useId();
    // const [innerFile, setInnerFile] = useState<File | null>(null);
    const [innerPreview, setInnerPreview] = useState<string>("");

    // const currentFile = file !== undefined ? file : innerFile;
    const currentPreview = previewUrl !== undefined ? previewUrl : innerPreview;

    useEffect(() => {
      return () => {
        if (currentPreview?.startsWith("blob:"))
          URL.revokeObjectURL(currentPreview);
      };
    }, [currentPreview]);

    const handleFile = (f: File | null) => {
      if (!f) {
        // if (file === undefined) setInnerFile(null);
        if (previewUrl === undefined) setInnerPreview("");
        onChange?.(null, "");
        return;
      }
      const url = URL.createObjectURL(f);
      //   if (file === undefined) setInnerFile(f);
      if (previewUrl === undefined) setInnerPreview(url);
      onChange?.(f, url);
    };

    return (
      <div className={`relative ${className}`}>
        <label
          htmlFor={id}
          aria-label={label}
          className={[
            "block rounded-xl border-2 border-dashed border-grey-3 overflow-hidden",

            boxClass,
          ].join(" ")}
        >
          {currentPreview ? (
            <img
              src={currentPreview}
              alt="업로드 미리보기"
              className={`w-full h-full object-cover bg-neutral-50`}
            />
          ) : (
            <div
              className={`w-full h-full flex flex-col items-center justify-center gap-2`}
            >
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
          disabled={disabled}
        />
      </div>
    );
  },
);

ImagePickerBox.displayName = "ImagePickerBox";
export default ImagePickerBox;
