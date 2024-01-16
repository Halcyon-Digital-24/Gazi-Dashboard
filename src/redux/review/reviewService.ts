import { IRevieResponse, IReview } from "./../../interfaces/review";
import axios from "../../lib";
import { API_URL } from "../../constants";

const getReview = async (filter: {
  [key: string]: string | number;
}): Promise<IRevieResponse> => {
  let url = `${API_URL}/reviews`;
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

const updateReview = async (reviewData: Partial<IReview>) => {
  const { data } = await axios.patch(
    `${API_URL}/reviews/${reviewData.id}`,
    reviewData
  );
  return data;
};

const reviewService = {
  getReview,
  updateReview,
};

export default reviewService;
