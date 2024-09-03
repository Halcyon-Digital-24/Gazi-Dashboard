export type IComment = {
  id: number;
  blog_id: number | null;
  name: string;
  email: string;
  comment: string;
  is_visible:boolean;
  updated_at?: string;
  created_at?: string;
};

export interface ICommentResponse {
  data: {
    count: number;
    rows: IComment[];
  };
}
