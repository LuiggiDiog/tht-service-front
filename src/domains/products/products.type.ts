export type ProductT = {
  id: number;
  store_id: number;
  sku: string;
  name: string;
  description: string;
  image: string;
  images: string[];
  image_url: string;
  images_url: string[];
  thumb_url: string;
  cost: string;
  price: string;
  stock: number;
  status: string;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};
