import { useState } from "react";
import Button from "../../components/Button";
import TermText from "../../components/Login/TermText";
import { useNavigate } from "react-router-dom";
import ChevronL from "@assets/icons/chevron-left.svg";
import CheckFull from "@assets/icons/check-full.svg";
import CheckC from "@assets/icons/check-circle.svg";

export default function TermPage() {
  const [serviceAgree, setServiceAgree] = useState<boolean>(false);
  const [privacyAgree, setPrivacyAgree] = useState<boolean>(false);
  const [marketingAgree, setMarketingAgree] = useState<boolean>(false);

  const allChecked = serviceAgree && privacyAgree && marketingAgree;

  const allTermAgree = () => {
    const next = !allChecked;
    setServiceAgree(next);
    setPrivacyAgree(next);
    setMarketingAgree(next);
  };

  const navigate = useNavigate();

  const isFormValid = serviceAgree && privacyAgree;
  return (
    <div className="w-full flex flex-col min-h-dvh ">
      <section className="flex-1 ">
        <header className="h-12 relative flex items-center self-stretch justify-center mb-8">
          <img src={ChevronL} alt="뒤로가기" className=" absolute left-0" />
          <p className="subtitle-b-18 text-center">서비스 이용 동의</p>
        </header>
        <div className="text-2xl font-bold mb-8">
          <p>"싹싹푸드" 사용을 위한</p>
          <p>약관 동의가 필요해요</p>
        </div>
        <section className="flex flex-col items-center gap-6">
          <div className="bg-grey-5 rounded-lg flex gap-2 w-full p-4">
            <img
              src={allChecked ? CheckFull : CheckC}
              alt="약관 동의"
              className="pr-2"
              onClick={allTermAgree}
            />
            <p>모든 약관에 동의합니다</p>
          </div>
          {/* 짜투리 */}
          <div className="w-full flex flex-col gap-4">
            <TermText
              text="(필수) 서비스 이용약관 동의"
              onClick={() => setServiceAgree((pre) => !pre)}
              checked={serviceAgree}
            />
            <TermText
              text="(필수) 개인정보 처리방침 동의"
              onClick={() => setPrivacyAgree((pre) => !pre)}
              checked={privacyAgree}
            />
            <TermText
              text="(선택) 마케팅 정보 수신 동의"
              onClick={() => setMarketingAgree((pre) => !pre)}
              checked={marketingAgree}
            />
          </div>
        </section>
      </section>
      {/* 버튼 */}
      <div className="mb-8">
        <Button
          labelName="다음"
          disabled={!isFormValid ? true : false}
          onClick={() => navigate("/onboarding")}
          className="w-full"
        />
      </div>
    </div>
  );
}
