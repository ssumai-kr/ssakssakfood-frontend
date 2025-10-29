import PageHeader from "@/components/PageHeader";
import ImgUrl from "@/assets/images/progile.png";
import Camera from "@/assets/images/camera.png";
import MyPageInputField from "@/components/MyPageInputFiled";
import { useGetOwnerProfile, usePatchOwnerProfile } from "@/api/mypage/mypage";
import { useState } from "react";
import { useOwnerImg } from "@/api/mamber/onboarding";
export default function ManagerEdit() {
  const { data } = useGetOwnerProfile();
  console.log(data);
  type FieldKey = "nickname" | "name" | "password" | "phone";
  const [open, setOpen] = useState<Record<FieldKey, boolean>>({
    nickname: false,
    name: false,
    password: false,
    phone: false,
  });

  const toggle = (k: FieldKey) =>
    setOpen((prev) => ({ ...prev, [k]: !prev[k] }));

  const [form, setForm] = useState({
    nickname: "",
    loginId: "",
    password: "",
    phone: "",
  });

  const [preview, setPreview] = useState("");
  //폰번호 변경 + 대표자명변경
  const handleProfile = usePatchOwnerProfile();

  const phoneRegex = /^01[0-9]-[0-9]{4}-[0-9]{4}$/;
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
    setForm((prev) => ({ ...prev, phone: formatted }));
  };

  const onChangeNickname = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
      .slice(0, 20)
      .replace(/[^가-힣a-zA-Z\s\u1100-\u11FF\u3130-\u318F\uAC00-\uD7AF]/g, "");
    setForm((prev) => ({ ...prev, nickname: value }));
  };

  //전번

  //프로필 이미지
  const uploadStoreProfile = useOwnerImg();

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append("image", file);
    await uploadStoreProfile.mutateAsync({
      memberId: data?.id,
      body: formData,
    });
  };

  const isValidPhone = (v: string) => phoneRegex.test(v);
  const isValidnickName = (v: string) => /^.{2,20}$/.test(v);
  return (
    <div className=" flex flex-col min-h-dvh">
      <PageHeader title="내 정보 수정" />
      <div className="items-center flex justify-center flex-col ">
        <label htmlFor="profile" className="relative cursor-pointer">
          <div className="relative flex items-center justify-center">
            <img
              src={preview || data?.profileImageUrl || ImgUrl}
              alt=""
              className="mt-6 size-28 rounded-full shrink-0"
            />
            <img
              src={Camera}
              alt=""
              className="absolute right-0   bottom-0 size-9"
            />
          </div>
          <input
            type="file"
            className="hidden"
            id="profile"
            accept="image/*"
            onChange={handleImageChange}
          />
        </label>
        <MyPageInputField
          className="w-full mb-6 mt-8"
          labelName="대표자명"
          value={form.nickname}
          placeholder={data?.nickname}
          onChangeClick={() => toggle("nickname")}
          onChange={onChangeNickname}
          isChange={open.nickname}
          onChangeUser={() => {
            if (!isValidnickName(form.nickname)) {
              alert("2글자에서 20글자 사이로 입력해주세요");
              return;
            }

            // handleProfile.mutate(
            //   { phoneNumber: form.phone, ownerName: form.nickname },
            //   {
            //     onSuccess: () => {
            //       setForm((pre) => ({ ...pre, nickname: "" }));
            //     },
            //   },
            // );
          }}
        />
        <MyPageInputField
          className="w-full mb-6"
          labelName="가게명"
          value={form.nickname}
          placeholder={data?.store.name}
          onChangeClick={() => toggle("nickname")}
          onChange={onChangeNickname}
          isChange={open.nickname}
          onChangeUser={() => {
            if (!isValidnickName(form.nickname)) {
              alert("2글자에서 20글자 사이로 입력해주세요");
              return;
            }
            // handleNickName.mutate(form.nickname, {
            //   onSuccess: () => {
            //     setForm((pre) => ({ ...pre, nickname: "" }));
            //   },
            // });
          }}
        />

        <MyPageInputField
          className="w-full mb-6"
          labelName="전화번호 "
          placeholder={data?.phone?.replace(
            /^(\d{3})(\d{3,4})(\d{4})$/,
            "$1-$2-$3",
          )}
          value={form.phone}
          onChangeClick={() => toggle("phone")}
          onChange={handleInputPhone}
          isChange={open.phone}
          onChangeUser={() => {
            if (!isValidPhone(form.phone)) {
              alert("유효한 전화번호를 입력해주세요");
              return;
            }

            handleProfile.mutate(
              { phoneNumber: form.phone },
              {
                onSuccess: () => {
                  setForm((pre) => ({ ...pre, phone: "" }));
                },
              },
            );
          }}
        />
      </div>
    </div>
  );
}
