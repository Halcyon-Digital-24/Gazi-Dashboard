import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import supportService from "./supportService";
import { ISupport } from "../../interfaces/support";

interface IBlogResponse {
  supports: ISupport[];
  totalCount: number;
  isError: boolean;
  isSuccess: boolean;
  isCreate: boolean;
  isUpdate: boolean;
  isDelete: boolean;
  isLoading: boolean;
  message: string | unknown;
  errorMessage: string | unknown;
}

const initialState: IBlogResponse = {
  supports: [],
  totalCount: 0,
  isError: false,
  isSuccess: false,
  isCreate: false,
  isUpdate: false,
  isDelete: false,
  isLoading: false,
  message: "",
  errorMessage: "",
};

export const getSupport = createAsyncThunk(
  "faqs/getAll",
  async (
    filter: {
      [key: string]: string | number;
    },
    thunkAPI
  ) => {
    try {
      return await supportService.getSupports(filter);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An error occurred";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateFaq = createAsyncThunk(
  "faqs/update",
  async (supportData: Partial<ISupport>, thunkAPI) => {
    try {
      return await supportService.updateSupport(supportData);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An error occurred";
      return thunkAPI.rejectWithValue(message);
    }
  }
);
export const deleteSupport = createAsyncThunk(
  "faqs/delete",
  async (videoId: number | string, thunkAPI) => {
    try {
      return await supportService.deleteSupport(videoId);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An error occurred";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const supportSlice = createSlice({
  name: "Blog",
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: (builder) => {
    builder

      /* TODO: GET FAQ DATA SET */
      .addCase(getSupport.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSupport.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.supports = action.payload.data.rows;
        state.totalCount = action.payload.data.count;
      })
      .addCase(getSupport.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      /* TODO: UPDATE FAQ DATA SET */
      .addCase(updateFaq.pending, (state) => {
        state.isLoading = true;
        state.isUpdate = false;
      })
      .addCase(updateFaq.fulfilled, (state) => {
        state.isLoading = false;
        state.isUpdate = true;
      })
      .addCase(updateFaq.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      /* TODO: DELETE FAQ DATA SET */
      .addCase(deleteSupport.pending, (state) => {
        state.isDelete = false;
      })
      .addCase(deleteSupport.fulfilled, (state) => {
        state.isLoading = false;
        state.isDelete = true;
      })
      .addCase(deleteSupport.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = supportSlice.actions;
export const selectCount = (state: RootState) => state.support;
export default supportSlice.reducer;
