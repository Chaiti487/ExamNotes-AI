import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",

  initialState: {
    userData: null,
  },

  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },

    updateCredits: (state, action) => {
      if (state.userData) {
        state.userData.credits = action.payload;
        state.userData.isCreditAvailable = action.payload >= 10;
      }
    },
  },
});

export const { setUserData, updateCredits } = userSlice.actions;

export default userSlice.reducer;
