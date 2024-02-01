import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IStaff } from "../../interfaces/staff";
import { RootState } from "../store";
import staffService from "./staffService";

interface IStaffResponse {
  staffs: IStaff[];
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

const initialState: IStaffResponse = {
  staffs: [],
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

export const createStaff = createAsyncThunk(
  "role/create",
  async (roleData: IStaff, thunkAPI) => {
    try {
      return await staffService.createStaff(roleData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getStaff = createAsyncThunk(
  "role/getAll",
  async (filter: { [key: string]: number | string }, thunkAPI) => {
    try {
      return await staffService.getStaff(filter);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const updateStaff = createAsyncThunk(
  "role/update",
  async (
    { id, staffData }: { id: number; staffData: Partial<IStaff> },
    thunkAPI
  ) => {
    try {
      return await staffService.updateStaff(id, staffData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const deleteStaff = createAsyncThunk(
  "role/delete",
  async (pageId: number | string, thunkAPI) => {
    try {
      return await staffService.deleteStaff(pageId);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const pageSlice = createSlice({
  name: "staff",
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      /*  TODO: Create ROLE */
      .addCase(createStaff.pending, (state) => {
        state.isLoading = true;
        state.isCreate = false;
      })
      .addCase(createStaff.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isCreate = true;
        state.message = (action.payload as Partial<IStaffResponse>).message;
      })
      .addCase(createStaff.rejected, (state, action: any) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action?.payload?.response?.data?.message;
        state.error = action?.payload?.response?.data?.errors;
      })
      /* TODO: GET ROLE */
      .addCase(getStaff.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
      })
      .addCase(getStaff.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.staffs = action.payload.data.rows;
        state.totalCount = action.payload.data.count;
      })
      .addCase(getStaff.rejected, (state, action: any) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action?.payload?.response?.data?.message;
        state.error = action?.payload?.response?.data?.errors;
      })
      /* TODO: UPDATE ROLE */
      .addCase(updateStaff.pending, (state) => {
        state.isLoading = true;
        state.isUpdate = false;
      })
      .addCase(updateStaff.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isUpdate = true;
        state.message = action.payload.message;
      })
      .addCase(updateStaff.rejected, (state, action: any) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action?.payload?.response?.data?.message;
        state.error = action?.payload?.response?.data?.errors;
      })
      /* TODO: DELETE ROLE */
      .addCase(deleteStaff.pending, (state) => {
        state.isDelete = false;
      })
      .addCase(deleteStaff.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isDelete = true;
        state.message = action.payload.message;
      })
      .addCase(deleteStaff.rejected, (state, action: any) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action?.payload?.response?.data?.message;
        state.error = action?.payload?.response?.data?.errors;
      });
  },
});

export const { reset } = pageSlice.actions;
export const selectStaff = (state: RootState) => state.staff;
export default pageSlice.reducer;
