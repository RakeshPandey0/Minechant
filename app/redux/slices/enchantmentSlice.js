import { createSlice } from "@reduxjs/toolkit";
import { fetchEnchantmentOrder } from "./enchantmentThunk";

const initialState = {
  loading: false,
  error: null,
  result: null,
};

const enchantmentSlice = createSlice({
  name: "Enchantment",
  initialState,
  reducers: {
    clearEnchanementResult: (state) => {
      state.loading = false;
      state.error = null;
      state.result = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEnchantmentOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEnchantmentOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.result = action.payload;
      })
      .addCase(fetchEnchantmentOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { clearEnchantmentResult } = enchantmentSlice.actions;
export default enchantmentSlice.reducer;
