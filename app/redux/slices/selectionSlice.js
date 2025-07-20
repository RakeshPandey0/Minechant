import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selected_items: [],
  selected_enchants: [],
};

const selectionSlice = createSlice({
  name: "selection",
  initialState,
  reducers: {
    selectItem: (state, action) => {
      return {
        ...state,
        selected_items: [action.payload],
      };
    },
    selectEnchant: (state, action) => {
      const { rowIndex, name } = action.payload;
      const updatedEnchants = [...state.selected_enchants];
      updatedEnchants[rowIndex] = name;
      return {
        ...state,
        selected_enchants: updatedEnchants,
      };
    },
    removeItem: (state) => {
      return {
        ...state,
        selected_items: [],
      };
    },
    removeEnchant: (state, action) => {
      const updatedEnchants = [...state.selected_enchants];
      updatedEnchants[action.payload] = null;
      return {
        ...state,
        selected_enchants: updatedEnchants,
      };
    },

    clearEnchant: (state) => {
      return {
        ...state,
        selected_enchants: [],
      };
    },
  },
});

export const {
  selectItem,
  selectEnchant,
  removeItem,
  removeEnchant,
  clearEnchant,
} = selectionSlice.actions;
export default selectionSlice.reducer;
