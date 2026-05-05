import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  0: {},
  1: { week: "", stat: "" },
  2: { week: "", team_name: "" },
};

export const filtersSlice = createSlice({
  name: "filters",
  initialState: initialState,
  reducers: {
    setFilter: (state, action) => {
      const { tab, name, value } = action.payload;
      state[tab][name] = value;
    },
    clearFilter: (state, action) => {
      const { tab, name } = action.payload;
      state[tab][name] = "";
    },
  },
});

export const { setFilter, clearFilter } = filtersSlice.actions;

export default filtersSlice.reducer;
