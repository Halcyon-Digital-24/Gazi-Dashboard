import axios from "../../lib";
import { API_URL } from "../../constants";
import { ISupport, ISupportResponse } from "../../interfaces/support";

const getSupports = async (filter: {
  [key: string]: string | number;
}): Promise<ISupportResponse> => {
  let url = `${API_URL}/supports`;
  if (filter && Object.keys(filter).length > 0) {
    const queryString = Object.entries(filter)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
      )
      .join("&");

    // Add query string to the URL
    url += `?${queryString}`;
  }
  const { data } = await axios.get(url);
  return data;
};

const updateSupport = async (supportData: Partial<ISupport>) => {
  const { data } = await axios.patch(
    `${API_URL}/supports/${supportData.id}`,
    supportData
  );
  return data;
};

const deleteSupport = async (supportId: number | string) => {
  const { data } = await axios.delete(
    `${API_URL}/supports/?ids=[${supportId}]`
  );
  return data;
};

const supportService = {
  getSupports,
  updateSupport,
  deleteSupport,
};

export default supportService;
