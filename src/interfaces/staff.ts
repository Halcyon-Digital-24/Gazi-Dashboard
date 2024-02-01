export interface IStaff {
  id: number;
  name: string;
  email: string;
  mobile: number;
  password: string;
  role_id: number;
  access_id: number;
  created_at: string;
  updated_at: string;
}

export interface IStaffResponse {
  message: string;
  data: {
    count: number;
    rows: IStaff[];
  };
}
