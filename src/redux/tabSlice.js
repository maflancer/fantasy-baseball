import { createSlice } from "@reduxjs/toolkit";

export const tabSlice = createSlice({
  name: "tab",
  initialState: 0,
  reducers: {
    setTab: (state, action) => {
      return action.payload;
    },
  },
});

export const { setTab } = tabSlice.actions;

export default tabSlice.reducer;
