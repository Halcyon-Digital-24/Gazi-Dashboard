import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { IComment } from '../../interfaces/comment';
import commentService from './commentService';

interface ICommentResponse {
  comments: IComment[];
  totalCount: number;
  isError: boolean;
  isSuccess: boolean;
  isCreate: boolean;
  isUpdate: boolean;
  isDelete: boolean;
  isLoading: boolean;
  message: string | unknown;
  errorMessage: string | unknown;
  error: { [key: string]: string };
}

const initialState: ICommentResponse = {
  comments: [],
  totalCount: 0,
  isError: false,
  isSuccess: false,
  isCreate: false,
  isUpdate: false,
  isDelete: false,
  isLoading: false,
  message: '',
  errorMessage: '',
  error: {},
};

export const getComments = createAsyncThunk(
  'comment/getAll',
  async (
    filter: {
      [key: string]: string | number;
    },
    thunkAPI
  ) => {
    try {
      return await commentService.getComment(filter);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'An error occurred';
      return thunkAPI.rejectWithValue(message);
    }
  }
);
export const updateComment = createAsyncThunk(
  "comment/update",
  async (data: Partial<IComment>, thunkAPI) => {
    try {
      return await commentService.updateComment(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const categorySlice = createSlice({
  name: 'comment',
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: (builder) => {
    builder

      /* TODO: GET CATEGORY DATA SET */
      .addCase(getComments.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getComments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.comments = action.payload.data.rows;
        state.totalCount = action.payload.data.count;
      })
      .addCase(getComments.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
       /* TODO: UPDATE FAQ DATA SET */
       .addCase(updateComment.pending, (state) => {
        state.isLoading = true;
        state.isUpdate = false;
      })
      .addCase(updateComment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isUpdate = true;
        state.message = action.payload.message;
      })
      .addCase(updateComment.rejected, (state, action: any) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action?.payload?.response?.data?.message;
        state.error = action?.payload?.response?.data?.errors;
      });
  },
});

export const { reset } = categorySlice.actions;
export default categorySlice.reducer;
