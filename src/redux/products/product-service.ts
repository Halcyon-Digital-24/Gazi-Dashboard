import { API_URL } from "../../constants";
import { IProductResponse } from "../../interfaces/product";
import axios from "../../lib";

// get all products
const getAllProducts = async (filter: {
  [key: string]: string | number;
}): Promise<IProductResponse> => {
  let url = `/products`;
  // Filter out keys with false values
  const filteredFilter: { [key: string]: string | number | boolean } = {};
  Object.entries(filter).forEach(([key, value]) => {
    filteredFilter[key] = value;
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

const createProduct = async (productData: FormData) => {
  const { data } = await axios.post(`${API_URL}/products`, productData);
  return data;
};

const updateProduct = async (
  id: number | string,
  categoryData: FormData | { [key: string]: string | number | boolean }
) => {
  const { data } = await axios.patch(`${API_URL}/products/${id}`, categoryData);
  return data;
};

const deleteProduct = async (ids: number[]) => {
  const idsString = ids.join(",");
  const { data } = await axios.delete(
    `${API_URL}/products/?ids=[${idsString}]`
  );
  return data;
};

const csvProduct = async () => {
  const { data } = await axios.get(`${API_URL}/products/csv`);
  return data;
};

const uploadCsvProduct = async (csvData: FormData) => {
  const { data } = await axios.post(`${API_URL}/products/csv`, csvData);
  return data;
};

const productService = {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  csvProduct,
  uploadCsvProduct,
};

export default productService;
