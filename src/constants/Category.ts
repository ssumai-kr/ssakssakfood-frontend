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
    icon: "/src/assets/icons/category-bread.svg",
  },
  {
    label: "도시락/반찬",
    slug: "packedmeal",
    icon: "/src/assets/icons/category-packmeal.svg",
  },
  {
    label: "식자재",
    slug: "ingredients",
    icon: "/src/assets/icons/category-ingredients.svg",
  },
  {
    label: "식당/조리",
    slug: "restaurant",
    icon: "/src/assets/icons/category-resaurant.svg",
  },
  {
    label: "시장",
    slug: "market",
    icon: "/src/assets/icons/category-market.svg",
  },
  {
    label: "편의점",
    slug: "convenience",
    icon: "/src/assets/icons/category-convenience.svg",
  },
  {
    label: "나눔",
    slug: "sharing",
    icon: "/src/assets/icons/category-share.svg",
  },
  {
    label: "착한가게",
    slug: "ssakssakstore",
    icon: "/src/assets/icons/category-ssakssakstore.svg",
  },
];
