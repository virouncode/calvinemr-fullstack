import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App.jsx";
import { AdminsInfosProvider } from "./context/AdminsInfosProvider";
import { AuthProvider } from "./context/AuthProvider";
import { ClinicProvider } from "./context/ClinicProvider";
import { PurposesCategoriesProvider } from "./context/PurposesCatgoriesProvider.js";
import { PurposesProvider } from "./context/PurposesProvider.js";
import { SocketProvider } from "./context/SocketProvider";
import { StaffInfosProvider } from "./context/StaffInfosProvider";
import { TitleProvider } from "./context/TitleProvider";
import { UserProvider } from "./context/UserProvider";
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

root.render(
  // <React.StrictMode>
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <UserProvider>
          <SocketProvider>
            <StaffInfosProvider>
              <AdminsInfosProvider>
                <TitleProvider>
                  <ClinicProvider>
                    <PurposesCategoriesProvider>
                      <PurposesProvider>
                        <Routes>
                          <Route path="/*" element={<App />} />
                        </Routes>
                      </PurposesProvider>
                    </PurposesCategoriesProvider>
                  </ClinicProvider>
                </TitleProvider>
              </AdminsInfosProvider>
            </StaffInfosProvider>
          </SocketProvider>
        </UserProvider>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </BrowserRouter>
  // </React.StrictMode>
);
