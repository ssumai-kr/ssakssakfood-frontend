import { useState } from "react";
import Button from "../../components/Button";
import InputField2 from "../../components/InputField2";
import { ProgressBar } from "../../components/ProgressBar";
import { useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import ChevronL from "@assets/icons/chevron-left.svg";

import type { EmailRequestDTO, EmailSend } from "../../types/onboarding";
import {
  onBoardingEmail,
  onBoardingEmailCode,
} from "../../api/mamber/onboarding";
import { useOnboardingState } from "../../store/useOnboardingStore";

export default function OnBoardingConfirmPage() {
  const navigate = useNavigate();

  const [emailValue, setEmailValue] = useState<string>("");
  const [codeValue, setCodeValue] = useState<string>("");

  const { setTemp } = useOnboardingState();

  //next 상태 관리
  const [isVerify, setIsVerify] = useState<boolean>(false);
  //유효성 관리
  const [isInputValid, setIsInputValid] = useState(false);

  //이메일전송
  const sendEmail = useMutation({
    mutationFn: (body: EmailSend) => onBoardingEmail(body),
    onSuccess: () => {
      setTemp({ email: emailValue });
      setIsVerify(true);
      setCodeValue("");
      setIsInputValid(false);
    },
    onError: (err) => {
      console.log(err);
    },
  });

  //코드 인증
  const sendCode = useMutation({
    mutationFn: (body: EmailRequestDTO) => onBoardingEmailCode(body),
    onSuccess: () => {
      console.log("성공");
      navigate("/onBoardingPassPage");
    },
    onError: (err) => console.log(err),
  });

  const handleNext = () => {
    const email = emailValue.trim();
    if (!isVerify) {
      sendEmail.mutate({ email: email });
    } else {
      const code = codeValue.trim();
      sendCode.mutate({ email, code });
    }
  };

  //이메일 (email기본형식)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const handleInputEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const emailValue = e.target.value;
    setEmailValue(emailValue);
    setIsInputValid(emailRegex.test(emailValue));
  };

  //인증코드 (6글자 숫자)
  const codeRegex = /^\d{6}$/;
  const handleInputCode = (e: React.ChangeEvent<HTMLInputElement>) => {
    const codeValue = e.target.value;
    setCodeValue(codeValue);
    setIsInputValid(codeRegex.test(codeValue));
  };

  return (
    <div className="w-full flex flex-col min-h-dvh ">
      <section className="flex-1 ">
        <header className="h-12 relative flex items-center self-stretch justify-center mb-8">
          <img
            src={ChevronL}
            alt="뒤로가기"
            className=" absolute left-0 cursor-pointer"
            onClick={() => navigate(-1)}
          />
          <p className="subtitle-b-18 text-center">회원가입</p>
        </header>
        <ProgressBar width={isVerify ? "264" : "176"} className="mb-8" />
        <section className="flex flex-col gap-6">
          <div>
            <p className="text-2xl font-bold mb-2">
              {isVerify ? "인증번호를 입력해주세요" : "이메일을 입력해주세요"}
            </p>
            <p className="body-r-14 text-grey-3">본인 인증을 위해 필요해요.</p>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <InputField2
              placeholder={isVerify ? "인증번호 입력" : "이메일 입력"}
              className="w-full"
              value={isVerify ? codeValue : emailValue}
              onChange={isVerify ? handleInputCode : handleInputEmail}
            />
          </div>
        </section>
      </section>
      <Button
        labelName={isVerify ? "다음" : "인증번호 전송"}
        className="mb-8"
        onClick={handleNext}
        disabled={!isInputValid}
      />
    </div>
  );
}
