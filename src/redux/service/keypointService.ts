import axios from "axios";
import { API_URL } from "../../constants";
import { IKeypointResponse } from "../../interfaces/keypoints";

// get all keypoints
const getKeypoints = async (filter: {
  [key: string]: string | number;
}): Promise<IKeypointResponse> => {
  let url = `${API_URL}/keypoints`;
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

const createKeypont = async (productData: FormData) => {
  const { data } = await axios.post(`${API_URL}/keypoints`, productData);
  return data;
};

const updateKeypoint = async (id: number | string, categoryData: FormData) => {
  const { data } = await axios.patch(
    `${API_URL}/keypoints/${id}`,
    categoryData
  );
  return data.data;
};

const deleteKeypoint = async (videoId: number) => {
  const { data } = await axios.delete(`${API_URL}/keypoints/?ids=[${videoId}]`);
  return data.data;
};

const keypointService = {
  getKeypoints,
  updateKeypoint,
  createKeypont,
  deleteKeypoint,
};

export default keypointService;
