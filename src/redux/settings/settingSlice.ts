import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { ISettings } from "../../interfaces/settings";
import settingService from "./settingService";

interface ISettingResponse {
  setting: ISettings;
  totalCount: number;
  isError: boolean;
  isSuccess: boolean;
  isUpdate: boolean;
  isLoading: boolean;
  message: string | unknown;
  errorMessage: string | unknown;
}

const initialState: ISettingResponse = {
  setting: {
    id: 0,
    logo: "",
    favicon: "",
    footer_info: "",
    footer_copywrite: "",
    contact_number: "",
    contact_email: "",
    address: "",
    google_analytics: "",
    facebook_pixel: "",
    header_script: "",
    footer_script: "",
    facebook_url: "",
    youtube_url: "",
    twitter_url: "",
    instagram_url: "",
    cash_on_message: null,
    online_payment_message: null,
    created_at: "",
    updated_at: "",
  },
  totalCount: 0,
  isError: false,
  isSuccess: false,
  isUpdate: false,
  isLoading: false,
  message: "",
  errorMessage: "",
};

export const getSettings = createAsyncThunk(
  "setting/getAll",
  async (_, thunkAPI) => {
    try {
      return await settingService.getSettings();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An error occurred";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateSettings = createAsyncThunk(
  "setting/update",
  async (data: FormData, thunkAPI) => {
    try {
      return await settingService.updateSettings(data);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An error occurred";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const settingSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: (builder) => {
    builder

      /* TODO: GET SETTINGS */
      .addCase(getSettings.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSettings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.setting = action.payload;
      })
      .addCase(getSettings.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      /* TODO: UPDATE SETTINGS */
      .addCase(updateSettings.pending, (state) => {
        state.isLoading = true;
        state.isUpdate = false;
      })
      .addCase(updateSettings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isUpdate = true;
        state.message = action.payload.message;
      })
      .addCase(updateSettings.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = settingSlice.actions;
export const selectCount = (state: RootState) => state.settings;
export default settingSlice.reducer;
