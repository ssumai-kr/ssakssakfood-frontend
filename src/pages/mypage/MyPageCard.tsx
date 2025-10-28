import { useLocation } from "react-router-dom";
import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import { useUploadImg } from "@/api/mamber/onboarding";
import ImagePickerBox2 from "@/components/ImagePickerBox2";

export default function MyPageCard() {
  const location = useLocation();
  console.log(location);

  const raw = localStorage.getItem("user");
  const memberId: number | undefined = raw
    ? JSON.parse(raw)?.state?.user?.memberId
    : undefined;

  console.log(memberId);
  const upLoadCardImg = useUploadImg(Number(memberId));
  const [preview, setPreview] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handlePick = (f: File | null, url: string) => {
    setFile(f);
    setPreview(url);
  };
  const [editing, setEditing] = useState(false);
  const cardUrl = localStorage.getItem("cardImg") || undefined;

  const handleNext = () => {
    if (!editing) {
      setEditing(true);
      return;
    }
    if (file) {
      const formData = new FormData();
      formData.append("image", file);

      upLoadCardImg.mutate(formData, {
        onSuccess: (res) => {
          localStorage.setItem("cardImg", res.data.imageUrl);
          setPreview(res.data.imageUrl);
          setFile(null);
          setEditing(false);
          console.log(res);
        },
      });
    } else {
      setEditing(false);
    }
  };

  return (
    <div className="w-full flex flex-col min-h-dvh ">
      <section className="flex-1">
        <PageHeader title="아동 급식카드 관리" />

        {/* 아디 */}
        <div className="flex justify-between mb-4 items-center mt-3">
          <p className="subtitle-b-18">등록된 급식카드</p>
          <button
            className="text-sm font-medium py-[6px] px-3 rounded-sm bg-grey-5 "
            onClick={handleNext}
          >
            {editing ? "저장" : "사진변경"}
          </button>
        </div>
        <ImagePickerBox2
          file={file}
          previewUrl={preview || cardUrl}
          onChange={handlePick}
          boxClass="w-full h-[240px]"
          editing={editing}
        />
      </section>
    </div>
  );
}
