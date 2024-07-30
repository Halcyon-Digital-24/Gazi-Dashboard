import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { IEmi } from "../../interfaces/emi";
import emiService from "./emiService";

interface IState {
  emis: IEmi[];
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
const initialState: IState = {
  emis: [],
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

// Get user products
export const createEmi = createAsyncThunk(
  "emi/createEmi",
  async (data: IEmi, thunkAPI) => {
    try {
      return await emiService.createEmi(data);
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
// Get Emi's
export const getEmis = createAsyncThunk(
  "emi/getAllProducts",
  async (filter: { [key: string]: number | string }, thunkAPI) => {
    try {
      return await emiService.getEmis( filter );
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

export const updateEmi = createAsyncThunk(
  "emi/update",
  async ({ id, emiData }: { id: number | string; emiData: IEmi }, thunkAPI) => {
    try {
      return await emiService.updateEmi(id, emiData);
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

export const deleteEmi = createAsyncThunk(
  "emi/delete",
  async (ProductId: number, thunkAPI) => {
    try {
      return await emiService.deleteEmi(ProductId);
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

export const emiSlice = createSlice({
  name: "emi",
  initialState,
  reducers: {
    reset: (state) => {
      state.isCreate = false;
      state.isLoading = false;
      state.isUpdate = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(createEmi.pending, (state) => {
        state.isLoading = true;
        state.isCreate = false;
      })
      .addCase(createEmi.fulfilled, (state, action: any) => {
        state.isLoading = false;
        state.isCreate = true;
        state.message = action.payload.message;
      })
      .addCase(createEmi.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(getEmis.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
      })
      .addCase(getEmis.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.emis = action.payload.data.rows;
        state.totalCount = action.payload.data.count;
      })
      .addCase(getEmis.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      /* TODO: UPDATE PRODUCT DATA SET */
      .addCase(updateEmi.pending, (state) => {
        state.isLoading = true;
        state.isUpdate = false;
      })
      .addCase(updateEmi.fulfilled, (state, action: any) => {
        state.isLoading = false;
        state.isUpdate = true;
        state.message = action.payload.message;
      })
      .addCase(updateEmi.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      /* TODO: DELETE CATEGORY DATA SET */
      .addCase(deleteEmi.pending, (state) => {
        state.isLoading = true;
        state.isDelete = false;
      })
      .addCase(deleteEmi.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isDelete = true;
        state.message = action.payload.message;
      })
      .addCase(deleteEmi.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = emiSlice.actions;
export default emiSlice.reducer;
