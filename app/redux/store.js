import { configureStore } from "@reduxjs/toolkit";
import selectionReducer from "./slices/selectionSlice";
// import enchantmentReducer from "./slices/enchantmentSlice";

export default configureStore({
  reducer: {
    selection: selectionReducer,
    // enchantment: enchantmentReducer,
  },
});