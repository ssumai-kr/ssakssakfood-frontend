import { useOwnerImg, useSignup } from "@/api/mamber/onboarding";
import Button from "@/components/Button";
import ImagePickerBox from "@/components/ImagePickerBox";
import InputField2 from "@/components/InputField2";
import PageHeader from "@/components/PageHeader";
import { ProgressBar } from "@/components/ProgressBar";
import { useOnboardingState } from "@/store/useOnboardingStore";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function StoreInformation() {
  const {
    setTemp,
    loginId,
    password,
    email,
    businessRegistrationNumber,
    ownerName,
    location,
    storeName: ApiName,
  } = useOnboardingState();
  const navigate = useNavigate();
  //전화번호
  const [phone, setPhone] = useState<string>("");
  const [storeName, setStoreName] = useState(ApiName ?? ""); //가게이름
  //상세주소
  const [detail, setDetail] = useState("");

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const handleInputPhone = (e: React.ChangeEvent<HTMLInputElement>) => {
    const phoneNum = e.target.value.replace(/\D/g, "").slice(0, 11); // 숫자만, 최대 11자리
    let formatted = "";
    if (phoneNum.length < 4) {
      formatted = phoneNum;
    } else if (phoneNum.length < 8) {
      formatted = `${phoneNum.slice(0, 3)}-${phoneNum.slice(3)}`;
    } else {
      formatted = `${phoneNum.slice(0, 3)}-${phoneNum.slice(3, 7)}-${phoneNum.slice(7)}`;
    }
    setPhone(formatted);
  };

  const storeValue = storeName.length >= 1;
  const phoneValid = /^01[0-9]-[0-9]{4}-[0-9]{4}$/.test(phone);
  const addressValid = Boolean(location?.latitude);

  const isValid = storeValue && phoneValid && addressValid;
  const uploadStoreProfile = useOwnerImg();

  const ownerSignup = useSignup();
  const handleSignup = async () => {
    try {
      const signupRes = await ownerSignup.mutateAsync({
        loginId,
        password,
        email,
        phoneNumber: phone,
        businessRegistrationNumber,
        ownerName,
        storeName,
        location: {
          roadAddress: String(location?.roadAddress ?? ""),
          latitude: Number(location?.latitude ?? 0),
          longitude: Number(location?.longitude ?? 0),
          detailAddress: detail,
        },
      });
      const memberId = signupRes?.memberId ?? signupRes?.data?.memberId;
      if (file) {
        const formData = new FormData();
        formData.append("image", file);
        await uploadStoreProfile.mutateAsync({ memberId, body: formData });
      }
      navigate("/onboarding/complete");
    } catch (err) {
      console.error("회원가입/이미지 업로드 실패:", err);
    }
  };

  console.log(location);

  const handleStoreName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStoreName(e.target.value);
    setTemp({ storeName: storeName });
  };

  return (
    <div className="w-full flex flex-col min-h-dvh ">
      <section className="flex-1 ">
        <PageHeader title={"회원가입"} />
        <ProgressBar step={4} className="my-8" owner={true} />
        <section className="flex flex-col gap-6">
          <div>
            <p className="text-2xl font-bold mb-2">가게 정보를 입력해주세요</p>
          </div>
          <div>
            <p className="subtitle-b-16 mb-4">가게명</p>

            <InputField2
              placeholder={"가게명 입력"}
              className="w-full"
              value={storeName}
              onChange={handleStoreName}
            />
          </div>
          <div>
            <p className="subtitle-b-16 mb-4">주소</p>
            <div
              className="flex items-center gap-2 mb-2 !cursor-pointer"
              onClick={() => navigate("/location/search", { state: "owner" })}
            >
              <InputField2
                value={addressValid ? (location.roadAddress as string) : ""}
                placeholder={"주소 입력"}
                readOnly
                className={` w-full ${addressValid ? "!text-black" : "text-grey"}`}
              />
              <button className="min-w-25 px-3 flex h-12 rounded-lg items-center justify-center text-white button-sb-14 bg-main1 cursor-pointer">
                주소 검색
              </button>
            </div>
            <InputField2
              placeholder={"상세 주소 입력 (선택)"}
              className="w-full mb-3"
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
            />
          </div>
          <div>
            <p className="subtitle-b-16 mb-4">전화번호</p>
            <InputField2
              placeholder={"전화번호 입력"}
              className="w-full mb-3"
              value={phone}
              onChange={handleInputPhone}
            />
          </div>
          <div>
            <p className="subtitle-b-16 mb-2">사진첨부</p>
            <p className="body-r-14 text-grey-3 mb-4">
              첨부된 사진은 가게 프로필로 등록되니, 1개만 첨부 가능해요
            </p>
            <div className="mb-4">
              <ImagePickerBox
                file={file}
                previewUrl={preview}
                onChange={(f, url) => {
                  setFile(f);
                  setPreview(url);
                }}
                boxClass="w-40 h-40"
              />
            </div>
          </div>
        </section>
      </section>
      <Button
        labelName={"회원가입 완료하기"}
        className="mb-8"
        onClick={handleSignup}
        disabled={!isValid}
      />
    </div>
  );
}
