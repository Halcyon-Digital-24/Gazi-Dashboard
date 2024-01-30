import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { IMenu } from "../../interfaces/menu";
import menuService from "./menuService";

interface IState {
  menus: IMenu[];
  totalCount: number;
  isError: boolean;
  isCreate: boolean;
  isUpdate: boolean;
  isSuccess: boolean;
  isDelete: boolean;
  isLoading: boolean;
  message: string | unknown;
  errorMessage: string | unknown;
}
const initialState: IState = {
  menus: [],
  totalCount: 0,
  isError: false,
  isCreate: false,
  isSuccess: false,
  isDelete: false,
  isLoading: false,
  isUpdate: false,
  message: "",
  errorMessage: "",
};

export const createMenu = createAsyncThunk(
  "product/createMenu",
  async (data: IMenu, thunkAPI) => {
    try {
      return await menuService.createMenu(data);
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

// Get Order
export const getMenus = createAsyncThunk(
  "order/getAllOrder",
  async (filter: { [key: string]: number | string }, thunkAPI) => {
    try {
      return await menuService.getMenus(filter);
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

// Update Menu
export const updateMenus = createAsyncThunk(
  "menu/update",
  async (
    { menuData, id }: { menuData: Partial<IMenu>; id: number | string },
    thunkAPI
  ) => {
    try {
      return await menuService.updateMenus(menuData, id);
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
// Delete Order
export const deleteMenu = createAsyncThunk(
  "order/delete",
  async (ids: number[], thunkAPI) => {
    try {
      return await menuService.deleteMenu(ids);
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

export const menuSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isCreate = false;
      state.isUpdate = false;
      state.isSuccess = false;
      state.isDelete = false;
      state.isError = false;
      state.message = "";
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(createMenu.pending, (state) => {
        state.isLoading = true;
        state.isCreate = false;
      })
      .addCase(createMenu.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isCreate = true;
        state.message = action.payload.message;
      })
      .addCase(createMenu.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      // GET MENUS
      .addCase(getMenus.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
      })
      .addCase(getMenus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.menus = action.payload.data.rows;
        state.totalCount = action.payload.data.count;
      })
      .addCase(getMenus.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      // GET MENUS
      .addCase(updateMenus.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
      })
      .addCase(updateMenus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload.message;
        state.isUpdate = true;
      })
      .addCase(updateMenus.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isUpdate = false;
        state.message = action.payload as string;
      })

      /* TODO: DELETE CATEGORY DATA SET */
      .addCase(deleteMenu.pending, (state) => {
        state.isLoading = true;
        state.isDelete = false;
      })
      .addCase(deleteMenu.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isDelete = true;
        state.message = action.payload.message;
      })
      .addCase(deleteMenu.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = menuSlice.actions;
export default menuSlice.reducer;
