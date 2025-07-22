import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk to fetch enchantment order from API
export const fetchEnchantmentOrder = createAsyncThunk(
  "enchantment/fetchOrder",
  async ({ selected_items, selected_enchants }, thunkAPI) => {
    try {
      const res = await fetch("/api/generate-enchantment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ selected_items, selected_enchants }),
      });

      const data = await res.json();

      if (!res.ok) {
        return thunkAPI.rejectWithValue(data.error || "Unknown error");
      }

      return data.result;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "Network error");
    }
  }
);

const initialState = {
  loading: false,
  error: null,
  result: null,
};

const enchantmentSlice = createSlice({
  name: "enchantment",
  initialState,
  reducers: {
    clearEnchantmentResult: (state) => {
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
        state.result = null;
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
