import { useState } from "react";
import Button from "../../components/Button";
import InputField2 from "../../components/InputField2";
import { ProgressBar } from "../../components/ProgressBar";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "react-query";

import type { EmailRequestDTO, EmailSend } from "../../types/onboarding";
import {
  onBoardingEmail,
  onBoardingEmailCode,
} from "../../api/mamber/onboarding";
import { useOnboardingState } from "../../store/useOnboardingStore";
import PageHeader from "@/components/PageHeader";
import Modal from "@/components/onBoarding/Modal";

export default function OnBoardingConfirmPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const { setTemp, email } = useOnboardingState();

  const [emailValue, setEmailValue] = useState<string>(email || "");
  const [codeValue, setCodeValue] = useState<string>("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const codeRegex = /^\d{6}$/;
  //이메일 전후
  const [isVerify, setIsVerify] = useState<boolean>(false);

  const isValid =
    emailRegex.test(emailValue.trim()) && codeRegex.test(codeValue.trim());

  //이메일전송
  const sendEmail = useMutation({
    mutationFn: (body: EmailSend) => onBoardingEmail(body),
    onMutate: () => {
      setModal(true);
    },
    onSuccess: () => {
      setTemp({ email: emailValue });
      setIsVerify(true);
      setCodeValue("");
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
      console.log(location.state);
      if (location.state === "owner") {
        navigate("/onboarding/pass", { state: "owner" });
      } else {
        navigate("/onBoarding/number");
      }
    },
    onError: (err) => console.log(err),
  });
  console.log(location.state);

  const handleNext = () => {
    const email = emailValue.trim();
    if (!isVerify) {
      sendEmail.mutate({ email: email });
    } else {
      const code = codeValue.trim();
      sendCode.mutate({ email, code });
    }
  };

  const [modal, setModal] = useState<boolean>(false);

  const closeModal = () => {
    setModal(false);
  };

  return (
    <div className="w-full flex flex-col min-h-dvh ">
      <section className="flex-1 ">
        <PageHeader title={"회원가입"} />
        <ProgressBar
          step={location.state === "owner" ? 1 : 2}
          className="my-8"
          owner={location.state === "owner" ? true : false}
        />
        <section className="flex flex-col gap-6">
          <div>
            <p className="text-2xl font-bold mb-2">이메일을 입력해주세요</p>
            <p className="body-r-14 text-grey-3">본인 인증을 위해 필요해요.</p>
          </div>
          <div className="">
            <div className="flex items-center gap-2 mb-4">
              <InputField2
                placeholder="이메일 입력"
                className="w-full"
                value={emailValue}
                onChange={(e) => setEmailValue(e.target.value.trim())}
              />
              <div>
                <button
                  className="min-w-25 px-3 flex h-12 rounded-lg items-center justify-center text-white button-sb-14 bg-main1"
                  onClick={handleNext}
                  // disabled={!nicknameValue.trim() || isFetching}
                  disabled={
                    isVerify ||
                    !emailRegex.test(emailValue.trim()) ||
                    sendEmail.isLoading
                  }
                >
                  인증번호 전송
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <InputField2
                placeholder="인증번호 입력"
                className="w-full"
                value={codeValue}
                onChange={(e) => setCodeValue(e.target.value.trim())}
              />
            </div>
          </div>
        </section>
      </section>
      <Button
        labelName={"다음"}
        className="mb-8"
        onClick={handleNext}
        disabled={!isValid || sendEmail.isLoading || sendCode.isLoading}
      />
      {modal && (
        <Modal
          closeModal={closeModal}
          title="인증번호가 전송되었어요!"
          subTitle="이메일함을 확인해보세요"
        />
      )}
    </div>
  );
}
