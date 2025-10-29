import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import InputField2 from "../../components/InputField2";
import { ProgressBar } from "../../components/ProgressBar";
import { useOnboardingState } from "../../store/useOnboardingStore";
import { useState } from "react";
import PageHeader from "@/components/PageHeader";

export default function OnboardingNumber() {
  const { setTemp, phone: storePhone } = useOnboardingState();
  const [phone, setPhone] = useState<string>(storePhone ?? "");
  // const [isValid, setIsValid] = useState(false);
  const navigate = useNavigate();
  const handleNext = () => {
    if (!isValid) return;
    setTemp({ phone: phone });
    navigate("/onBoarding/pass", { state: "s" });
  };
  const phoneRegex = /^01[0-9]-[0-9]{4}-[0-9]{4}$/;
  const isValid = phoneRegex.test(phone);

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
    // setIsValid(phoneRegex.test(formatted));
  };
  return (
    <div className="w-full flex flex-col min-h-dvh ">
      <section className="flex-1 ">
        <PageHeader title="회원가입" />
        <ProgressBar step={3} className="my-8" />
        <section className="flex flex-col gap-6">
          <p className="text-2xl font-bold ">전화번호를 입력해주세요</p>
          <div className="flex items-center gap-2 mb-2">
            <InputField2
              placeholder="전화번호 입력"
              className="w-full"
              value={phone}
              onChange={handleInputPhone}
            />
          </div>
        </section>
      </section>
      <Button
        labelName="다음"
        className="mb-8"
        onClick={handleNext}
        disabled={!isValid}
      />
    </div>
  );
}
