import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { Ikeypoint } from "../../interfaces/keypoints";
import keypointService from "./keypointService";

interface IState {
  services: Ikeypoint[];
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
  services: [],
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
export const createKeypont = createAsyncThunk(
  "service/createKeypont",
  async (data: FormData, thunkAPI) => {
    try {
      return await keypointService.createKeypont(data);
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
export const getKeypoints = createAsyncThunk(
  "service/getKeypoint",
  async ({ page, limit }: { [key: string]: number }, thunkAPI) => {
    try {
      return await keypointService.getKeypoints({ page, limit });
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

export const updateKeypoint = createAsyncThunk(
  "service/update",
  async (
    { id, updateData }: { id: number | string; updateData: FormData },
    thunkAPI
  ) => {
    try {
      return await keypointService.updateKeypoint(id, updateData);
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

export const deleteKeypoint = createAsyncThunk(
  "service/delete",
  async (ProductId: number, thunkAPI) => {
    try {
      return await keypointService.deleteKeypoint(ProductId);
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

export const serviceslice = createSlice({
  name: "service",
  initialState,
  reducers: {
    reset: (state) => {
      state.isCreate = false;
      state.isUpdate = false;
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
      state.errorMessage = "";
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(createKeypont.pending, (state) => {
        state.isLoading = true;
        state.isCreate = false;
      })
      .addCase(createKeypont.fulfilled, (state) => {
        state.isLoading = false;
        state.isCreate = true;
      })
      .addCase(createKeypont.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(getKeypoints.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
      })
      .addCase(getKeypoints.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.services = action.payload.data.rows;
        state.totalCount = action.payload.data.count;
      })
      .addCase(getKeypoints.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      /* TODO: UPDATE PRODUCT DATA SET */
      .addCase(updateKeypoint.pending, (state) => {
        state.isLoading = true;
        state.isUpdate = false;
      })
      .addCase(updateKeypoint.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isUpdate = true;
        state.message = action.payload.message;
      })
      .addCase(updateKeypoint.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      /* TODO: DELETE CATEGORY DATA SET */
      .addCase(deleteKeypoint.pending, (state) => {
        state.isLoading = true;
        state.isDelete = false;
      })
      .addCase(deleteKeypoint.fulfilled, (state) => {
        state.isLoading = false;
        state.isDelete = true;
      })
      .addCase(deleteKeypoint.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = serviceslice.actions;
export default serviceslice.reducer;
