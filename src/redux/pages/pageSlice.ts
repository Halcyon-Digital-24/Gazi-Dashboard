import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IPages } from "../../interfaces/pages";
import { RootState } from "../store";
import pageService from "./pageService";

interface IPagesResponse {
  pages: IPages[];
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

const initialState: IPagesResponse = {
  pages: [],
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
export const createPages = createAsyncThunk(
  "pages/create",
  async (pageData: IPages, thunkAPI) => {
    try {
      return await pageService.createPages(pageData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getPages = createAsyncThunk(
  "pages/getAll",
  async (filter: { [key: string]: number | string }, thunkAPI) => {
    try {
      return await pageService.getPages(filter);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const updatePages = createAsyncThunk(
  "pages/update",
  async (
    { id, pageData }: { id: number; pageData: Partial<IPages> },
    thunkAPI
  ) => {
    try {
      return await pageService.updatePages(id, pageData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const deletePages = createAsyncThunk(
  "pages/delete",
  async (pageId: number | string, thunkAPI) => {
    try {
      return await pageService.deletePages(pageId);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const pageSlice = createSlice({
  name: "pages",
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPages.pending, (state) => {
        state.isLoading = true;
        state.isCreate = false;
      })
      .addCase(createPages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isCreate = true;
        state.message = (action.payload as Partial<IPagesResponse>).message;
      })
      .addCase(createPages.rejected, (state, action: any) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action?.payload?.response?.data?.message;
        state.error = action?.payload?.response?.data?.errors;
      })
      /* TODO: GET PAGE */
      .addCase(getPages.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
      })
      .addCase(getPages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.pages = action.payload.data.rows;
        state.totalCount = action.payload.data.count;
      })
      .addCase(getPages.rejected, (state, action: any) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action?.payload?.response?.data?.message;
        state.error = action?.payload?.response?.data?.errors;
      })
      /* TODO: UPDATE PAGE */
      .addCase(updatePages.pending, (state) => {
        state.isLoading = true;
        state.isUpdate = false;
      })
      .addCase(updatePages.fulfilled, (state) => {
        state.isLoading = false;
        state.isUpdate = true;
      })
      .addCase(updatePages.rejected, (state, action: any) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action?.payload?.response?.data?.message;
        state.error = action?.payload?.response?.data?.errors;
      })
      /* TODO: DELETE PAGE */
      .addCase(deletePages.pending, (state) => {
        state.isDelete = false;
      })
      .addCase(deletePages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isDelete = true;
        state.message = action.payload.message;
      })
      .addCase(deletePages.rejected, (state, action: any) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action?.payload?.response?.data?.message;
        state.error = action?.payload?.response?.data?.errors;
      });
  },
});

export const { reset } = pageSlice.actions;
export const selectCount = (state: RootState) => state.pages;
export default pageSlice.reducer;
