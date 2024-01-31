import axios from "../../lib";
import { API_URL } from "../../constants";
import { IRole, IRoleResponse } from "../../interfaces/role";

const createRole = async (roleData: IRole): Promise<Partial<IRoleResponse>> => {
  const { data } = await axios.post(`${API_URL}/roles`, roleData);
  return data;
};

const getRole = async (filter: {
  [key: string]: string | number | boolean;
}): Promise<IRoleResponse> => {
  let url = `/roles`;

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

const updateRole = async (id: number, pageData: Partial<IRole>) => {
  const { data } = await axios.patch(`${API_URL}/roles/${id}`, pageData);
  return data;
};

const deleteRole = async (pageId: number | string) => {
  const { data } = await axios.delete(`${API_URL}/roles/?ids=[${pageId}]`);
  return data;
};

const roleService = {
  createRole,
  getRole,
  updateRole,
  deleteRole,
};

export default roleService;
