import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { ICampaign } from "../../interfaces/campaign";
import campaignService from "./campaignService";


interface ICampaignResponse {
  campaigns: ICampaign[];
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

const initialState: ICampaignResponse = {
  campaigns: [],
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

// Create new campaign
export const createCampaign = createAsyncThunk(
  "campaign/create",
  async (categoryData: Partial<ICampaign>, thunkAPI) => {
    try {
      return await campaignService.createCampaign(categoryData);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An error occurred";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getCampaign = createAsyncThunk(
  "campaign/getAll",
  async (
    filter: {
      [key: string]: string | number;
    },
    thunkAPI
  ) => {
    try {
      return await campaignService.getCampaign(filter);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An error occurred";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateCampaign = createAsyncThunk(
  "campaign/update",
  async (
    {
      slug,
      campaigndata,
    }: { slug: number | string; campaigndata: Partial<ICampaign> },
    thunkAPI
  ) => {
    try {
      return await campaignService.updateCampaign(slug, campaigndata);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An error occurred";
      return thunkAPI.rejectWithValue(message);
    }
  }
);
export const deleteCampaign = createAsyncThunk(
  "campaign/delete",
  async (categoryId: number, thunkAPI) => {
    try {
      return await campaignService.deleteCampaign(categoryId);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An error occurred";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const campaignSlice = createSlice({
  name: "campaign",
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCampaign.pending, (state) => {
        state.isLoading = true;
        state.isCreate = false;
      })
      .addCase(createCampaign.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isCreate = true;
        state.message = action.payload.message;
      })
      .addCase(createCampaign.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
        // state.errorMessage = action.payload.message;
      })
      /* TODO: GET CATEGORY DATA SET */
      .addCase(getCampaign.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCampaign.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.campaigns = action.payload.data.rows;
        state.totalCount = action.payload.data.count;
      })
      .addCase(getCampaign.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      /* TODO: UPDATE CATEGORY DATA SET */
      .addCase(updateCampaign.pending, (state) => {
        state.isLoading = true;
        state.isUpdate = false;
      })
      .addCase(updateCampaign.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isUpdate = true;
        state.message = action.payload.message;
      })
      .addCase(updateCampaign.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      /* TODO: DELETE CATEGORY DATA SET */
      .addCase(deleteCampaign.pending, (state) => {
        state.isLoading = true;
        state.isDelete = false;
      })
      .addCase(deleteCampaign.fulfilled, (state) => {
        state.isLoading = false;
        state.isDelete = true;
      })
      .addCase(deleteCampaign.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = campaignSlice.actions;
export const selectCount = (state: RootState) => state.campaign;
export default campaignSlice.reducer;
