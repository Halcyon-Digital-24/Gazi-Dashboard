import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ICartItem } from "../../interfaces/cart";
import { toast } from "react-toastify";

interface CartState {
  cart: ICartItem[];
}

const initialCart =
  typeof window !== "undefined" ? localStorage.getItem("cartItems") : null;
const initialState: CartState = {
  cart: initialCart ? JSON.parse(initialCart) : [],
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Add to cart
    addToCart: (state, action: PayloadAction<ICartItem>) => {
      const newItem = action.payload;
      const existingItem = state.cart.find(
        (item) => item.product_id === newItem.product_id
      );

      if (existingItem) {
        toast.success("Item already added in your cart!");
        existingItem.quantity += newItem.quantity ?? 1;
      } else {
        state.cart = [...state.cart, newItem];
        toast.success("Item added to your cart!");
      }
      localStorage.setItem("cartItems", JSON.stringify(state.cart));
    },

    // Increment card item
    incrementQuantity: (state, action: PayloadAction<ICartItem>) => {
      const itemToIncrement = state.cart.find(
        (item) => item.product_id === action.payload.product_id
      );

      if (itemToIncrement && itemToIncrement.quantity < 5) {
        itemToIncrement.quantity += 1;
        localStorage.setItem("cartItems", JSON.stringify(state.cart));
      }
    },

    // Decrement cart item
    decrementQuantity: (state, action: PayloadAction<ICartItem>) => {
      const itemToDecrement = state.cart.find(
        (item) => item.product_id === action.payload.product_id
      );

      if (itemToDecrement && itemToDecrement.quantity > 1) {
        itemToDecrement.quantity -= 1;
        localStorage.setItem("cartItems", JSON.stringify(state.cart));
      }
    },

    // Remove cart item
    removeFromCart: (state, action: PayloadAction<ICartItem>) => {
      state.cart = state.cart.filter(
        (i) => i.product_id !== action.payload.product_id
      );
      localStorage.setItem("cartItems", JSON.stringify(state.cart));
    },

    // clear cart
    clearCart: (state) => {
      state.cart = [];
      localStorage.removeItem("cartItems");
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  incrementQuantity,
  decrementQuantity,
  clearCart,
} = cartSlice.actions;
export default cartSlice.reducer;
