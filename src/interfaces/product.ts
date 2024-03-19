export interface IProduct {
  id?: number;
  title: string;
  slug: string;
  description: string;
  sort_description: string;
  image: string;
  default_quantity: string;
  regular_price: string;
  discount_price: string;
  delivery_fee: string;
  is_visible: 0 | 1;
  is_homepage: boolean;
  is_sale: boolean;
  is_feature: boolean;
  is_new: boolean;
  availability: boolean;
  video_url: string;
  camping_end_date?: string;
  upload_by?: string;
  meta_title?: string;
  meta_name?: string;
  meta_description?: string;
  updated_at?: string;
  created_at?: string;
}
export type IGalleryPhoto = {
  id: number;
  product_id: string;
  order_number: string;
  image: string;
  updated_at: string;
  created_at: string;
};

export interface IProductResponse {
  massage: string;
  data: { count: number; rows: IProduct[] };
}
