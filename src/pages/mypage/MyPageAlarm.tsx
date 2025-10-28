import PageHeader from "@/components/PageHeader";
import ToggleOn from "@/assets/images/toggle-on.png";
import ToggleOff from "@/assets/images/toggle-off.png";
import { useState } from "react";
export default function MypageAlarm() {
  const [isOn, setIsOn] = useState(false);
  return (
    <div>
      <PageHeader title="알림설정" />
      <div className="flex justify-between items-center mt-6">
        <div>
          <p className="mb-3 text-lg font-bold">앱 푸시 알림</p>
          <p className="body-r-16 text-grey-2">
            앱에서만 푸시 알림 설정이 가능해요
          </p>
        </div>
        <img
          src={isOn ? ToggleOn : ToggleOff}
          alt="알림 토글"
          className="flex shrink-0"
          onClick={() => setIsOn((pre) => !pre)}
        />
      </div>
    </div>
  );
}
