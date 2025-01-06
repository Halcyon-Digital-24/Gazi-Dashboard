// import { IOrder } from './../../interfaces/order';
// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import orderService from './orderService';
// import axios from 'axios';

// interface IState {
//   orders: IOrder[];
//   totalCount: number;
//   isError: boolean;
//   isUpdate: boolean;
//   isSuccess: boolean;
//   isDelete: boolean;
//   isLoading: boolean;
//   message: string | unknown;
//   errorMessage: string | unknown;
// }
// const initialState: IState = {
//   orders: [],
//   totalCount: 0,
//   isError: false,
//   isSuccess: false,
//   isUpdate: false,
//   isDelete: false,
//   isLoading: false,
//   message: '',
//   errorMessage: '',
// };

// // Get Order
// export const getOrders = createAsyncThunk(
//   'order/getAllOrder',
//   async (filter: { [key: string]: number | string }, thunkAPI) => {
//     try {
//       return await orderService.getAllOrders(filter);
//     } catch (error) {
//       if (axios.isAxiosError(error)) {
//         const message = error.response?.data.message || 'An error occurred';
//         return thunkAPI.rejectWithValue(message);
//       } else {
//         return thunkAPI.rejectWithValue('An error occurred');
//       }
//     }
//   }
// );

// export const updateOrder = createAsyncThunk(
//   'order/update',
//   async (
//     { id, orderData }: { id: number; orderData: { [key: string]: string } },
//     thunkAPI
//   ) => {
//     try {
//       return await orderService.updateOrder(id, orderData);
//     } catch (error) {
//       if (axios.isAxiosError(error)) {
//         const message = error.response?.data.message || 'An error occurred';
//         return thunkAPI.rejectWithValue(message);
//       } else {
//         return thunkAPI.rejectWithValue('An error occurred');
//       }
//     }
//   }
// );
// // Delete Order
// export const deleteOrder = createAsyncThunk(
//   'order/delete',
//   async (ids: number[], thunkAPI) => {
//     try {
//       return await orderService.deleteOrder(ids);
//     } catch (error) {
//       if (axios.isAxiosError(error)) {
//         const message = error.response?.data.message || 'An error occurred';
//         return thunkAPI.rejectWithValue(message);
//       } else {
//         return thunkAPI.rejectWithValue('An error occurred');
//       }
//     }
//   }
// );

// export const orderSlice = createSlice({
//   name: 'order',
//   initialState,
//   reducers: {
//     reset: (state) => {
//       state.isLoading = false;
//       state.isSuccess = false;
//       state.isUpdate = false;
//       state.isDelete = false;
//       state.isError = false;
//       state.message = '';
//     },
//   },

//   extraReducers: (builder) => {
//     builder
//       .addCase(getOrders.pending, (state) => {
//         state.isLoading = true;
//         state.isSuccess = false;
//       })
//       .addCase(getOrders.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.isSuccess = true;
//         state.orders = action.payload.data.rows;
//         state.totalCount = action.payload.data.count;
//       })
//       .addCase(getOrders.rejected, (state, action) => {
//         state.isLoading = false;
//         state.isError = true;
//         state.message = action.payload as string;
//         state.orders = [];
//       })

//       /* TODO: UPDATE PRODUCT DATA SET */
//       .addCase(updateOrder.pending, (state) => {
//         state.isLoading = true;
//         state.isUpdate = false;
//       })
//       .addCase(updateOrder.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.isUpdate = true;
//         state.message = action.payload.message;
//       })
//       .addCase(updateOrder.rejected, (state, action) => {
//         state.isLoading = false;
//         state.isError = true;
//         state.message = action.payload;
//       })

//       /* TODO: DELETE CATEGORY DATA SET */
//       .addCase(deleteOrder.pending, (state) => {
//         state.isLoading = true;
//         state.isDelete = false;
//       })
//       .addCase(deleteOrder.fulfilled, (state) => {
//         state.isLoading = false;
//         state.isDelete = true;
//       })
//       .addCase(deleteOrder.rejected, (state, action) => {
//         state.isLoading = false;
//         state.isError = true;
//         state.message = action.payload;
//       });
//   },
// });

// export const { reset } = orderSlice.actions;
// export default orderSlice.reducer;
