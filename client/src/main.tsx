import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginLayout from "./components/All/Layouts/LoginLayout.js";
import { AdminsInfosProvider } from "./context/AdminsInfosProvider";
import { AuthProvider } from "./context/AuthProvider";
import { ClinicProvider } from "./context/ClinicProvider";
import { SocketProvider } from "./context/SocketProvider";
import { StaffInfosProvider } from "./context/StaffInfosProvider";
import { TitleProvider } from "./context/TitleProvider";
import { UserProvider } from "./context/UserProvider";
import {
  default as ClosedPage,
  default as SuspendedPage,
} from "./pages/All/ClosedPage.js";
import ErrorPage from "./pages/All/ErrorPage.js";
import LoginPage from "./pages/All/LoginPage.js";
import MissingPage from "./pages/All/MissingPage.js";
import ResetPage from "./pages/All/ResetPage.js";
import UnauthorizedPage from "./pages/All/UnauthorizedPage.js";
import "./styles/index.scss";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: "", element: <LoginPage /> },
      {
        path: "unauthorized",
        element: <UnauthorizedPage />,
      },
      {
        path: "suspended",
        element: <SuspendedPage />,
      },
      {
        path: "closed",
        element: <ClosedPage />,
      },
      {
        path: "reset-password",
        element: <ResetPage />,
      },
      {
        path: "*",
        element: <MissingPage />,
      },
    ],
  },
]);

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <UserProvider>
          <SocketProvider>
            <StaffInfosProvider>
              <AdminsInfosProvider>
                <TitleProvider>
                  <ClinicProvider>
                    <RouterProvider router={router} />
                  </ClinicProvider>
                </TitleProvider>
              </AdminsInfosProvider>
            </StaffInfosProvider>
          </SocketProvider>
        </UserProvider>
      </AuthProvider>
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  </React.StrictMode>
);
