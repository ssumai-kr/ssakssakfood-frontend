import SplashIcon from "@/assets/images/splashLogo.png";
import useSplashStore from "../../store/useSplashStore";
import { useEffect } from "react";

export default function SplashScreen() {
  const { isSplashShown, showSplash } = useSplashStore();

  useEffect(() => {
    if (!isSplashShown) {
      showSplash();
    }
  }, [isSplashShown, showSplash]);

  return (
    <div
      className=" w-full flex items-center justify-center bg-main1 animate-fade-out"
      style={{ height: "100dvh" }}
    >
      <img src={SplashIcon} className="px-6" alt="splash screen"></img>
    </div>
  );
}
