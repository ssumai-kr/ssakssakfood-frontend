import { useState } from "react";
import CurrentDateDisplayWithDateObject from "@/utils/CurrentDate";
import chevronL from "@/assets/icons/chevron-right.svg";
import { MenuAddCard, MenuImgCard } from "@/components/MenuCard";
import addImg from "@/assets/icons/plus-orange.svg";
import OwnerFooterNav from "@/layout/OwnerFooterNav";
import { useNavigate } from "react-router-dom";
import StartSaleBottomSheet from "./UI/StartSaleBottomSheet";
import Modal from "@/components/onBoarding/Modal";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import { useGetOwnerProfile } from "@/api/mypage/mypage";
import {
  useGetTodayMenus,
  useGetAllStoreMenus,
  useDeleteMenu,
} from "@/api/menu/menu";
import basicImage from "@/assets/images/basic.svg";
import { useQueryClient } from "react-query";

export default function ManagerHome() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedMenuId, setSelectedMenuId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [modal, setModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [menuToDelete, setMenuToDelete] = useState<{
    id: number;
    name: string;
  } | null>(null);

  // API 호출
  const { data: ownerProfile } = useGetOwnerProfile();
  const storeId = ownerProfile?.store.id;
  const { data: todayMenus } = useGetTodayMenus(storeId || 0);
  const { data: allMenus } = useGetAllStoreMenus(storeId || 0);
  const deleteMenuMutation = useDeleteMenu();

  const handleStartSale = (menuId: number) => {
    setSelectedMenuId(menuId);
    setIsSheetOpen(true);
    console.log(selectedMenuId); //test
  };

  const handleConfirmSale = () => {
    // 바텀시트 먼저 닫기
    setIsSheetOpen(false);
    // 약간의 딜레이 후 모달 열기
    setTimeout(() => {
      setModal(true);
    }, 300);
  };

  const closeModal = () => {
    setModal(false);
    setSelectedMenuId(null);
    setQuantity(1);
  };

  const handleDeleteClick = (menuId: number, menuName: string) => {
    setMenuToDelete({ id: menuId, name: menuName });
    setDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!menuToDelete) return;

    try {
      await deleteMenuMutation.mutateAsync(menuToDelete.id);

      // 삭제 성공 후 목록 갱신
      queryClient.invalidateQueries(["allStoreMenus"]);
      queryClient.invalidateQueries(["todayMenus"]);

      // 모달 닫기 (편집 모드는 유지)
      setDeleteModal(false);
      setMenuToDelete(null);
    } catch (error) {
      console.error("메뉴 삭제 실패:", error);
      alert("메뉴 삭제에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleCancelDelete = () => {
    setDeleteModal(false);
    setMenuToDelete(null);
  };

  return (
    <>
      <div className="font-bold text-[20px] mt-[24px]">
        {CurrentDateDisplayWithDateObject()}
      </div>
      <div className="flex gap-[16px] items-center border-b border-gray-200 pb-[16px] mx-[-24px] px-[24px] py-[16px]">
        <img
          src={ownerProfile?.profileImageUrl || basicImage}
          alt="가게 이미지"
          className="w-[80px] h-[80px] rounded-full object-cover"
        />
        <div className="flex flex-col">
          <span className="text-[20px] font-bold">
            {ownerProfile?.store.name || ""}
          </span>
          <span className="text-[14px] text-gray-600">
            {ownerProfile?.store.roadAddress || ""}
          </span>
        </div>
      </div>
      <section className="mt-[20px]">
        <div className="flex justify-between items-center">
          <h2 className="text-[20px] font-bold flex gap-2">
            오늘의 판매 식품
            <span className="text-red">{todayMenus?.todayMenuCount || 0}</span>
          </h2>
          <div
            className="flex items-center text-[16px] text-[#7F7F7F] cursor-pointer gap-1"
            onClick={() => navigate("/allfoods")}
          >
            전체보기
            <img src={chevronL} alt="전체보기 아이콘" />
          </div>
        </div>
        <div
          className="flex gap-2 overflow-x-auto pb-[12px] mt-[24px]"
          style={{
            msOverflowStyle: "none",
            scrollbarWidth: "none",
          }}
        >
          {todayMenus?.menus.slice(0, 5).map((menu) => (
            <MenuImgCard
              key={menu.id}
              originalPrice={menu.originalPrice}
              salePrice={menu.discountPrice}
              name={menu.name}
              imageUrl={menu.imageUrl}
            />
          ))}
        </div>
      </section>
      <section className="mt-[24px] mb-[100px]">
        <div className="flex justify-between items-center">
          <h2 className="flex gap-2 text-[20px] font-bold">
            내 식품{" "}
            <span className="text-red">{allMenus?.totalMenuCount || 0}</span>
          </h2>
          {isEditMode ? (
            <div className="flex gap-2">
              <div
                className="w-[50px] h-[24px] bg-[#F3F3F3] rounded-md flex items-center justify-center cursor-pointer text-[14px]"
                onClick={() => setIsEditMode(false)}
              >
                취소
              </div>
            </div>
          ) : (
            <div
              className="w-[50px] h-[24px] bg-[#F3F3F3] rounded-md flex items-center justify-center cursor-pointer text-[14px]"
              onClick={() => setIsEditMode(true)}
            >
              수정
            </div>
          )}
        </div>
        {!isEditMode && (
          <div
            className="text-[16px] font-semibold text-[#FE7549] flex gap-2 justify-center items-center border-1 border-dashed border-[#FE7549] rounded-lg h-[48px] mt-[24px] cursor-pointer mb-[16px]"
            onClick={() => navigate("/addfood")}
          >
            <img src={addImg} alt="식품 추가 아이콘" />
            식품 추가하기
          </div>
        )}
        <div className={`flex flex-col gap-4 ${isEditMode ? "mt-[24px]" : ""}`}>
          {allMenus?.menus.map((menu) => (
            <MenuAddCard
              key={menu.id}
              id={menu.id}
              name={menu.name}
              originalPrice={menu.originalPrice}
              salePrice={menu.discountPrice}
              isEditMode={isEditMode}
              onStartSale={handleStartSale}
              onDelete={() => handleDeleteClick(menu.id, menu.name)}
              imgUrl={menu.imageUrl}
              category={menu.category}
            />
          ))}
        </div>
      </section>
      <footer className="fixed bottom-0 w-full max-w-[401px] bg-white border-t border-gray-100 z-10 mx-auto ml-[-24px]">
        <OwnerFooterNav />
      </footer>

      <StartSaleBottomSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        quantity={quantity}
        setQuantity={setQuantity}
        onConfirm={handleConfirmSale}
        menuId={selectedMenuId || undefined}
      />

      {/* 판매 시작 완료 모달 */}
      {modal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={closeModal}
          ></div>
          <div className="relative z-[101] w-full">
            <Modal
              closeModal={closeModal}
              title="식품이 판매 시작되었어요!"
              subTitle="판매되고 있는 식품은 오늘의 판매 식품에서
          확인하실 수 있어요"
            />
          </div>
        </div>
      )}

      {/* 삭제 확인 모달 */}
      <DeleteConfirmModal
        isOpen={deleteModal}
        menuName={menuToDelete?.name || ""}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </>
  );
}
