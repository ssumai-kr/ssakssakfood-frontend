import Button from "@/components/Button";
import Congratulations from "@/assets/icons/congratulations.svg";
import { useOnboardingState } from "@/store/useOnboardingStore";
import { useNavigate } from "react-router-dom";
export default function OnBoardingComplete() {
  const { nickname } = useOnboardingState();
  const navigate = useNavigate();
  return (
    <div className="flex items-center flex-col min-h-dvh justify-between">
      <div className="flex-1 flex flex-col items-center justify-center  ">
        <img src={Congratulations} alt="" className="mx-auto block" />
        <p className="text-xl font-bold text-main1">가입완료!</p>
        <div className="text-2xl font-bold">
          <p>{nickname}님,</p>
          <p>환영해요</p>
        </div>
      </div>
      <Button
        labelName={"완료"}
        className="mb-8"
        disabled={false}
        onClick={() => navigate("/login")}
      />
    </div>
  );
}
