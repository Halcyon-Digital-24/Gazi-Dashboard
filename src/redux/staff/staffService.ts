import axios from "../../lib";
import { API_URL } from "../../constants";
import { IStaff, IStaffResponse } from "../../interfaces/staff";

const createStaff = async (
  roleData: IStaff
): Promise<Partial<IStaffResponse>> => {
  const { data } = await axios.post(`${API_URL}/users`, roleData);
  return data;
};

const getStaff = async (filter: {
  [key: string]: string | number | boolean;
}): Promise<IStaffResponse> => {
  let url = `/users`;

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
      .join("&");

    // Add query string to the URL
    url += `?${queryString}`;
  }

  const { data } = await axios.get(url);

  return data;
};

const updateStaff = async (id: number, pageData: Partial<IStaff>) => {
  const { data } = await axios.patch(`${API_URL}/users/${id}`, pageData);
  return data;
};

const deleteStaff = async (pageId: number | string) => {
  const { data } = await axios.delete(`${API_URL}/users/?ids=[${pageId}]`);
  return data;
};

const staffService = {
  createStaff,
  getStaff,
  updateStaff,
  deleteStaff,
};

export default staffService;
