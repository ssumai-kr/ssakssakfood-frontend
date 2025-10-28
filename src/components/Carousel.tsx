import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import main1 from "@/assets/images/main1.png";

export default function Carousel() {
  const settings = {
    className: "center",
    centerMode: true,
    infinite: true,
    centerPadding: "0px",
    slidesToShow: 1,
    speed: 500,
    dots: true,
    arrows: false,
  };
  return (
    <div className="slider-container">
      <Slider {...settings}>
        <div className="px-0">
          <div className="bg-amber-200 flex justify-center items-center h-[160px] shadow cursor-pointer overflow-hidden">
            <img
              src={main1}
              alt="메인"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="px-0">
          <div className="bg-amber-500 flex justify-center items-center h-[160px] shadow cursor-pointer overflow-hidden">
            <img
              src={main1}
              alt="메인"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="px-0">
          <div className="bg-amber-700 flex justify-center items-center h-[160px] shadow cursor-pointer overflow-hidden">
            <img
              src={main1}
              alt="메인"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </Slider>
    </div>
  );
}
