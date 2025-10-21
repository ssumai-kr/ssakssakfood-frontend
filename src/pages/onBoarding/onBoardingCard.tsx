import { useLocation, useNavigate } from "react-router-dom";
import { ProgressBar } from "../../components/ProgressBar";
import Button from "../../components/Button";
import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import { useUploadImg } from "@/api/mamber/onboarding";
import ImagePickerBox from "@/components/ImagePickerBox";

export default function OnBoardingCardPage() {
  const navigate = useNavigate();
  const location = useLocation();
  console.log(location);
  const memberId = location.state?.memberId;
  const upLoadCardImg = useUploadImg(Number(memberId));
  const [preview, setPreview] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handlePick = (f: File | null, url: string) => {
    setFile(f);
    setPreview(url);
  };

  const handleNext = () => {
    if (file) {
      const formData = new FormData();
      formData.append("image", file);

      upLoadCardImg.mutate(formData, {
        onSuccess: () => {
          navigate("/onBoarding/complete");
        },
      });
    } else {
      navigate("/onBoarding/complete");
    }
  };

  return (
    <div className="w-full flex flex-col min-h-dvh ">
      <section className="flex-1">
        <PageHeader title="회원가입" />
        <ProgressBar step={5} className="my-8" />

        {/* 아디 */}
        <div className="flex flex-col">
          <p className="text-2xl font-bold mb-2">급식카드를 입력해주세요</p>
          <div className="body-r-14 text-grey-3 mb-6">
            <p>급식카드를 등록할 경우, 특정 식품에 한해</p>
            <p>무료로 구매할 수 있어요</p>
          </div>
        </div>

        <ImagePickerBox
          file={file}
          previewUrl={preview}
          onChange={handlePick}
          boxClass="w-full h-[240px]"
        />
      </section>

      <Button
        labelName={preview ? "회원가입 완료하기" : "등록없이 회원가입하기"}
        className="mb-8"
        disabled={false}
        onClick={handleNext}
      />
    </div>
  );
}
