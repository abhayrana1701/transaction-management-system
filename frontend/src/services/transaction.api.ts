import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Transaction {
  data: any;
  message: string;
  success: boolean;
}

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:5000/api",
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const transactionApi = createApi({
  reducerPath: "transactionApi",
  baseQuery,
  endpoints: (builder) => ({
    requestAddFunds: builder.mutation<Transaction, { amount: number, notes: string }>({
      query: ({ amount, notes }) => ({
        url: "/transactions/request-add-funds",
        method: "POST",
        body: { amount, notes },
      }),
      onQueryStarted: async (arg, { queryFulfilled, dispatch }) => {
        try {
          const { data } = await queryFulfilled;
          console.log(data.message);
        } catch (err) {
          console.error("Add funds request failed");
        }
      },
    }),

    processWithdrawal: builder.mutation<Transaction, { amount: number,notes:string }>({
      query: ({ amount ,notes}) => ({
        url: "/transactions/process-withdrawal",
        method: "POST",
        body: { amount,notes },
      }),
      onQueryStarted: async (arg, { queryFulfilled, dispatch }) => {
        try {
          const { data } = await queryFulfilled;
          console.log(data.message);
        } catch (err) {
          console.error("Withdrawal request failed");
        }
      },
    }),
  }),
});

export const { useRequestAddFundsMutation, useProcessWithdrawalMutation } = transactionApi;
