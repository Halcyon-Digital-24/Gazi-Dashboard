export interface INotification {
  id?: number | string;
  title: string;
  details?: string;
  image?: string | File | null;
  created_at?: string;
  updated_at?: string;
}

export interface INotificationResponse {
  message: string;
  data: {
    count: number;
    rows: INotification[];
  };
}
