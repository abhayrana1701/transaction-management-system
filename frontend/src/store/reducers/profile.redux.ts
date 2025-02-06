import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserProfile, Transaction } from "../../services/auth.api";

interface ProfileState {
  user: UserProfile | null;
  transactions: Transaction[];
}

const initialState: ProfileState = {
  user: null,
  transactions: [],
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setProfile(state, action: PayloadAction<{ user: UserProfile; transactions: Transaction[] }>) {
      state.user = action.payload.user;
      state.transactions = action.payload.transactions;
    },
    clearProfile(state) {
      state.user = null;
      state.transactions = [];
    },
  },
});

export const { setProfile, clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
