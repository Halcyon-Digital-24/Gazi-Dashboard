import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import categoryService from "./couponService";
import { ICoupon } from "../../interfaces/coupon";

interface IBlogResponse {
  coupons: ICoupon[];
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
  coupons: [],
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

// Create new coupon
export const createCoupon = createAsyncThunk(
  "category/create",
  async (categoryData: Partial<ICoupon>, thunkAPI) => {
    try {
      return await categoryService.createCoupon(categoryData);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An error occurred";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getCoupon = createAsyncThunk(
  "category/getAll",
  async (
    filter: {
      [key: string]: string | number;
    },
    thunkAPI
  ) => {
    try {
      return await categoryService.getCoupon(filter);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An error occurred";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateCoupon = createAsyncThunk(
  "category/update",
  async (
    {
      slug,
      coupondata,
    }: { slug: number | string; coupondata: Partial<ICoupon> },
    thunkAPI
  ) => {
    try {
      return await categoryService.updateCoupon(slug, coupondata);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An error occurred";
      return thunkAPI.rejectWithValue(message);
    }
  }
);
export const deleteCoupon = createAsyncThunk(
  "category/delete",
  async (categoryId: number, thunkAPI) => {
    try {
      return await categoryService.deleteCoupon(categoryId);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An error occurred";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const couponSlice = createSlice({
  name: "coupon",
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCoupon.pending, (state) => {
        state.isLoading = true;
        state.isCreate = false;
      })
      .addCase(createCoupon.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isCreate = true;
        state.message = action.payload.message;
      })
      .addCase(createCoupon.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
        // state.errorMessage = action.payload.message;
      })
      /* TODO: GET CATEGORY DATA SET */
      .addCase(getCoupon.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCoupon.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.coupons = action.payload.data.rows;
        state.totalCount = action.payload.data.count;
      })
      .addCase(getCoupon.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      /* TODO: UPDATE CATEGORY DATA SET */
      .addCase(updateCoupon.pending, (state) => {
        state.isLoading = true;
        state.isUpdate = false;
      })
      .addCase(updateCoupon.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isUpdate = true;
        state.message = action.payload.message;
      })
      .addCase(updateCoupon.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      /* TODO: DELETE CATEGORY DATA SET */
      .addCase(deleteCoupon.pending, (state) => {
        state.isLoading = true;
        state.isDelete = false;
      })
      .addCase(deleteCoupon.fulfilled, (state) => {
        state.isLoading = false;
        state.isDelete = true;
      })
      .addCase(deleteCoupon.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = couponSlice.actions;
export const selectCount = (state: RootState) => state.category;
export default couponSlice.reducer;
