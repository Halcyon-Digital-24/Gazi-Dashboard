import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { IFaq, IFaqResponse } from '../../interfaces/faq';
import { RootState } from '../store';
import faqService from './faqService';

interface IBlogResponse {
  faqs: IFaq[];
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
  faqs: [],
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
export const createFaq = createAsyncThunk(
  'faqs/create',
  async (faqData: IFaq, thunkAPI) => {
    try {
      return await faqService.createFaq(faqData);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'An error occurred';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getFaqs = createAsyncThunk('faqs/getAll', async (filter: { [key: string]: number | string }, thunkAPI) => {
  try {
    return await faqService.getFaqs(filter);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'An error occurred';
    return thunkAPI.rejectWithValue(message);
  }
});

export const updateFaq = createAsyncThunk(
  'faqs/update',
  async (faqData: Partial<IFaq>, thunkAPI) => {
    try {
      return await faqService.updateFaq(faqData);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'An error occurred';
      return thunkAPI.rejectWithValue(message);
    }
  }
);
export const deleteFaq = createAsyncThunk(
  'faqs/delete',
  async (videoId: number | string, thunkAPI) => {
    try {
      return await faqService.deleteFaq(videoId);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'An error occurred';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const faqSlice = createSlice({
  name: 'Blog',
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createFaq.pending, (state) => {
        state.isLoading = true;
        state.isCreate = false;
      })
      .addCase(createFaq.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isCreate = true;
        state.message = (action.payload as Partial<IFaqResponse>).message;
      })
      .addCase(createFaq.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = (action.payload as IFaqResponse).message;
      })
      /* TODO: GET FAQ DATA SET */
      .addCase(getFaqs.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getFaqs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.faqs = action.payload.data.rows;
        state.totalCount = action.payload.data.count;
      })
      .addCase(getFaqs.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      /* TODO: UPDATE FAQ DATA SET */
      .addCase(updateFaq.pending, (state) => {
        state.isLoading = true;
        state.isUpdate = false;
      })
      .addCase(updateFaq.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isUpdate = true;
        state.message = action.payload.message;
      })
      .addCase(updateFaq.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      /* TODO: DELETE FAQ DATA SET */
      .addCase(deleteFaq.pending, (state) => {
        state.isDelete = false;
      })
      .addCase(deleteFaq.fulfilled, (state) => {
        state.isLoading = false;
        state.isDelete = true;
      })
      .addCase(deleteFaq.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = faqSlice.actions;
export const selectCount = (state: RootState) => state.faqs;
export default faqSlice.reducer;
