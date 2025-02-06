// approve.transaction.api.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Transaction {
  _id: string;
  user: { name: string; email: string };
  recipient?: { name: string; email: string };
  amount: number;
  type: string;
  status: string;
  adminApprovedBy: string;
  notes: string;
}

export interface TransactionResponse {
  data: Transaction[];
  message: string;
  success: boolean;
}

export interface TransferResponse {
  data: any[];
  message: string;
  success: boolean;
}

export interface ApproveResponseData {
  data: any[];
  message: string;
  success: boolean;
}

export interface Commission {
  _id: string;
  transaction: string; // the ObjectId as a string; adjust if you need a different type
  amount: number;
  type: "transfer" | "withdrawal";
}

export interface CommissionResponse {
  data: Commission[];
  message: string;
  success: boolean;
}


const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:5000/api/admin",
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const approveTransactionApi = createApi({
  reducerPath: "approveTransactionApi",
  baseQuery,
  tagTypes: ["Transaction", "Commission"],
  endpoints: (builder) => ({
    getPendingTransactions: builder.query<TransactionResponse, void>({
      query: () => "/pending-transactions",
      // Transform the nested response so that "data" contains the transactions array directly.
      transformResponse: (response: any): TransactionResponse => {
        return {
          ...response,
          data: response.data.transactions, // extract transactions array
        };
      },
      onQueryStarted: async (arg, { queryFulfilled, dispatch }) => {
        try {
          const { data } = await queryFulfilled;
          console.log("Fetched transactions:", data);
        } catch (err) {
          console.error("Error fetching transactions", err);
        }
      },
      providesTags: (result) =>
        result && Array.isArray(result.data)
          ? [
              ...result.data.map((_: any) => ({ type: "Transaction" as const, id: _. _id })),
              { type: "Transaction", id: "LIST" },
            ]
          : [{ type: "Transaction", id: "LIST" }],
    }),

    requestTransferMoney: builder.mutation<TransferResponse, { recipientId: string; amount: number; notes?: string }>({
      query: (payload) => ({
        url: "/request-transfer",
        method: "POST",
        body: payload,
      }),
    }),

    approveDeposit: builder.mutation<ApproveResponseData, { transactionId: string }>({
      query: ({ transactionId }) => ({
        url: '/approve-deposit',
        method: 'POST',
        body: { transactionId },
      }),
      invalidatesTags: [{ type: 'Transaction', id: 'LIST' }],
    }),

    approveTransfer: builder.mutation<ApproveResponseData, { transactionId: string }>({
      query: ({ transactionId }) => ({
        url: '/approve-transfer',
        method: 'POST',
        body: { transactionId },
      }),
      invalidatesTags: [{ type: 'Transaction', id: 'LIST' }],
    }),

    getCommissions: builder.query<CommissionResponse, void>({
          query: () => ({
            url: "/",
          }),
        }),

  }),
});

export const {
  useGetPendingTransactionsQuery,
  useRequestTransferMoneyMutation,
  useApproveDepositMutation,
  useApproveTransferMutation,
  useGetCommissionsQuery
} = approveTransactionApi;
