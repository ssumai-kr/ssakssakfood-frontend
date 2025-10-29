import Button from "@/components/Button";
import InputField2 from "@/components/InputField2";
import PageHeader from "@/components/PageHeader";
import { ProgressBar } from "@/components/ProgressBar";
import { useOnboardingState } from "@/store/useOnboardingStore";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

export default function OwnerInformation() {
  //유효성
  const [isValid, setIsValid] = useState(false);
  const {
    setTemp,
    businessRegistrationNumber: storeNumber,
    ownerName: ownerNickName,
  } = useOnboardingState();
  const [number, setNumber] = useState(storeNumber ?? "");

  const { register, watch } = useForm({
    defaultValues: {
      ownerName: ownerNickName,
    },
  });
  const navigate = useNavigate();
  const ownerName = watch("ownerName") || "";
  const handleInputNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    const number = e.target.value.replace(/[^0-9]/g, ""); //t숫자만
    let formatted = "";
    if (number.length < 4) {
      // 123-45-67890
      formatted = number;
    } else if (number.length < 6) {
      formatted = `${number.slice(0, 3)}-${number.slice(3)}`;
    } else {
      formatted = `${number.slice(0, 3)}-${number.slice(3, 5)}-${number.slice(5, 10)}`;
    }
    setNumber(formatted);
    const nameCheck = watch("ownerName")?.trim().length >= 2;
    const numberCheck = /^\d{3}-\d{2}-\d{5}$/.test(formatted);
    setIsValid(nameCheck && numberCheck);
  };

  useEffect(() => {
    const numberCheck = /^\d{3}-\d{2}-\d{5}$/.test(number);
    const nameCheck = ownerName.trim().length >= 2;
    setIsValid(numberCheck && nameCheck);
  }, [number, ownerName]);

  const handleNext = () => {
    setTemp({ businessRegistrationNumber: number, ownerName: ownerName });
    navigate("/onBoarding/store");
  };
  return (
    <div className="w-full flex flex-col min-h-dvh ">
      <section className="flex-1 ">
        <PageHeader title={"회원가입"} />
        <ProgressBar step={3} className="my-8" owner={true} />
        <section className="flex flex-col gap-6">
          <div>
            <p className="text-2xl font-bold mb-2">
              사업자등록번호와 대표자명을
              <br />
              입력해주세요
            </p>
          </div>
          <div>
            <p className="subtitle-b-16 mb-4">사업자등록번호</p>

            <InputField2
              placeholder={"사업자등록번호 입력"}
              className="w-full"
              value={number}
              onChange={handleInputNumber}
            />
          </div>
          <div>
            <p className="subtitle-b-16 mb-4">대표자명</p>

            <InputField2
              placeholder={"대표자명 입력"}
              className="w-full mb-3"
              register={register("ownerName")}
            />
          </div>
        </section>
      </section>
      <Button
        labelName={"다음"}
        className="mb-8"
        onClick={handleNext}
        disabled={!isValid}
      />
    </div>
  );
}
