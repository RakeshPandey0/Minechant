import { configureStore } from "@reduxjs/toolkit";
import selectionReducer from "./selectionSlice";

export default configureStore({
    reducer: {
        selection: selectionReducer,
    },
});