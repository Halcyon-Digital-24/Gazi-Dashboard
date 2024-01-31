import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IRole } from "../../interfaces/role";
import { RootState } from "../store";
import roleService from "./roleService";

interface IRoleResponse {
  roles: IRole[];
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

const initialState: IRoleResponse = {
  roles: [],
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

export const createRole = createAsyncThunk(
  "role/create",
  async (roleData: IRole, thunkAPI) => {
    try {
      return await roleService.createRole(roleData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getRole = createAsyncThunk(
  "role/getAll",
  async (filter: { [key: string]: number | string }, thunkAPI) => {
    try {
      return await roleService.getRole(filter);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const updateRole = createAsyncThunk(
  "role/update",
  async (
    { id, roleData }: { id: number; roleData: Partial<IRole> },
    thunkAPI
  ) => {
    try {
      return await roleService.updateRole(id, roleData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const deleteRole = createAsyncThunk(
  "role/delete",
  async (pageId: number | string, thunkAPI) => {
    try {
      return await roleService.deleteRole(pageId);
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
      /*  TODO: Create ROLE */
      .addCase(createRole.pending, (state) => {
        state.isLoading = true;
        state.isCreate = false;
      })
      .addCase(createRole.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isCreate = true;
        state.message = (action.payload as Partial<IRoleResponse>).message;
      })
      .addCase(createRole.rejected, (state, action: any) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action?.payload?.response?.data?.message;
        state.error = action?.payload?.response?.data?.errors;
      })
      /* TODO: GET ROLE */
      .addCase(getRole.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
      })
      .addCase(getRole.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.roles = action.payload.data.rows;
        state.totalCount = action.payload.data.count;
      })
      .addCase(getRole.rejected, (state, action: any) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action?.payload?.response?.data?.message;
        state.error = action?.payload?.response?.data?.errors;
      })
      /* TODO: UPDATE ROLE */
      .addCase(updateRole.pending, (state) => {
        state.isLoading = true;
        state.isUpdate = false;
      })
      .addCase(updateRole.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isUpdate = true;
        state.message = action.payload.message;
      })
      .addCase(updateRole.rejected, (state, action: any) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action?.payload?.response?.data?.message;
        state.error = action?.payload?.response?.data?.errors;
      })
      /* TODO: DELETE ROLE */
      .addCase(deleteRole.pending, (state) => {
        state.isDelete = false;
      })
      .addCase(deleteRole.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isDelete = true;
        state.message = action.payload.message;
      })
      .addCase(deleteRole.rejected, (state, action: any) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action?.payload?.response?.data?.message;
        state.error = action?.payload?.response?.data?.errors;
      });
  },
});

export const { reset } = pageSlice.actions;
export const selectRole = (state: RootState) => state.role;
export default pageSlice.reducer;
