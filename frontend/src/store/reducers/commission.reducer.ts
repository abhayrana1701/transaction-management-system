// src/store/slices/commissionSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Commission } from "../../services/approve.transaction.api";

interface CommissionState {
  commissions: Commission[];
}

const initialState: CommissionState = {
  commissions: [],
};

const commissionSlice = createSlice({
  name: "commission",
  initialState,
  reducers: {
    setCommissions(state, action: PayloadAction<Commission[]>) {
      state.commissions = action.payload;
    },
    clearCommissions(state) {
      state.commissions = [];
    },
  },
});

export const { setCommissions, clearCommissions } = commissionSlice.actions;
export default commissionSlice.reducer;
