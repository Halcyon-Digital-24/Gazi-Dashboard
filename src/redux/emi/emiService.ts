import axios from "../../lib";
import { IEmi, IEmiResponse } from "../../interfaces/emi";

// get all Emis
const getEmis = async (filter: {
  [key: string]: string | number;
}): Promise<IEmiResponse> => {
  let url = `/emis`;
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

const createEmi = async (productData: IEmi) => {
  const { data } = await axios.post(`/emis`, productData);
  return data;
};

const updateEmi = async (id: number | string, categoryData: IEmi) => {
  const { data } = await axios.patch(`/emis/${id}`, categoryData);
  return data;
};

const deleteEmi = async (videoId: number) => {
  const { data } = await axios.delete(`/emis/?ids=[${videoId}]`);
  return data;
};

const emiService = {
  getEmis,
  createEmi,
  updateEmi,
  deleteEmi,
};

export default emiService;
