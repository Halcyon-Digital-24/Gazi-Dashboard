import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import productService from "./product-service";
import { IProduct } from "../../interfaces/product";
interface IState {
  products: IProduct[];
  totalCount: number;
  isError: boolean;
  isSuccess: boolean;
  isCreate: boolean;
  isUpdate: boolean;
  isDelete: boolean;
  isCsvUpload: boolean;
  isLoading: boolean;
  csvFile: string;
  error: { [key: string]: string };
  message: string | unknown;
  errorMessage: string | unknown;
}
const initialState: IState = {
  products: [],
  totalCount: 0,
  isError: false,
  isSuccess: false,
  isCreate: false,
  isUpdate: false,
  isCsvUpload: false,
  isDelete: false,
  isLoading: false,
  error: {},
  csvFile: "",
  message: "",
  errorMessage: "",
};

// Create products
export const createProduct = createAsyncThunk(
  "product/createProduct",
  async (data: FormData, thunkAPI) => {
    try {
      return await productService.createProduct(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Get user products
export const getProducts = createAsyncThunk(
  "product/getAllProducts",
  async (fileter: { [key: string]: string | number }, thunkAPI) => {
    try {
      return await productService.getAllProducts(fileter);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const getFrontendProducts = createAsyncThunk(
  "product/getAllFrontendProducts",
  async (fileter: { [key: string]: string | number }, thunkAPI) => {
    try {
      return await productService.getAllFrontendProducts(fileter);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const updateProduct = createAsyncThunk(
  "category/update",
  async (
    {
      id,
      productData,
    }: {
      id: number | string;
      productData: FormData | { [key: string]: string | number | boolean | null};
    },
    thunkAPI
  ) => {
    try {
      return await productService.updateProduct(id, productData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
// Delete Product
export const deleteProduct = createAsyncThunk(
  "product/delete",
  async (ids: number[], thunkAPI) => {
    try {
      return await productService.deleteProduct(ids);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
// Download csv
export const csvProduct = createAsyncThunk(
  "product/csv_download",
  async (_, thunkAPI) => {
    try {
      return await productService.csvProduct();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Upload csv
export const uploadCsvProduct = createAsyncThunk(
  "product/csv_upload",
  async (csvData: FormData, thunkAPI) => {
    try {
      return await productService.uploadCsvProduct(csvData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    reset: (state) => {
      state.isCreate = false;
      state.isLoading = false;
      state.isSuccess = false;
      state.isUpdate = false;
      state.isDelete = false;
      state.isError = false;
      state.isCsvUpload = false;
      state.message = "";
      state.errorMessage = "";
      state.error = {};
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(createProduct.pending, (state) => {
        state.isLoading = true;
        state.isCreate = false;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isCreate = true;
        state.message = action.payload?.message;
      })
      .addCase(createProduct.rejected, (state, action: any) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action?.payload?.response?.data?.message;
        state.error = action?.payload?.response?.data?.errors;
      })
      // get Product
      .addCase(getProducts.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.products = action.payload.data.rows;
        state.totalCount = action.payload.data.count;
      })
      .addCase(getProducts.rejected, (state, action: any) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action?.payload?.response?.data?.message;
        state.error = action?.payload?.response?.data?.errors;
        state.products = [];
      })
      // get Frontend Product
      .addCase(getFrontendProducts.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
      })
      .addCase(getFrontendProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.products = action.payload.data.rows;
        state.totalCount = action.payload.data.count;
      })
      .addCase(getFrontendProducts.rejected, (state, action: any) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action?.payload?.response?.data?.message;
        state.error = action?.payload?.response?.data?.errors;
        state.products = [];
      })
      /* TODO: UPDATE PRODUCT DATA SET */
      .addCase(updateProduct.pending, (state) => {
        state.isLoading = true;
        state.isUpdate = false;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isUpdate = true;
        state.message = action.payload?.message;
      })
      .addCase(updateProduct.rejected, (state, action: any) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action?.payload?.response?.data?.message;
        state.error = action?.payload?.response?.data?.errors;
      })
      /* TODO: DELETE Product DATA SET */
      .addCase(deleteProduct.pending, (state) => {
        state.isLoading = true;
        state.isDelete = false;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isDelete = true;
        state.message = action.payload.message;
      })
      .addCase(deleteProduct.rejected, (state, action: any) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action?.payload?.response?.data?.message;
      })
      /* TODO: CSV DOWNLOAD */
      .addCase(csvProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(csvProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.csvFile = action.payload;
        state.message = action.payload?.message;
      })
      .addCase(csvProduct.rejected, (state, action: any) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action?.payload?.response?.data?.message;
        state.error = action?.payload?.response?.data?.errors;
      })
      /* TODO: CSV UPLOAD */
      .addCase(uploadCsvProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(uploadCsvProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isCsvUpload = true;
        state.message = action.payload.message;
      })
      .addCase(uploadCsvProduct.rejected, (state, action: any) => {
        state.isLoading = false;
        state.isError = true;
        state.isCsvUpload = false;
        state.errorMessage = action?.payload?.response?.data?.message;
        state.error = action?.payload?.response?.data?.errors;
      });
  },
});

export const { reset } = productSlice.actions;
export default productSlice.reducer;
