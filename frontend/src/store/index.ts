import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import authReducer from "./reducers/auth.reducer";
import { api } from "../services/auth.api";
import { transactionApi } from "../services/transaction.api";
import { approveTransactionApi} from "../services/approve.transaction.api";
import profileReducer from "./reducers/profile.redux";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [api.reducerPath]: api.reducer,
    [transactionApi.reducerPath]: transactionApi.reducer,
    [approveTransactionApi.reducerPath]: approveTransactionApi.reducer,
    profile: profileReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      api.middleware, 
      transactionApi.middleware,
      approveTransactionApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();