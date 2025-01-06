type OrderItem = {
  id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  product_attribute: string;
  quantity: number;
  regular_price: number;
  discount_price: number;
  created_at: string; // Assuming it's a date string in ISO format
  updated_at: string; // Assuming it's a date string in ISO format
};

export interface IOrder {
  id: number;
  user_id: number;
  product_name: string;
  name: string;
  email: string;
  mobile: string;
  address: string;
  city: string;
  thana: string;
  payment_method: string;
  payment_status: string;
  delivery_method: string;
  delivery_fee: number;
  advance_payment: number;
  transaction_id: string;
  discount: number;
  orderItems: OrderItem[];
  final_price: number;
  order_status: string;
  created_at: string;
  updated_at: string;
  order_form: string;
  order_prefix: string;
  total_item: number;
  custom_discount: number;
  note: string;
  coupon_code: null | string;
  coupon: any;
  invoice_no?: any;
}

export type ISingleOrder = {
  id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  product_attribute: null | string;
  quantity: number;
  regular_price: number;
  discount_price: number;
  created_at: string;
  updated_at: string;
};

export interface IOrderResponse {
  message: string;
  data: { count: number; rows: IOrder[] };
}
