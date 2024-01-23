import axios from "../../lib";
import { BlogData, ResponseBlogData } from "../../interfaces/blog";

export interface ICreateResponse {
  message: string;
  data: {
    id: number;
    title: string;
    slug: string;
    description: string;
    is_visible: boolean;
    meta_title: string;
    meta_description: string;
    image: string;
    updated_at: string;
    created_at: string;
  };
}

const createNewBlog = async (blogData: FormData): Promise<ICreateResponse> => {
  const { data } = await axios.post(`/blogs`, blogData);
  return data;
};

const getBlogs = async ({
  page,
  limit,
}: {
  page: number;
  limit: number;
}): Promise<ResponseBlogData> => {
  const { data } = await axios.get(`/blogs?page=${page}&limit=${limit}`);
  return data;
};

const singleBlog = async (blogId: number): Promise<BlogData> => {
  const { data } = await axios.get(`/blogs/${blogId}`);
  return data.data;
};

const updateBlog = async (
  id: number,
  blogData: FormData | Partial<BlogData>
) => {
  const { data } = await axios.patch(`/blogs/${id}`, blogData);
  return data;
};

const deleteBlog = async (blogId: number | string) => {
  const { data } = await axios.delete(`/blogs/?ids=[${blogId}]`);
  return data;
};

const blogService = {
  createNewBlog,
  getBlogs,
  updateBlog,
  deleteBlog,
  singleBlog,
};

export default blogService;
