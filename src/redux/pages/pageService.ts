import axios from "../../lib";
import { API_URL } from "../../constants";
import { IPages, IPagesResponse } from "../../interfaces/pages";

const createPages = async (
  pageData: IPages
): Promise<Partial<IPagesResponse>> => {
  const { data } = await axios.post(`${API_URL}/pages`, pageData);
  return data;
};

const getPages = async (filter: {
  [key: string]: string | number | boolean;
}): Promise<IPagesResponse> => {
  let url = `/pages`;

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
      .join("&");

    // Add query string to the URL
    url += `?${queryString}`;
  }

  const { data } = await axios.get(url);

  return data;
};

const updatePages = async (pageData: Partial<IPages>) => {
  const { data } = await axios.patch(
    `${API_URL}/pages/${pageData.id}`,
    pageData
  );
  return data.data;
};

const deletePages = async (pageId: number | string) => {
  const { data } = await axios.delete(`${API_URL}/pages/?ids=[${pageId}]`);
  return data.data;
};

const faqService = {
  createPages,
  getPages,
  updatePages,
  deletePages,
};

export default faqService;
