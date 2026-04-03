export type PreviewProps = {
  title?: string;
  thumbnail?: string;
  images?: string[];
  mrp?: number;
  sellingPrice?: number;
  sku?: string;
  categoryName?: string;
  brandName?: string;
  sizes?: string[];
  colors?: { name: string; hexCode?: string }[];
  longDescription?: string;
  additionalInformation?: string;
  isTrending?: boolean;
  isDealOfDay?: boolean;
  isActive?: boolean;
};
