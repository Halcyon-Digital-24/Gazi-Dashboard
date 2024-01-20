import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  INotification,
  INotificationResponse,
} from '../../interfaces/notification';
import { RootState } from '../store';
import faqService from './notificationService';

interface IBlogResponse {
  notifications: INotification[];
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
  notifications: [],
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
export const createNotification = createAsyncThunk(
  'notification/create',
  async (data: INotification, thunkAPI) => {
    try {
      return await faqService.createNotification(data);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'An error occurred';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getNotification = createAsyncThunk(
  'notification/getAll',
  async (filter: { [key: string]: number | string }, thunkAPI) => {
    try {
      return await faqService.getNotification(filter);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'An error occurred';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const notificationSlice = createSlice({
  name: 'Notification',
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createNotification.pending, (state) => {
        state.isLoading = true;
        state.isCreate = false;
      })
      .addCase(createNotification.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isCreate = true;
        state.message = (
          action.payload as Partial<INotificationResponse>
        ).message;
      })
      .addCase(createNotification.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = (action.payload as INotificationResponse).message;
      })
      /* TODO: GET FAQ DATA SET */
      .addCase(getNotification.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getNotification.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.notifications = action.payload.data.rows;
        state.totalCount = action.payload.data.count;
      })
      .addCase(getNotification.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = notificationSlice.actions;
export const selectCount = (state: RootState) => state.faqs;
export default notificationSlice.reducer;
