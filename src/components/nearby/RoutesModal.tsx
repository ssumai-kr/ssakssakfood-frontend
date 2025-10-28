import { NearbyResponseDto } from "@/types/nearby";
import { useNavigate } from "react-router-dom";
import Dlete from "@/assets/icons/x-circle-thin.svg";
import { useState } from "react";
import { useRouteDelete } from "@/api/nearby/nearby";

interface RoutesModalProps {
  onCloseModal: () => void;
  data: NearbyResponseDto[];
  onSelectItem: (item: NearbyResponseDto) => void;
}

export default function RoutesModal({
  onCloseModal,
  data,
  onSelectItem,
}: RoutesModalProps) {
  const navigate = useNavigate();
  const [isEdit, setIsEdit] = useState(false);
  const deleteRoute = useRouteDelete();

  return (
    <>
      <div
        className="absolute inset-0 bg-black/40 z-[1100]"
        onClick={onCloseModal}
      />
      <div
        className="fixed left-1/2 bottom-0 -translate-x-1/2 w-full max-w-[401px]
                       pt-5 pb-8 bg-white rounded-t-2xl z-[1101]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col w-full items-start gap-1 px-6">
          <div className="flex items-center justify-between w-full">
            <p className="subtitle-b-16">내 루트</p>
            <button
              className="py-1 px-3 rounded-sm bg-grey-5 body-r-14 "
              onClick={() => setIsEdit((pre) => !pre)}
            >
              {!isEdit ? "수정" : "저장"}
            </button>
          </div>
          {data?.length > 0 ? (
            <>
              {data?.map((item: NearbyResponseDto) => {
                return (
                  <>
                    <div className="flex items-center justify-between w-full">
                      <span
                        className="body-r-14 py-4 border-b-1 border-grey-5 w-full"
                        onClick={() => {
                          if (isEdit) {
                            navigate(`/nearby/edit/${item.routeId}`);
                          } else {
                            onSelectItem(item);
                          }
                        }}
                        key={item.routeId}
                      >
                        {item?.routeName}
                      </span>
                      {!isEdit || (
                        <img
                          src={Dlete}
                          alt="삭제하기"
                          className="size-6 cursor-pointer"
                          onClick={() => deleteRoute.mutate(item.routeId)}
                        />
                      )}
                    </div>
                  </>
                );
              })}
            </>
          ) : (
            <div className="flex flex-col justify-center items-center w-full text-grey-2 mb-6">
              <p>등록된 루트가 없어요!</p>
              <p>루트를 등록해볼까요?</p>
            </div>
          )}
          <button
            className="w-full flex h-12 py-4 px-5.32rem rounded-lg items-center justify-center
                           text-main1 subtitle-b-16 border-dashed border border-main1"
            onClick={() => navigate("/nearby/register")}
          >
            루트 등록하기
          </button>
        </div>
      </div>
    </>
  );
}
