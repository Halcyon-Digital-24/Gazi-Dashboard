import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import blogService, { ICreateResponse } from "./blogService";
import { BlogData } from "../../interfaces/blog";
import { RootState } from "../store";

interface IBlogResponse {
  blogs: BlogData[];
  singleBlog: BlogData;
  totalCount: number;
  isError: boolean;
  isSuccess: boolean;
  isCreate: boolean;
  isUpdate: boolean;
  isDelete: boolean;
  isLoading: boolean;
  error: any;
  message: string | unknown;
  errorMessage: string | unknown;
}

const initialState: IBlogResponse = {
  blogs: [],
  singleBlog: {
    title: "",
    image: null,
    description: "",
    is_visible: true,
    meta_title: "",
    meta_description: "",
    slug: "",
  },
  totalCount: 0,
  isError: false,
  isSuccess: false,
  isCreate: false,
  isUpdate: false,
  isDelete: false,
  isLoading: false,
  error: {},
  message: "",
  errorMessage: "",
};

// Create new Blog
export const createBlog = createAsyncThunk(
  "blogs/create",
  async (blogData: FormData, thunkAPI) => {
    try {
      return await blogService.createNewBlog(blogData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const singleBlog = createAsyncThunk(
  "blogs/single",
  async (blogId: number, thunkAPI) => {
    try {
      return await blogService.singleBlog(blogId);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An error occurred";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getBlogs = createAsyncThunk(
  "blogs/getAll",
  async ({ page, limit }: { page: number; limit: number }, thunkAPI) => {
    try {
      return await blogService.getBlogs({ page, limit });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An error occurred";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateBlog = createAsyncThunk(
  "blogs/update",
  async (
    { id, blogData }: { id: number; blogData: FormData | Partial<BlogData> },
    thunkAPI
  ) => {
    try {
      return await blogService.updateBlog(id, blogData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const deleteBlog = createAsyncThunk(
  "blogs/delete",
  async (blogId: number | string, thunkAPI) => {
    try {
      return await blogService.deleteBlog(blogId);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An error occurred";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const blogSlice = createSlice({
  name: "Blog",
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBlog.pending, (state) => {
        state.isCreate = false;
        state.isLoading = true;
      })
      .addCase(createBlog.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isCreate = true;
        state.message = (action.payload as ICreateResponse).message;
      })
      .addCase(createBlog.rejected, (state, action: any) => {
        state.isLoading = false;
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action?.payload?.response?.data?.message;
        state.error = action?.payload?.response?.data?.errors;
      })
      /* TODO: GET BLOG DATA SET */
      .addCase(getBlogs.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getBlogs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.blogs = action.payload.data.rows;
        state.totalCount = action.payload.data.count;
      })
      .addCase(getBlogs.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.payload;
      })

      /* TODO: UPDATE BLOG DATA SET */
      .addCase(updateBlog.pending, (state) => {
        state.isUpdate = false;
      })
      .addCase(updateBlog.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isUpdate = true;
        state.message = action.payload.message;
      })
      .addCase(updateBlog.rejected, (state, action: any) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action?.payload?.response?.data?.message;
        state.error = action?.payload?.response?.data?.errors;
      })
      /* TODO: DELETE BLOG DATA SET */
      .addCase(deleteBlog.pending, (state) => {
        state.isLoading = true;
        state.isDelete = false;
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isDelete = true;
        state.message = action.payload.message;
      })
      .addCase(deleteBlog.rejected, (state, action: any) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action?.payload?.response?.data?.message;
        state.error = action?.payload?.response?.data?.errors;
      });
  },
});

export const { reset } = blogSlice.actions;
export const selectCount = (state: RootState) => state.blogs;
export default blogSlice.reducer;
