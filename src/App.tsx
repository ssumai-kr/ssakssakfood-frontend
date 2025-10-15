import { RouterProvider } from "react-router-dom";
import router from "./Router";
import useSplashStore from "@/store/useSplashStore";
import { useEffect } from "react";
import SplashScreen from "@/pages/login/SplashScreen";

function App() {
  const { isSplashShown, hasShownSplash, showSplash } = useSplashStore();
  useEffect(() => {
    // 스플래시 화면이 한 번도 표시되지 않은 경우에만 실행
    if (!hasShownSplash) {
      showSplash(); // 스플래시 화면 표시 및 상태 변경
    }
  }, [hasShownSplash, showSplash]);
  return (
    <div className="min-h-dvh bg-gray-50 flex justify-center">
      {/* 2. 메인 웹 앱 컨테이너:
          - max-w-[401px]: 최대 너비를 401px로 제한합니다. (Tailwind Arbitrary Value)
          - 웹앱 프로젝트 이므로, iphone 16pro 기준 401px로 고정
      */}
      <div className="w-full max-w-[401px] bg-white shadow-2xl">
        <main className="min-h-[calc(100vh-60px)] ">
          {isSplashShown ? (
            <SplashScreen />
          ) : (
            <RouterProvider router={router} />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
