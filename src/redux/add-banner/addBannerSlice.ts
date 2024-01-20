import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { IAdBanner, IAddBannerResponse } from '../../interfaces/addBanner';
import { RootState } from '../store';
import addBannerService from './addBannerService';

interface IBlogResponse {
  addBanner: IAdBanner[];
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
  addBanner: [],
  totalCount: 0,
  isError: false,
  isSuccess: false,
  isCreate: false,
  isUpdate: false,
  isDelete: false,
  isLoading: false,
  message: '',
  errorMessage: '',
};

// Create new Blog
export const createAddBanner = createAsyncThunk(
  'addBanner/create',
  async (bannerData: FormData, thunkAPI) => {
    try {
      return await addBannerService.createAddBanner(bannerData);
    } catch (error) {
      console.log(error);
      const message =
        error instanceof Error ? error.message : 'An error occurred';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getAddBanner = createAsyncThunk(
  'addBanner/getAll',
  async (filter: { [key: string]: number | string }, thunkAPI) => {
    try {
      return await addBannerService.getAddBanner(filter);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'An error occurred';
      return thunkAPI.rejectWithValue(message);
    }
  }
);
export const getSlider = createAsyncThunk(
  'addBanner/slider',
  async (_, thunkAPI) => {
    try {
      return await addBannerService.getSlider();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'An error occurred';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateAddBanner = createAsyncThunk(
  'addBanner/update',
  async ({ bannerData, id }: { bannerData: Partial<IAdBanner> | FormData, id: string | number }, thunkAPI) => {
    try {
      return await addBannerService.updateAddBanner(bannerData, id);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'An error occurred';
      return thunkAPI.rejectWithValue(message);
    }
  }
);
export const deleteBanner = createAsyncThunk(
  'addBanner/delete',
  async (BannerId: number | string, thunkAPI) => {
    try {
      return await addBannerService.deleteBanner(BannerId);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'An error occurred';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const addBannerSlice = createSlice({
  name: 'Blog',
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createAddBanner.pending, (state) => {
        state.isLoading = true;
        state.isCreate = false;
      })
      .addCase(createAddBanner.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isCreate = true;
        state.message = (action.payload as Partial<IAddBannerResponse>).message;
      })
      .addCase(createAddBanner.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = (action.payload as IAddBannerResponse).message;
      })
      /* TODO: GET Banner DATA SET */
      .addCase(getAddBanner.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
      })
      .addCase(getAddBanner.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.addBanner = action.payload?.data?.rows;
        state.totalCount = action.payload?.data?.count;
      })
      .addCase(getAddBanner.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getSlider.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
      })
      .addCase(getSlider.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.addBanner = action.payload.data;
        console.log(action.payload);
      })
      .addCase(getSlider.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      /* TODO: UPDATE Banner DATA SET */
      .addCase(updateAddBanner.pending, (state) => {
        state.isLoading = true;
        state.isUpdate = false;
      })
      .addCase(updateAddBanner.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isUpdate = true;
        state.message = action.payload.message
      })
      .addCase(updateAddBanner.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      /* TODO: DELETE Banner DATA SET */
      .addCase(deleteBanner.pending, (state) => {
        state.isDelete = false;
      })
      .addCase(deleteBanner.fulfilled, (state) => {
        state.isLoading = false;
        state.isDelete = true;
      })
      .addCase(deleteBanner.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = addBannerSlice.actions;
export const selectCount = (state: RootState) => state.banner;
export default addBannerSlice.reducer;
