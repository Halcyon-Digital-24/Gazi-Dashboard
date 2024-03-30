import { ICustomer } from "../../interfaces/customer";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import customerService from "./customerService";
import axios from "axios";

interface IState {
  customers: ICustomer[];
  totalCount: number;
  isError: boolean;
  isUpdate: boolean;
  isSuccess: boolean;
  isDelete: boolean;
  isLoading: boolean;
  message: string | unknown;
  errorMessage: string | unknown;
}
const initialState: IState = {
  customers: [],
  totalCount: 0,
  isError: false,
  isSuccess: false,
  isUpdate: false,
  isDelete: false,
  isLoading: false,
  message: "",
  errorMessage: "",
};

// Get customer
export const getCustomers = createAsyncThunk(
  "customer/getAllcustomer",
  async (filter: { [key: string]: number | string }, thunkAPI) => {
    try {
      return await customerService.getAllCustomer(filter);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data.message || "An error occurred";
        return thunkAPI.rejectWithValue(message);
      } else {
        return thunkAPI.rejectWithValue("An error occurred");
      }
    }
  }
);

// Delete customer
export const deleteCustomer = createAsyncThunk(
  "customer/delete",
  async (ids: [number], thunkAPI) => {
    try {
      return await customerService.deleteCustomer(ids);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data.message || "An error occurred";
        return thunkAPI.rejectWithValue(message);
      } else {
        return thunkAPI.rejectWithValue("An error occurred");
      }
    }
  }
);

export const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isUpdate = false;
      state.isDelete = false;
      state.isError = false;
      state.message = "";
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getCustomers.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
      })
      .addCase(getCustomers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.customers = action.payload.data.rows;
        state.totalCount = action.payload.data.count;
      })
      .addCase(getCustomers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.customers = [];
        state.message = action.payload as string;
      })

      /* TODO: DELETE CATEGORY DATA SET */
      .addCase(deleteCustomer.pending, (state) => {
        state.isLoading = true;
        state.isDelete = false;
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isDelete = true;
        console.log(action.payload);
        state.message = action.payload.message;
      })
      .addCase(deleteCustomer.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = customerSlice.actions;
export default customerSlice.reducer;
