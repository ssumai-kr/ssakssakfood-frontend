import { useLocation, useNavigate } from "react-router-dom";
import { ProgressBar } from "../../components/ProgressBar";
import Button from "../../components/Button";
import { useRef, useState } from "react";
import PageHeader from "@/components/PageHeader";
import Camera from "@assets/icons/camera.svg";
import { useUploadImg } from "@/api/mamber/onboarding";

export default function OnBoardingCardPage() {
  const navigate = useNavigate();
  const location = useLocation();
  console.log(location);
  const memberId = location.state?.memberId;
  const upLoadCardImg = useUploadImg(Number(memberId));
  const [preview, setPreview] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const fileInput = useRef(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(String(reader.result));
      };
      reader.readAsDataURL(file);
    }
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
        <div className="relative ">
          <label
            htmlFor="image-upload"
            className="block h-[240px] rounded-xl border-2 border-dashed border-grey-3 
               cursor-pointer "
          >
            {preview ? (
              <img
                src={preview}
                alt="업로드 미리보기"
                className="w-full h-[240px] object-certain rounded-xl"
              />
            ) : (
              <div className="h-[240px] flex flex-col items-center justify-center gap-2">
                <img src={Camera} alt="사진 업로드" />
                <span className="body-r-14 text-grey-3">사진 첨부하기</span>
              </div>
            )}
          </label>

          <input
            type="file"
            id="image-upload"
            className="hidden"
            accept="image/*"
            onChange={handleImageChange}
            ref={fileInput}
          ></input>
        </div>
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
