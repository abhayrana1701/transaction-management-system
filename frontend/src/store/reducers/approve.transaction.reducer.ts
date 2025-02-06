// transactionSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Transaction } from "../../services/approve.transaction.api";

export interface TransactionState {
  transactions: Transaction[];
}

const initialState: TransactionState = {
  transactions: [],
};

const transactionSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    // Set the list of transactions
    setTransactions(state, action: PayloadAction<Transaction[]>) {
      state.transactions = action.payload;
    },
    // Add a single transaction
    addTransaction(state, action: PayloadAction<Transaction>) {
      state.transactions.push(action.payload);
    },
    // Update an existing transaction
    updateTransaction(state, action: PayloadAction<Transaction>) {
      const index = state.transactions.findIndex(
        (t) => t._id === action.payload._id
      );
      if (index !== -1) {
        state.transactions[index] = action.payload;
      }
    },
    // Remove a transaction by ID
    removeTransaction(state, action: PayloadAction<string>) {
      state.transactions = state.transactions.filter(
        (t) => t._id !== action.payload
      );
    },
  },
});

export const {
  setTransactions,
  addTransaction,
  updateTransaction,
  removeTransaction,
} = transactionSlice.actions;

export default transactionSlice.reducer;
