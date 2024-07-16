import axios from '../../lib';

import {
  INotification,
  INotificationResponse,
} from '../../interfaces/notification';

export interface ICreateResponse {
  message: string;
  data: INotification[];
}

const createNotification = async (
  faqData: INotification
): Promise<Partial<ICreateResponse>> => {
  const { data } = await axios.post(`/notifications`, faqData);
  return data;
};

const getNotification = async (filter: {
  [key: string]: string | number | boolean;
}): Promise<INotificationResponse> => {
  let url = `/notifications`;

  // Filter out keys with false values
  const filteredFilter: { [key: string]: string | number | boolean } = {};
  Object.entries(filter).forEach(([key, value]) => {
    if (value !== false) {
      filteredFilter[key] = value;
    }
  });

  if (Object.keys(filteredFilter).length > 0) {
    const queryString = Object.entries(filteredFilter)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value.toString())}`
      )
      .join('&');

    // Add query string to the URL
    url += `?${queryString}`;
  }
  const { data } = await axios.get(url);
  return data;
};
const deleteNotification = async (id: number | string) => {
  const { data } = await axios.delete(`/notifications?ids=[${id}]`);
  return data.data;
};

const NotificationService = {
  createNotification,
  getNotification,
  deleteNotification,
};

export default NotificationService;
