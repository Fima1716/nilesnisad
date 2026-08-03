export type Product = {
  id: number;
  slug: string;
  name: string;
  genus: string;
  genus_ru: string;
  species: string;
  cultivar: string;
  container: string;
  price: number;
  old_price: number | null;
  discount_percent: number | null;
  qty: number;
  is_new: boolean;
  rating: number;
  review_count: number;
  images: string[];
};

export type Category = {
  slug: string;
  label: string;
  count: number;
  image: string;
};

export type Review = {
  id: number;
  author: string;
  rating: number;
  date: string;
  text: string;
  photos: string[];
};

export type Stats = {
  total_varieties: number;
  total_seedlings: number;
  container: string;
};
