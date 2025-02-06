import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { authSuccess, authFailure } from "../store/reducers/auth.reducer";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthResponse {
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
  message: string;
  success: boolean;
}

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  role: string;
  walletBalance: number;
}

export interface Transaction {
  _id: string;
  user: string; // if not populated, otherwise adjust
  recipient?: { _id: string; name: string };
  amount: number;
  type: "deposit" | "transfer" | "withdrawal";
  status: "pending" | "approved" | "rejected";
  adminApprovedBy?: { _id: string; name: string };
  notes: string;
}


export interface ProfileResponse {
  data: {
    user: UserProfile;
    transactions: Transaction[];
  };
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

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const refreshToken = localStorage.getItem("refreshToken");

    if (refreshToken) {
      const refreshResult = await baseQuery(
        {
          url: "/users/refresh-token",
          method: "POST",
          body: { refreshToken },
        },
        api,
        extraOptions
      );

      if (refreshResult.data) {
        const { accessToken, refreshToken: newRefreshToken } =
          refreshResult.data as { accessToken: string; refreshToken: string };

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", newRefreshToken);

        api.dispatch(
          authSuccess({
            user: api.getState().auth.user,
            accessToken,
            refreshToken: newRefreshToken,
          })
        );

        result = await baseQuery(
          {
            ...args,
            headers: {
              ...args.headers,
              Authorization: `Bearer ${accessToken}`,
            },
          },
          api,
          extraOptions
        );
      } else {
        api.dispatch(authFailure("Session expired. Please log in again."));
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      }
    } else {
      api.dispatch(authFailure("Session expired. Please log in again."));
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
  }
  return result;
};

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    loginUser: builder.mutation<
      AuthResponse,
      { email: string; password: string }
    >({
      query: (credentials) => ({
        url: "/users/login",
        method: "POST",
        body: credentials,
      }),
      onQueryStarted: async (arg, { queryFulfilled, dispatch }) => {
        try {
          const { data } = await queryFulfilled;
          if (data && data.data.accessToken) {
            dispatch(
              authSuccess({
                user: data.data.user,
                accessToken: data.data.accessToken,
                refreshToken: data.data.refreshToken,
              })
            );
          }
        } catch (err) {
          dispatch(authFailure("Login failed"));
        }
      },
    }),

    registerUser: builder.mutation<
      AuthResponse,
      { name: string; email: string;  password: string }
    >({
      query: (userDetails) => ({
        url: "/users/register",
        method: "POST",
        body: userDetails,
      }),
      onQueryStarted: async (arg, { queryFulfilled, dispatch }) => {
        try {
          const { data } = await queryFulfilled;
          if (data.success && data.data.accessToken) {
            dispatch(
              authSuccess({
                user: data.data.user,
                accessToken: data.data.accessToken,
                refreshToken: data.data.refreshToken,
              })
            );
          }
        } catch (err) {
          dispatch(authFailure("Registration failed"));
        }
      },
    }),

    forgotPassword: builder.mutation<
      { message: string; success: boolean },
      { email: string }
    >({
      query: (data) => ({
        url: "/users/forgot-password",
        method: "POST",
        body: data,
      }),
      onQueryStarted: async (arg, { queryFulfilled, dispatch }) => {
        try {
          const { data } = await queryFulfilled;
          if (data.success) {
            console.log(data.message);
          }
        } catch (err) {
          dispatch(authFailure("Failed to send reset email"));
        }
      },
    }),

    resetPassword: builder.mutation<
      { message: string; success: boolean },
      { token: string; newPassword: string }
    >({
      query: (data) => ({
        url: "/users/reset-password",
        method: "POST",
        body: data,
      }),
      onQueryStarted: async (arg, { queryFulfilled, dispatch }) => {
        try {
          const { data } = await queryFulfilled;
          if (data.success) {
            console.log(data.message); 
          }
        } catch (err) {
          dispatch(authFailure("Failed to reset password"));
        }
      },
    }),


    getUserProfile: builder.query<ProfileResponse, void>({
      query: () => ({
        url: "/users/profile",
      }),
    }),

  }),
});

export const {
  useLoginUserMutation,
  useRegisterUserMutation,
  useGetUserProfileQuery,
  useForgotPasswordMutation,
  useResetPasswordMutation 
} = api;