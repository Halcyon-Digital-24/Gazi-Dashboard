export type ICategory = {
  id?: number;
  title: string;
  slug: string;
  parent_category?: string;
  is_feature: boolean;
  image?: File | null | string;
  meta_title?: string;
  meta_description?: string;
  meta_image?: File | null;
  updated_at?: string;
  created_at?: string;
};

export interface ICategoryResponse {
  data: {
    count: number;
    rows: ICategory[];
  };
}
