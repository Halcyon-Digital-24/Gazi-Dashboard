import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { IReview } from "../../interfaces/review";
import reviewService from "./reviewService";

interface IBlogResponse {
  reviews: IReview[];
  totalCount: number;
  isError: boolean;
  isSuccess: boolean;
  isUpdate: boolean;
  isLoading: boolean;
  message: string | unknown;
  errorMessage: string | unknown;
  error: { [key: string]: string };
}

const initialState: IBlogResponse = {
  reviews: [],
  totalCount: 0,
  isError: false,
  isSuccess: false,
  isUpdate: false,
  isLoading: false,
  error: {},
  message: "",
  errorMessage: "",
};

export const getReview = createAsyncThunk(
  "review/getAll",
  async (filter: { [key: string]: string | number }, thunkAPI) => {
    try {
      return await reviewService.getReview(filter);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const updateReview = createAsyncThunk(
  "review/update",
  async (data: Partial<IReview>, thunkAPI) => {
    try {
      return await reviewService.updateReview(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const reviewSlice = createSlice({
  name: "review",
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: (builder) => {
    builder

      /* TODO: GET FAQ DATA SET */
      .addCase(getReview.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getReview.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.reviews = action.payload.data.rows;
        state.totalCount = action.payload.data.count;
      })
      .addCase(getReview.rejected, (state, action: any) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action?.payload?.response?.data?.message;
      })
      /* TODO: UPDATE FAQ DATA SET */
      .addCase(updateReview.pending, (state) => {
        state.isLoading = true;
        state.isUpdate = false;
      })
      .addCase(updateReview.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isUpdate = true;
        state.message = action.payload.message;
      })
      .addCase(updateReview.rejected, (state, action: any) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action?.payload?.response?.data?.message;
        state.error = action?.payload?.response?.data?.errors;
      });
  },
});

export const { reset } = reviewSlice.actions;
export const selectCount = (state: RootState) => state.faqs;
export default reviewSlice.reducer;
