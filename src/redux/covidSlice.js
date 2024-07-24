import { createSlice } from "@reduxjs/toolkit";
import getData from "./actions";

const initialState = {
  isLoding: true,
  error: null,
  data: null,
};

const covidSlice = createSlice({
  name: "covid",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(getData.pending, (state) => {
      state.isLoding = true;
    });
    builder.addCase(getData.rejected, (state, { error }) => {
      state.isLoding = false;
      state.error = error.message;
    });
    builder.addCase(getData.fulfilled, (state, { payload }) => {
      state.isLoding = false;
      state.error = null;
      state.data = payload;
    });
  },
});

export default covidSlice.reducer;
