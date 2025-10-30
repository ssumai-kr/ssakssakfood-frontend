import { CategoryMiniBadge } from "@/components/CategoryBadge";
import { MenuHeader } from "@/components/Headers";
import ImagePickerBox from "@/components/ImagePickerBox";
import InputField2 from "@/components/InputField2";
import {
  CATEGORY,
  getCategoryId,
  type CategorySlugType,
} from "@/constants/Category";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import cornorImg from "@/assets/icons/corner-down-right.svg";
import { useUpdateMenu, useUploadMenuImage } from "@/api/menu/menu";
import { useQueryClient } from "react-query";

interface MenuState {
  id: number;
  name: string;
  originalPrice: number;
  salePrice: number;
  imgUrl: string;
  category?: string;
}

export default function AddFoodEditPage() {
  const location = useLocation();
  const menuData = location.state as MenuState | null;
  const queryClient = useQueryClient();

  // API hooks
  const updateMenuMutation = useUpdateMenu();
  const uploadImageMutation = useUploadMenuImage();

  // 기존 데이터 (location state에서 받아온 데이터로 초기화)
  const [foodName, setFoodName] = useState<string>(menuData?.name || "");
  const [selectedCategory, setSelectedCategory] = useState<string>(
    // category 이름을 slug로 변환 (예: "빵/디저트" -> "breads")
    CATEGORY.find((cat) => cat.label === menuData?.category)?.slug || "breads",
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  console.log(imageFile);

  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>(
    menuData?.imgUrl || "",
  );
  const [costPrice, setCostPrice] = useState<string>(
    menuData?.originalPrice.toString() || "",
  );
  const [sellingPrice, setSellingPrice] = useState<string>(
    menuData?.salePrice.toString() || "",
  );

  // 수정 중인 임시 데이터
  const [editingFoodName, setEditingFoodName] = useState<string>("");
  const [editingCategory, setEditingCategory] = useState<string>("");
  const [editingImageFile, setEditingImageFile] = useState<File | null>(null);
  const [editingImagePreviewUrl, setEditingImagePreviewUrl] =
    useState<string>("");
  const [editingCostPrice, setEditingCostPrice] = useState<string>("");
  const [editingSellingPrice, setEditingSellingPrice] = useState<string>("");

  // 각 필드의 수정 모드 상태
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingCategoryField, setIsEditingCategoryField] = useState(false);
  const [isEditingImage, setIsEditingImage] = useState(false);
  const [isEditingCost, setIsEditingCost] = useState(false);
  const [isEditingSelling, setIsEditingSelling] = useState(false);

  // 변경 버튼 핸들러
  const handleEditName = () => {
    setEditingFoodName(foodName);
    setIsEditingName(true);
  };

  const handleEditCategory = () => {
    setEditingCategory(selectedCategory);
    setIsEditingCategoryField(true);
  };

  const handleEditImage = () => {
    setIsEditingImage(true);
  };

  const handleEditCost = () => {
    setEditingCostPrice(costPrice);
    setIsEditingCost(true);
  };

  const handleEditSelling = () => {
    setEditingSellingPrice(sellingPrice);
    setIsEditingSelling(true);
  };

  // 변경 완료 버튼 핸들러
  const handleSaveName = async () => {
    if (!editingFoodName.trim() || !menuData) return;

    try {
      await updateMenuMutation.mutateAsync({
        menuId: menuData.id,
        body: { name: editingFoodName },
      });
      setFoodName(editingFoodName);
      setIsEditingName(false);

      // 캐시 무효화로 목록 자동 새로고침
      queryClient.invalidateQueries(["allStoreMenus"]);
      queryClient.invalidateQueries(["todayMenus"]);
    } catch (error) {
      console.error("식품 이름 수정 실패:", error);
      alert("식품 이름 수정에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleSaveCategory = async () => {
    if (!editingCategory || !menuData) return;

    try {
      const categoryId = getCategoryId(editingCategory as CategorySlugType);
      await updateMenuMutation.mutateAsync({
        menuId: menuData.id,
        body: { categoryId },
      });
      setSelectedCategory(editingCategory);
      setIsEditingCategoryField(false);

      // 캐시 무효화로 목록 자동 새로고침
      queryClient.invalidateQueries(["allStoreMenus"]);
      queryClient.invalidateQueries(["todayMenus"]);
    } catch (error) {
      console.error("카테고리 수정 실패:", error);
      alert("카테고리 수정에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleSaveImage = async () => {
    if (!editingImageFile || !editingImagePreviewUrl || !menuData) return;

    try {
      // 이미지 업로드 API 호출
      await uploadImageMutation.mutateAsync({
        menuId: menuData.id,
        imageFile: editingImageFile,
      });
      setImageFile(editingImageFile);
      setImagePreviewUrl(editingImagePreviewUrl);
      setIsEditingImage(false);

      // 캐시 무효화로 목록 자동 새로고침
      queryClient.invalidateQueries(["allStoreMenus"]);
      queryClient.invalidateQueries(["todayMenus"]);
    } catch (error) {
      console.error("이미지 수정 실패:", error);
      alert("이미지 수정에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleSaveCost = async () => {
    if (!editingCostPrice.trim() || !menuData) return;

    try {
      await updateMenuMutation.mutateAsync({
        menuId: menuData.id,
        body: { originalPrice: parseInt(editingCostPrice) },
      });
      setCostPrice(editingCostPrice);
      setIsEditingCost(false);

      // 캐시 무효화로 목록 자동 새로고침
      queryClient.invalidateQueries(["allStoreMenus"]);
      queryClient.invalidateQueries(["todayMenus"]);
    } catch (error) {
      console.error("원가 수정 실패:", error);
      alert("원가 수정에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleSaveSelling = async () => {
    if (!editingSellingPrice.trim() || !menuData) return;

    try {
      await updateMenuMutation.mutateAsync({
        menuId: menuData.id,
        body: { discountPrice: parseInt(editingSellingPrice) },
      });
      setSellingPrice(editingSellingPrice);
      setIsEditingSelling(false);

      // 캐시 무효화로 목록 자동 새로고침
      queryClient.invalidateQueries(["allStoreMenus"]);
      queryClient.invalidateQueries(["todayMenus"]);
    } catch (error) {
      console.error("판매가 수정 실패:", error);
      alert("판매가 수정에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <MenuHeader title="식품 정보 수정" />
      {/* 식품 이름 */}
      <div className="flex flex-col gap-2 justify-center relative">
        <div className="text-[16px] font-bold">식품 이름</div>
        <InputField2
          placeholder="상품 이름 입력"
          value={foodName}
          disabled={true}
        />
        <div
          className="text-orange-500 absolute top-11 right-4 cursor-pointer"
          onClick={
            isEditingName ? () => setIsEditingName(false) : handleEditName
          }
        >
          {isEditingName ? "변경 취소" : "변경"}
        </div>
      </div>
      {isEditingName && (
        <div className="flex gap-4 relative">
          <img src={cornorImg} alt="변경" />
          <div className="flex flex-col gap-2 w-full">
            <div className="text-[16px] font-bold">변경할 이름</div>
            <InputField2
              placeholder="변경할 이름 입력"
              inputClassName="pr-[80px]"
              value={editingFoodName}
              onChange={(e) => setEditingFoodName(e.target.value)}
            />
          </div>
          <div
            className="text-orange-500 absolute top-11 right-4 cursor-pointer text-[16px]"
            onClick={handleSaveName}
          >
            변경 완료
          </div>
        </div>
      )}
      <div className="flex flex-col relative">
        <div className="text-[16px] font-bold">카테고리</div>
        <div className="text-[14px] font-[500] text-[#A8A8A8] mt-2">
          카테고리는 1개만 선택 가능해요.
        </div>
        <div className="flex flex-wrap gap-2 max-w-[75%] mt-4">
          {CATEGORY.slice(0, -2).map((category) => (
            <CategoryMiniBadge
              key={category.slug}
              label={category.label}
              active={selectedCategory === category.slug}
              onClick={() => {}}
            />
          ))}
        </div>
        <div
          className="text-orange-500 absolute top-0 right-0 cursor-pointer bg-[#F3F3F3] px-[16px] py-[6px] rounded-md"
          onClick={
            isEditingCategoryField
              ? () => setIsEditingCategoryField(false)
              : handleEditCategory
          }
        >
          {isEditingCategoryField ? "변경 취소" : "변경"}
        </div>
      </div>
      {isEditingCategoryField && (
        <div className="flex gap-4 relative">
          <img src={cornorImg} alt="변경" />
          <div className="flex flex-col w-full">
            <div className="text-[16px] font-bold">변경할 카테고리</div>
            <div className="text-[14px] font-[500] text-[#A8A8A8]">
              카테고리는 1개만 선택 가능해요.
            </div>
            <div className="flex flex-wrap gap-2 max-w-[80%] mt-4">
              {CATEGORY.slice(0, -2).map((category) => (
                <CategoryMiniBadge
                  key={category.slug}
                  label={category.label}
                  active={editingCategory === category.slug}
                  onClick={() => setEditingCategory(category.slug)}
                />
              ))}
            </div>
          </div>
          <div
            className="text-orange-500 absolute top-0 right-0 cursor-pointer text-[16px] bg-[#F3F3F3] px-[12px] py-[6px] rounded-md"
            onClick={handleSaveCategory}
          >
            변경 완료
          </div>
        </div>
      )}
      <div className="relative">
        <div className="text-[16px] font-bold">사진 첨부</div>
        <div className="text-[14px] font-[500] text-[#A8A8A8] mt-2">
          사진은 1개만 첨부 가능해요.
        </div>
        <ImagePickerBox
          boxClass="w-[160px] h-[160px]"
          className="mt-[16px]"
          onChange={() => {}}
          disabled
          previewUrl={imagePreviewUrl}
        />
        <div
          className="text-orange-500 absolute top-0 right-0 cursor-pointer bg-[#F3F3F3] px-[16px] py-[6px] rounded-md"
          onClick={
            isEditingImage ? () => setIsEditingImage(false) : handleEditImage
          }
        >
          {isEditingImage ? "변경 취소" : "변경"}
        </div>
      </div>
      {isEditingImage && (
        <div className="flex gap-4 relative">
          <img src={cornorImg} alt="변경" />
          <div className="flex flex-col w-full">
            <div className="text-[16px] font-bold">변경할 사진</div>
            <div className="text-[14px] font-[500] text-[#A8A8A8]">
              사진은 1개만 첨부 가능해요.
            </div>
            <ImagePickerBox
              boxClass="w-[160px] h-[160px]"
              className="mt-[16px]"
              onChange={(file, previewUrl) => {
                setEditingImageFile(file);
                setEditingImagePreviewUrl(previewUrl);
              }}
            />
          </div>
          <div
            className="text-orange-500 absolute top-0 right-0 cursor-pointer text-[16px] bg-[#F3F3F3] px-[12px] py-[6px] rounded-md"
            onClick={handleSaveImage}
          >
            변경 완료
          </div>
        </div>
      )}
      <div className="flex flex-col gap-2 justify-center relative">
        <div className="text-[16px] font-bold">원가</div>
        <InputField2
          placeholder="상품 이름 입력"
          value={costPrice}
          disabled={true}
        />
        <div
          className="text-orange-500 absolute top-11 right-4 cursor-pointer"
          onClick={
            isEditingCost ? () => setIsEditingCost(false) : handleEditCost
          }
        >
          {isEditingCost ? "변경 취소" : "변경"}
        </div>
      </div>
      {isEditingCost && (
        <div className="flex gap-4 relative">
          <img src={cornorImg} alt="변경" />
          <div className="flex flex-col gap-2 w-full">
            <div className="text-[16px] font-bold">변경할 가격</div>
            <InputField2
              placeholder="변경할 가격 입력"
              inputClassName="pr-[80px]"
              type="number"
              value={editingCostPrice}
              onChange={(e) => setEditingCostPrice(e.target.value)}
            />
          </div>
          <div
            className="text-orange-500 absolute top-11 right-4 cursor-pointer text-[16px]"
            onClick={handleSaveCost}
          >
            변경 완료
          </div>
        </div>
      )}
      <div className="flex flex-col gap-2 justify-center relative">
        <div className="text-[16px] font-bold">판매가</div>
        <InputField2
          placeholder="상품 이름 입력"
          value={sellingPrice}
          disabled={true}
        />
        <div
          className="text-orange-500 absolute top-11 right-4 cursor-pointer"
          onClick={
            isEditingSelling
              ? () => setIsEditingSelling(false)
              : handleEditSelling
          }
        >
          {isEditingSelling ? "변경 취소" : "변경"}
        </div>
      </div>
      {isEditingSelling && (
        <div className="flex gap-4 relative">
          <img src={cornorImg} alt="변경" />
          <div className="flex flex-col gap-2 w-full">
            <div className="text-[16px] font-bold">변경할 가격</div>
            <InputField2
              placeholder="변경할 가격 입력"
              inputClassName="pr-[80px]"
              type="number"
              value={editingSellingPrice}
              onChange={(e) => setEditingSellingPrice(e.target.value)}
            />
          </div>
          <div
            className="text-orange-500 absolute top-11 right-4 cursor-pointer text-[16px]"
            onClick={handleSaveSelling}
          >
            변경 완료
          </div>
        </div>
      )}
    </div>
  );
}
