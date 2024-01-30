export interface ISupport {
  id: number;
  subject: string;
  details: string;
  user_id: string;
  parent_text_id: string;
  text_type: string;
  updated_at: string;
  created_at: string;
}

export interface ISupportResponse {
  message: string;
  data: {
    count: number;
    rows: ISupport[];
  };
}
