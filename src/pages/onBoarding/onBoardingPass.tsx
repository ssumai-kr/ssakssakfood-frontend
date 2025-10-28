import { useLocation, useNavigate } from "react-router-dom";
import { ProgressBar } from "../../components/ProgressBar";
import InputField2 from "../../components/InputField2";
import Button from "../../components/Button";
import { useState } from "react";
import { useOnboardingState } from "../../store/useOnboardingStore";
import { useForm } from "react-hook-form";
import CheckFullB from "@assets/icons/check-full-blue.svg";
import Check from "@assets/icons/check.svg";
import { useMutation } from "react-query";
import { UserSignUpRequestDto } from "@/types/onboarding";
import { onBoardingSignup } from "@/api/mamber/onboarding";
import PageHeader from "@/components/PageHeader";
import axiosLib from "axios";

export default function OnBoardingPassPage() {
  const navigate = useNavigate();
  const location = useLocation();

  //비번 볼래말래
  const [showPwd, setShowPwd] = useState<boolean>(false);
  const [showCheckPwd, setShowCheckPwd] = useState<boolean>(false);
  const { register, watch } = useForm({ mode: "onChange" });

  //회원가입
  const { email, nickname, phone, setTemp } = useOnboardingState();

  const pw = watch("password") || "";
  const pwChecked = watch("passwordCheck") || "";
  const id = watch("id") || "";
  const noSpacePattern = /^[^\s]{8,20}$/.test(pw);
  const pattern2 = /(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])/.test(pw);
  const hasConfirm = pwChecked?.length > 0;
  const isMatch = pw === pwChecked;

  //회원가입 하기
  const handleSignupForm = useMutation({
    mutationFn: (body: UserSignUpRequestDto) => onBoardingSignup(body),
    onSuccess: (data) => {
      console.log(data);
      const memberId = data.data.memberId;
      navigate("/onBoarding/card", { state: { memberId: memberId } });
    },
    onError: (err) => {
      if (axiosLib.isAxiosError(err)) {
        if (err.response?.data.code === "BAD_REQUEST") {
          alert(err.response.data.message);
        }
      }
    },
  });

  console.log(location.state);
  const handleNext = () => {
    if (location.state === "owner") {
      navigate("/onBoarding/owner");
      setTemp({ loginId: id, password: pw });
    } else {
      setTemp({ loginId: id, password: pw });
      navigate("/onBoarding/card");
      handleSignupForm.mutate({
        email,
        loginId: id,
        password: pw,
        nickname,
        phoneNumber: phone,
      });
    }
  };

  const idValid = /^[a-zA-Z0-9]{4,20}$/.test(id); //영어 숫자 2~20글자
  const nextBtn = idValid && noSpacePattern && pattern2 && isMatch;

  return (
    <div className="w-full flex flex-col min-h-dvh ">
      <section className="flex-1 ">
        <PageHeader title="회원가입" />

        <ProgressBar
          className="my-8"
          step={location.state === "owner" ? 2 : 4}
          owner={location.state === "owner" ? true : false}
        />
        {/* 아디 */}
        <div className="flex flex-col gap-6">
          <div>
            <p className="text-2xl font-bold">
              아이디와 비밀번호를 입력해주세요
            </p>
          </div>
          <div className=" flex flex-col justify-center mb-6">
            <p className="subtitle-b-16 mb-4">아이디</p>

            <InputField2
              placeholder={"아이디 입력"}
              className="w-full mb-3"
              register={register("id")}
            />

            <div className="flex gap-2 items-center">
              {<img src={idValid ? CheckFullB : Check} alt="" />}
              <p
                className={`caption-r-12 ${idValid ? "text-main2" : "text-grey-3"} `}
              >
                아이디는 영어와 숫자로만 구성
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center w-full ">
          <p className="subtitle-b-16 mb-4">비밀번호</p>

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
            <img src={pattern2 ? CheckFullB : Check} alt="" className="mb-1" />
            <p
              className={`mb-4 caption-r-12 ${pattern2 ? "text-main2" : "text-grey-3"} `}
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
          className="mb-3"
        />
        {hasConfirm && (
          <p
            className={`caption-r-12 mb-3 ${isMatch ? "text-main2" : "text-main1"}`}
          >
            {isMatch
              ? "비밀번호가 일치합니다."
              : "비밀번호가 일치하지 않습니다."}
          </p>
        )}
      </section>

      <Button
        labelName={"다음"}
        className="mb-8"
        disabled={!nextBtn}
        onClick={handleNext}
      />
    </div>
  );
}
