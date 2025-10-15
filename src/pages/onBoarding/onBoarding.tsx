import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import InputField2 from "../../components/InputField2";
import { ProgressBar } from "../../components/ProgressBar";
import { useOnboardingState } from "../../store/useOnboardingStore";
import { useState } from "react";
import { useNicknameCheck } from "../../api/mamber/onboarding";
import PageHeader from "@/components/PageHeader";

export default function OnBoardingPage() {
  const [nicknameValue, setNickname] = useState<string>("");
  const navigate = useNavigate();

  const { setTemp } = useOnboardingState();
  const handleNext = () => {
    setTemp({ nickname: nicknameValue });
    navigate("/onBoarding/confirm");
  };

  const handleInputId = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
      .slice(0, 20)
      .replace(/[^가-힣a-zA-Z\s\u1100-\u11FF\u3130-\u318F\uAC00-\uD7AF]/g, "");
    setNickname(value);
  };

  const { data, isFetching, refetch } = useNicknameCheck(nicknameValue);

  console.log(data);

  const handleCheck = async () => {
    if (!nicknameValue.trim()) return;
    refetch();
  };

  const nicknameCheck = data?.duplicated;
  const btnCheck = data !== undefined && nicknameCheck === false;

  return (
    <div className="w-full flex flex-col min-h-dvh ">
      <section className="flex-1 ">
        <PageHeader title="회원가입" />
        <ProgressBar step={1} className="my-8" />
        <section className="flex flex-col gap-6">
          <p className="text-2xl font-bold ">닉네임을 입력해주세요</p>
          <div className="flex items-center gap-2 mb-3">
            <InputField2
              placeholder="닉네임 입력"
              className="w-full"
              value={nicknameValue}
              onChange={handleInputId}
            />
            <div>
              <button
                className="w-20 px-3 flex h-12 rounded-lg items-center justify-center text-white button-sb-14 bg-main1"
                onClick={handleCheck}
                disabled={!nicknameValue.trim() || isFetching}
              >
                중복확인
              </button>
            </div>
          </div>
        </section>
        {data && (
          <p
            className={`body-r-14 ${nicknameCheck ? "text-red" : "text-main2"} p`}
          >
            {nicknameCheck
              ? "이미 사용중인 닉네임입니다."
              : "사용 가능한 닉네임입니다."}
          </p>
        )}
      </section>
      <Button
        labelName="다음"
        className="mb-8"
        onClick={handleNext}
        disabled={!btnCheck}
      />
    </div>
  );
}
