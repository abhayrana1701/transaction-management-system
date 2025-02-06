import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TransactionState {
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: TransactionState = {
  loading: false,
  error: null,
  successMessage: null,
};

const transactionSlice = createSlice({
  name: "transaction",
  initialState,
  reducers: {
    transactionStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    transactionSuccess: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.successMessage = action.payload;
    },
    transactionFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    resetTransactionState: (state) => {
      state.successMessage = null;
      state.error = null;
    },
  },
});

export const {
  transactionStart,
  transactionSuccess,
  transactionFailure,
  resetTransactionState,
} = transactionSlice.actions;

export default transactionSlice.reducer;
