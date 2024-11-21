import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.js";
import { AdminsInfosProvider } from "./context/AdminsInfosProvider";
import { AuthProvider } from "./context/AuthProvider";
import { ClinicProvider } from "./context/ClinicProvider";
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
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <UserProvider>
          <SocketProvider>
            <StaffInfosProvider>
              <AdminsInfosProvider>
                <TitleProvider>
                  <ClinicProvider>
                    <App />
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
