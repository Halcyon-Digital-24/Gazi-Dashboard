export type ICampaign = {
  id: number;
  name: string | null;
  image: File | null;
  start_date: string;
  end_date: string;
  product_id: number | string;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
};
export interface ICampaignResponse {
  message: string;
  data: {
    count: number;
    rows: ICampaign[];
  };
}
