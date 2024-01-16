import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ICategory } from "../../interfaces/category";
import { RootState } from "../store";
import categoryService from "./categoryService";

interface IBlogResponse {
  categories: ICategory[];
  totalCount: number;
  isError: boolean;
  isSuccess: boolean;
  isCreate: boolean;
  isUpdate: boolean;
  isDelete: boolean;
  isLoading: boolean;
  message: string | unknown;
  error: { [key: string]: string };
  errorMessage: string | unknown;
}

const initialState: IBlogResponse = {
  categories: [],
  totalCount: 0,
  isError: false,
  isSuccess: false,
  isCreate: false,
  isUpdate: false,
  isDelete: false,
  isLoading: false,
  message: "",
  error: {},
  errorMessage: "",
};

// Create new Blog
export const createCategory = createAsyncThunk(
  "category/create",
  async (categoryData: FormData, thunkAPI) => {
    try {
      return await categoryService.createCategory(categoryData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getCategories = createAsyncThunk(
  "category/getAll",
  async (
    filter: {
      [key: string]: string | number;
    },
    thunkAPI
  ) => {
    try {
      return await categoryService.getCategory(filter);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const updateCategory = createAsyncThunk(
  "category/update",
  async (
    {
      slug,
      categoryData,
    }: { slug: number | string; categoryData: Partial<ICategory> | FormData },
    thunkAPI
  ) => {
    try {
      return await categoryService.updateCategory(slug, categoryData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const deleteCategory = createAsyncThunk(
  "category/delete",
  async (categoryId: number, thunkAPI) => {
    try {
      return await categoryService.deleteCategory(categoryId);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCategory.pending, (state) => {
        state.isLoading = true;
        state.isCreate = false;
      })
      .addCase(createCategory.fulfilled, (state, action: any) => {
        state.isLoading = false;
        state.isCreate = true;
        state.message = action.payload?.message;
      })
      .addCase(createCategory.rejected, (state, action: any) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action?.payload?.response?.data?.message;
        state.error = action?.payload?.response?.data?.errors;
      })
      /* TODO: GET CATEGORY DATA SET */
      .addCase(getCategories.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.categories = action.payload?.data?.rows;
        state.totalCount = action.payload?.data?.count;
      })
      .addCase(getCategories.rejected, (state, action: any) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.errorMessage = action?.payload?.response?.data?.message;
      })
      /* TODO: UPDATE CATEGORY DATA SET */
      .addCase(updateCategory.pending, (state) => {
        state.isLoading = true;
        state.isUpdate = false;
      })
      .addCase(updateCategory.fulfilled, (state) => {
        state.isLoading = false;
        state.isUpdate = true;
      })
      .addCase(updateCategory.rejected, (state, action: any) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action?.payload?.response?.data?.message;
        state.error = action?.payload?.response?.data?.errors;
      })
      /* TODO: DELETE CATEGORY DATA SET */
      .addCase(deleteCategory.pending, (state) => {
        state.isLoading = true;
        state.isDelete = false;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isDelete = true;
        state.message = action.payload.message;
      })
      .addCase(deleteCategory.rejected, (state, action: any) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action?.payload?.response?.data?.error;
      });
  },
});

export const { reset } = categorySlice.actions;
export const selectCount = (state: RootState) => state.category;
export default categorySlice.reducer;
