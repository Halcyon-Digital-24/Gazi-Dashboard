import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { ILcation } from "./../../interfaces/location";
import locationService from "./locationService";

interface IState {
  locations: ILcation[];
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
  locations: [],
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

// Create Location
export const createLocation = createAsyncThunk(
  "location/createLocation",
  async (data: ILcation, thunkAPI) => {
    try {
      return await locationService.createLocation(data);
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
// Get Location
export const getLocations = createAsyncThunk(
  "location/getAllProducts",
  async ({ page, limit }: { [key: string]: number }, thunkAPI) => {
    try {
      return await locationService.getLocations({ page, limit });
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

export const updateLocation = createAsyncThunk(
  "location/update",
  async (
    { id, locationData }: { id: number | string; locationData: ILcation },
    thunkAPI
  ) => {
    try {
      return await locationService.updateLocation(id, locationData);
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

export const deleteLocation = createAsyncThunk(
  "location/delete",
  async (ProductId: number, thunkAPI) => {
    try {
      return await locationService.deleteLocation(ProductId);
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

export const locationSlice = createSlice({
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
      .addCase(createLocation.pending, (state) => {
        state.isLoading = true;
        state.isCreate = false;
      })
      .addCase(createLocation.fulfilled, (state) => {
        state.isLoading = false;
        state.isCreate = true;
      })
      .addCase(createLocation.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(getLocations.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
      })
      .addCase(getLocations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.locations = action.payload.data.rows;
        state.totalCount = action.payload.data.count;
      })
      .addCase(getLocations.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      /* TODO: UPDATE PRODUCT DATA SET */
      .addCase(updateLocation.pending, (state) => {
        state.isLoading = true;
        state.isUpdate = false;
      })
      .addCase(updateLocation.fulfilled, (state) => {
        state.isLoading = false;
        state.isUpdate = true;
      })
      .addCase(updateLocation.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      /* TODO: DELETE Location DATA SET */
      .addCase(deleteLocation.pending, (state) => {
        state.isLoading = true;
        state.isDelete = false;
      })
      .addCase(deleteLocation.fulfilled, (state) => {
        state.isLoading = false;
        state.isDelete = true;
      })
      .addCase(deleteLocation.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = locationSlice.actions;
export default locationSlice.reducer;
