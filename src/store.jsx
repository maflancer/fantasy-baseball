import { combineReducers, configureStore } from "@reduxjs/toolkit";
import localforage from "localforage";
import { persistReducer, persistStore } from "redux-persist";

import yearSlice from "./redux/yearSlice";
import tabSlice from "./redux/tabSlice";
import filterSlice from "./redux/filterSlice";

const persistConfig = {
  key: "root",
  storage: localforage,
};

const reducerList = {
  year: yearSlice,
  tab: tabSlice,
  filters: filterSlice,
};

const persistedReducer = persistReducer(
  persistConfig,
  combineReducers(reducerList)
);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
  devTools: true,
});

export const persistor = persistStore(store);

export const createTestStore = (state) =>
  configureStore({
    reducer: reducerList,
    preloadedState: state,
  });
