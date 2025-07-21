import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchEnchantmentOrder = createAsyncThunk(
  "enchantment/fetchOrder",
  async ({ selected_item, selected_enchants }, thunkAPI) => {
    try {
      const res = await fetch("/api/generate-enchantment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ selected_item, selected_enchants }),
      });
      const data = res.json();
      if (!res.ok) throw new Error(data.error || "Unknown error");
      return data.result;
    } catch (error) { 
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
