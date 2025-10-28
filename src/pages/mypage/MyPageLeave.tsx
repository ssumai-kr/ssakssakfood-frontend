import Button from "@/components/Button";
import PageHeader from "@/components/PageHeader";
import Check from "@/assets/icons/check-circle.svg";
import CheckFull from "@/assets/icons/check-full.svg";
import { useState } from "react";
import { useLeaveUser } from "@/api/nearby/nearby";

export default function MyPageLeave() {
  const [click, setClick] = useState(false);

  const leave = useLeaveUser();

  const handleLeave = () => {
    leave.mutate();
  };
  return (
    <div className="min-h-dvh flex flex-col">
      <PageHeader title="회원탈퇴" />
      <section className="flex-1">
        <p className="text-xl font-bold mt-6 mb-10">
          회원 탈퇴를 신청하기 전에
          <br />
          안내사항을 꼭 확인해주세요
        </p>
        <div>
          <p className="mb-6 font-semibold">
            {
              "  1. 탈퇴 시 해당 계정으로 '싹싹푸드'서비스를 더이상 사용할 수 없습니다."
            }
          </p>
          <div className="mb-6 flex flex-col">
            <p className="mb-4 font-semibold">
              {"  2. 모든 권리와 데이터가 영구적으로 삭제됩니다."}
            </p>
            <div className="text-sm text-grey-3">
              <p>
                탈퇴 후 회원 정보 및 서비스 이용 기록은 모두 삭제되어 복구가
                불가능합니다.
              </p>
              <p>
                삭제된 데이터는 복구되지 않습니다. 필요한 데이터는 미리
                백업해주세요.
              </p>
            </div>
          </div>
          <p className=" font-semibold">
            {
              " 3. 해당 계정으로 ‘싹싹푸드’에 재가입할 경우, 새로운 계정으로 간주됩니다."
            }
          </p>
        </div>
      </section>
      <div className="flex gap-2 mb-6">
        <img
          src={click ? CheckFull : Check}
          alt="동의"
          className=" "
          onClick={() => setClick((pre) => !pre)}
        />
        <p className="body-r-16">
          안내사항을 모두 확인하였으며, 이에 동의합니다.
        </p>
      </div>
      <Button
        labelName="회원탈퇴하기"
        className="mb-8"
        disabled={!click}
        onClick={handleLeave}
      />
    </div>
  );
}
