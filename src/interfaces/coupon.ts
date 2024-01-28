export type ICoupon = {
  id: number;
  code: string;
  expire_date: string | null;
  total_coupons: number | string;
  product_id: number | string | null;
  discount_amount: number;
  discount_type: "percent" | "flat";
  created_at: string;
  updated_at: string;
};
export interface ICouponResponse {
  message: string;
  data: {
    count: number;
    rows: ICoupon[];
  };
}
