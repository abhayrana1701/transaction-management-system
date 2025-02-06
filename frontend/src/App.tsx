import React, { Suspense } from 'react';
import { Route, Routes } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import ErrorBoundary from "./components/errorboundary";
import Basic from "./layouts/Basic";
import ProtectedRoute from "./components/protectedroute";
import AdminProtectedRoute from "./components/adminprotectedroute"; // Admin-specific ProtectedRoute
import Home from "./pages/homepage";
import SignIn from "./pages/signinpage";
import SignUp from "./pages/signuppage";
import ForgotPasswordForm from './pages/forgotpasswordpage';
import ResetPasswordForm from './pages/resetpasswordpage';
import SkeletonLoader from './components/skeletonloader'; 
import WithdrawMoneyComponent from './pages/withdrawmoney';


const AddFundsComponent = React.lazy(() => import("./pages/uploadpage"));
const TransactionList = React.lazy(() => import("./pages/transactionlist"));
const TransferRequestComponent=React.lazy(() => import("./pages/transfermoney"));
const UserProfile=React.lazy(() => import("./pages/userprofile"));
const CommissionsComponent=React.lazy(() => import("./pages/commissionpage"));

const protectedRoutes = [
  { path: "/add-funds", component: AddFundsComponent, skeleton: 'upload' },
  { path: "/withdraw-money", component: WithdrawMoneyComponent, skeleton: 'upload' },
  { path: "/transfer-money", component: TransferRequestComponent, skeleton: 'upload' },
  { path: "/user-profile", component: UserProfile, skeleton: 'upload' },
];

const adminRoutes = [
   { path: "/admin/pending-transactions", component: TransactionList },
   { path: "/admin/commissions", component: CommissionsComponent },
];

const publicRoutes = [
  { path: "/", component: Home },
  { path: "/signin", component: SignIn },
  { path: "/signup", component: SignUp },
  { path: "/forgot-password", component: ForgotPasswordForm },
  { path: "/reset-password", component: ResetPasswordForm }
];

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route element={<Basic />}>
          {/* Public Routes */}
          {publicRoutes.map(({ path, component: Component }) => (
            <Route key={path} path={path} element={<Component />} />
          ))}

          {/* Protected Routes for Regular Users */}
          {protectedRoutes.map(({ path, component: Component, skeleton }) => (
            <Route 
              key={path} 
              path={path} 
              element={
                <Suspense fallback={<SkeletonLoader type={skeleton} />}> 
                  <ProtectedRoute>
                    <Component />
                  </ProtectedRoute>
                </Suspense>
              }
            />
          ))}

          {/* Admin Routes */}
          {adminRoutes.map(({ path, component: Component }) => (
            <Route 
              key={path} 
              path={path} 
              element={
                <Suspense fallback={<CircularProgress />}> 
                  <AdminProtectedRoute>
                    <Component />
                  </AdminProtectedRoute>
                </Suspense>
              }
            />
          ))}
        </Route>
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
