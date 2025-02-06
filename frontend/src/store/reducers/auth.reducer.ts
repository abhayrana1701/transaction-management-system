import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  } | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: localStorage.getItem("accessToken"),
  refreshToken: localStorage.getItem("refreshToken"),
  isAuthenticated: !!localStorage.getItem("accessToken"),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },

    authSuccess: (
      state,
      action: PayloadAction<{
        user: AuthState["user"];
        accessToken: string;
        refreshToken: string;
      }>
    ) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken; 
      localStorage.setItem("accessToken", action.payload.accessToken);
      localStorage.setItem("refreshToken", action.payload.refreshToken); 
    },

    authFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    },

    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null; 
      state.isAuthenticated = false;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken"); 
    },
  },
});

export const {
  loginStart,
  authSuccess,
  authFailure,
  logout,
} = authSlice.actions;

export default authSlice.reducer;