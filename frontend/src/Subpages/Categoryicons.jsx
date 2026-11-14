import React from "react";
import {
  House,
  ShoppingCart,
  Car,
  Film,
  Plane,
  Utensils,
  ShoppingBag,
  Zap,
  Briefcase,
  Gift,
  CirclePlus,
  Ellipsis,
  TrendingUp,
} from "lucide-react";

export const HouseIcon = (props) => <House {...props} />;
export const ShoppingCartIcon = (props) => <ShoppingCart {...props} />;
export const CarIcon = (props) => <Car {...props} />;
export const FilmIcon = (props) => <Film {...props} />;
export const PlaneIcon = (props) => <Plane {...props} />;
export const UtensilsIcon = (props) => <Utensils {...props} />;
export const ShoppingBagIcon = (props) => <ShoppingBag {...props} />;
export const ZapIcon = (props) => <Zap {...props} />;
export const BriefcaseIcon = (props) => <Briefcase {...props} />;
export const GiftIcon = (props) => <Gift {...props} />;
export const CirclePlusIcon = (props) => <CirclePlus {...props} />;
export const TrendingUpIcon = (props) => <TrendingUp {...props} />;
export const EllipsisIcon = (props) => <Ellipsis {...props} />;

export const iconMap = {
  House: HouseIcon,
  Shoppingcart: ShoppingCartIcon,
  Car: CarIcon,
  Film: FilmIcon,
  Plane: PlaneIcon,
  Utensils: UtensilsIcon,
  Shoppingbag: ShoppingBagIcon,
  Zap: ZapIcon,
  Briefcase: BriefcaseIcon,
  Gift: GiftIcon,
  Circleplus: CirclePlusIcon,
  Trendingup: TrendingUpIcon,
  Ellipsis: EllipsisIcon,
};

export default function CategoryIconsPlaceholder() {
  return <div></div>;
}
