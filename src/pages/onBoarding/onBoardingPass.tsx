import { useNavigate } from "react-router-dom";
import { ProgressBar } from "../../components/ProgressBar";
import InputField2 from "../../components/InputField2";
import Button from "../../components/Button";
import { useEffect, useState } from "react";
import { useOnboardingState } from "../../store/useOnboardingStore";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import type { UserSignUpRequestDto } from "../../types/onboarding";
import { onBoardingSignup } from "../../api/mamber/onboarding";
import ChevronL from "@assets/icons/chevron-left.svg";
import CheckFullB from "@assets/icons/check-full-blue.svg";
import Check from "@assets/icons/check.svg";
export default function OnBoardingPassPage() {
  const navigate = useNavigate();

  const { setTemp, email, loginId, password, nickname } = useOnboardingState();
  const [step, setStep] = useState(1);
  const [idValue, setIdValue] = useState<string>("");
  const [isInputValid, setIsInputValid] = useState(false);
  //비번 볼래말래
  const [showPwd, setShowPwd] = useState<boolean>(false);
  const [showCheckPwd, setShowCheckPwd] = useState<boolean>(false);
  const IdRegex = /^.{4,}$/;
  const handleInputId = (e: React.ChangeEvent<HTMLInputElement>) => {
    const id = e.target.value;
    setIdValue(id);
    setIsInputValid(IdRegex.test(id));
  };

  const { register, watch, reset } = useForm({ mode: "onChange" });

  const pw = watch("password");
  const noSpacePattern = /^[^\s]{8,20}$/.test(pw);
  const pattern2 = /(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])/.test(pw);
  const pwCheck = watch("passwordCheck") === watch("password");

  //회원가입 하기
  const handleSignupForm = useMutation({
    mutationFn: (body: UserSignUpRequestDto) => onBoardingSignup(body),
    onSuccess: () => {
      console.log("성공");
      navigate("/");
    },
    onError: (err) => console.log(err),
  });

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
      setIdValue("");
      setIsInputValid(false);
      setTemp({ loginId: idValue });
    } else {
      handleSignupForm.mutate({
        email,
        loginId,
        password: pw,
        nickname: nickname,
        phoneNumber: "010-1234-5678",
      });
    }
  };

  useEffect(() => {
    if (step === 2) {
      reset({ password: "", passwordCheck: "" });
      setShowPwd(false);
      setShowCheckPwd(false);
    }
  }, [step, reset]);

  const nextBtn = pwCheck && noSpacePattern && pattern2;

  console.log(email, loginId, password, nickname);
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
        <ProgressBar width={"354"} className="mb-8" />

        {step === 1 ? (
          <section className="flex flex-col gap-6">
            <div>
              <p className="text-2xl font-bold mb-2">{"ID를 입력해주세요"}</p>
              <p className="body-r-14 text-grey-3">
                본인 인증을 위해 필요해요.
              </p>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <InputField2
                placeholder={"아이디 입력"}
                className="w-full"
                value={idValue}
                onChange={handleInputId}
              />
            </div>
          </section>
        ) : (
          <section className="flex flex-col gap-6">
            <p className="text-2xl font-bold mb-2">비밀번호를 입력해주세요</p>
            {/* 다음 */}
            <div className="flex flex-col justify-center w-full">
              <InputField2
                placeholder={"비밀번호 입력"}
                className="mb-3"
                type={showPwd ? "text" : "password"}
                icon={true}
                onClick={() => setShowPwd((pre) => !pre)}
                register={register("password")}
                showPwd={showPwd}
              />
              <div className="flex gap-2 items-center">
                {
                  <img
                    src={noSpacePattern ? CheckFullB : Check}
                    alt=""
                    className="mb-1"
                  />
                }
                <p
                  className={`mb-1 caption-r-12 ${noSpacePattern ? "text-main2" : "text-grey-3"} `}
                >
                  공백없이 8자~20자
                </p>
              </div>
              <div className="flex gap-2 items-center">
                <img
                  src={pattern2 ? CheckFullB : Check}
                  alt=""
                  className="mb-1"
                />
                <p
                  className={`mb-1 caption-r-12 ${pattern2 ? "text-main2" : "text-grey-3"} `}
                >
                  대소문자, 숫자, 특수문자 1개 이상 포함
                </p>
              </div>
            </div>
            {/* 다음 */}

            <InputField2
              placeholder={"비밀번호 확인"}
              icon={true}
              type={showCheckPwd ? "text" : "password"}
              onClick={() => setShowCheckPwd((pre) => !pre)}
              showPwd={showCheckPwd}
              register={register("passwordCheck")}
            />
          </section>
        )}
      </section>

      <Button
        labelName={step === 1 ? "다음" : "회원가입 완료"}
        className="mb-8"
        disabled={step === 1 ? !isInputValid : !nextBtn}
        onClick={handleNext}
      />
    </div>
  );
}
