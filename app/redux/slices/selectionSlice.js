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
            state.selected_items = [action.payload];
        },
        selectEnchant: (state, action) => {
            const { rowIndex, name } = action.payload;
            state.selected_enchants[rowIndex] = name;
        },
        removeItem: (state, action) =>{
            state.selected_items = []
        },
        removeEnchant: (state, action) =>{
            const {rowIndex, name} = action.payload;
            state.selected_enchants.splice(rowIndex, 1);
        }
    },
});

export const { selectItem, selectEnchant, removeItem, removeEnchant } = selectionSlice.actions;
export default selectionSlice.reducer;