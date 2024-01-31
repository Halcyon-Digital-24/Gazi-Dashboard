export interface IRole {
  id: number;
  name: string;
  permissions: string;
  created_at: string;
  updated_at: string;
}

export interface IRoleResponse {
  message: string;
  data: {
    count: number;
    rows: IRole[];
  };
}
