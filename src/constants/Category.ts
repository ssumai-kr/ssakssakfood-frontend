import categoryBread from "@/assets/icons/category-bread.svg";
import categoryPackmeal from "@/assets/icons/category-packmeal.svg";
import categoryIngredients from "@/assets/icons/category-ingredients.svg";
import categoryRestaurant from "@/assets/icons/category-resaurant.svg";
import categoryMarket from "@/assets/icons/category-market.svg";
import categoryConvenience from "@/assets/icons/category-convenience.svg";
import categoryShare from "@/assets/icons/category-share.svg";
import categorySsakssakstore from "@/assets/icons/category-ssakssakstore.svg";

export type CategorySlugType =
  | "breads"
  | "packedmeal"
  | "ingredients"
  | "restaurant"
  | "market"
  | "convenience"
  | "sharing"
  | "ssakssakstore";

export type CategoryLabelType =
  | "빵/디저트"
  | "도시락/반찬"
  | "식자재"
  | "식당/조리"
  | "시장"
  | "편의점"
  | "나눔"
  | "착한가게";

export type CategoryItem = {
  label: CategoryLabelType;
  slug: CategorySlugType;
  icon: string;
};

export const CATEGORY: CategoryItem[] = [
  {
    label: "빵/디저트",
    slug: "breads",
    icon: categoryBread,
  },
  {
    label: "도시락/반찬",
    slug: "packedmeal",
    icon: categoryPackmeal,
  },
  {
    label: "식자재",
    slug: "ingredients",
    icon: categoryIngredients,
  },
  {
    label: "식당/조리",
    slug: "restaurant",
    icon: categoryRestaurant,
  },
  {
    label: "시장",
    slug: "market",
    icon: categoryMarket,
  },
  {
    label: "편의점",
    slug: "convenience",
    icon: categoryConvenience,
  },
  {
    label: "나눔",
    slug: "sharing",
    icon: categoryShare,
  },
  {
    label: "착한가게",
    slug: "ssakssakstore",
    icon: categorySsakssakstore,
  },
];
