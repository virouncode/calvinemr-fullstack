//Librairies
import React, { lazy, Suspense, useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import socketIOClient from "socket.io-client";
import AdminLayout from "./components/All/Layouts/AdminLayout";
import LoginLayout from "./components/All/Layouts/LoginLayout";
import PatientLayout from "./components/All/Layouts/PatientLayout";
import StaffLayout from "./components/All/Layouts/StaffLayout";
import CircularProgressMedium from "./components/UI/Progress/CircularProgressMedium";
import RequireAuth from "./context/RequireAuth";
import useAuthContext from "./hooks/context/useAuthContext";
import useSocketContext from "./hooks/context/useSocketContext";
import useUserContext from "./hooks/context/useUserContext";
import useAdminsInfosSocket from "./hooks/socket/useAdminsInfosSocket";
import useClinicSocket from "./hooks/socket/useClinicSocket";
import useReactQuerySocket from "./hooks/socket/useReactQuerySocket";
import { useServerErrorSocket } from "./hooks/socket/useServerErrorSocket";
import useStaffInfosSocket from "./hooks/socket/useStaffInfosSocket";
import useUnreadExternalSocket from "./hooks/socket/useUnreadExternalSocket";
import useUnreadFaxSocket from "./hooks/socket/useUnreadFaxSocket";
import useUnreadSocket from "./hooks/socket/useUnreadSocket";
import useUnreadTodoSocket from "./hooks/socket/useUnreadTodoSocket";
import useUserSocket from "./hooks/socket/useUserSocket";
import useAutoLogout from "./hooks/useAutoLogout";
import useLogoutForAll from "./hooks/useLogoutForAll";
import useRefreshToken from "./hooks/useRefreshToken";
import AdminDashboardPage from "./pages/Admin/AdminDashboardPage";
import LoginPage from "./pages/All/LoginPage";
import MissingPage from "./pages/All/MissingPage";
import ResetPage from "./pages/All/ResetPage";
import UnauthorizedPage from "./pages/All/UnauthorizedPage";
import PatientMessagesPage from "./pages/Patient/PatientMessagesPage";
import StaffAllCyclesPage from "./pages/Staff/StaffAllCyclesPage";
import StaffCalendarPage from "./pages/Staff/StaffCalendarPage";

const PatientAppointmentsPage = lazy(
  () => import("./pages/Patient/PatientAppointmentsPage")
);
const PatientCredentialsPage = lazy(
  () => import("./pages/Patient/PatientCredentialsPage")
);
const PatientMyAccountPage = lazy(
  () => import("./pages/Patient/PatientMyAccountPage")
);
const PatientPamphletsPage = lazy(
  () => import("./pages/Patient/PatientPamphletsPage")
);
const PatientPharmaciesPage = lazy(
  () => import("./pages/Patient/PatientPharmaciesPage")
);
const StaffBillingPage = lazy(() => import("./pages/Staff/StaffBillingPage"));
const StaffCalvinAIPage = lazy(() => import("./pages/Staff/StaffCalvinAIPage"));
const StaffCredentialsPage = lazy(
  () => import("./pages/Staff/StaffCredentialsPage")
);
const StaffFaxPage = lazy(() => import("./pages/Staff/StaffFaxPage"));
const StaffMessagesPage = lazy(() => import("./pages/Staff/StaffMessagesPage"));
const StaffMyAccountPage = lazy(
  () => import("./pages/Staff/StaffMyAccountPage")
);
const StaffPatientRecordPage = lazy(
  () => import("./pages/Staff/StaffPatientRecordPage")
);
const StaffPatientsGroupsPage = lazy(
  () => import("./pages/Staff/StaffPatientsGroupsPage")
);
const StaffSearchPracticiansPage = lazy(
  () => import("./pages/Staff/StaffSearchPracticiansPage")
);
const StaffReferencePage = lazy(
  () => import("./pages/Staff/StaffReferencePage")
);
const StaffReportsInboxPage = lazy(
  () => import("./pages/Staff/StaffReportsInboxPage")
);
const StaffSearchPatientPage = lazy(
  () => import("./pages/Staff/StaffSearchPatientPage")
);
const StaffSignupPatientPage = lazy(
  () => import("./pages/Staff/StaffSignupPatientPage")
);
const SuspendedPage = lazy(() => import("./pages/All/SuspendedPage"));
const ClosedPage = lazy(() => import("./pages/All/ClosedPage"));
const AdminStaffAccountsPage = lazy(
  () => import("./pages/Admin/AdminStaffAccountsPage")
);
const AdminPatientsAccountsPage = lazy(
  () => import("./pages/Admin/AdminPatientsAccountsPage")
);
const AdminMyAccountPage = lazy(
  () => import("./pages/Admin/AdminMyAccountPage")
);
const AdminMigrationPage = lazy(
  () => import("./pages/Admin/AdminMigrationPage")
);
const AdminLogsPage = lazy(() => import("./pages/Admin/AdminLogsPage"));
const AdminCredentialsPage = lazy(
  () => import("./pages/Admin/AdminCredentialsPage")
);
const AdminBillingPage = lazy(() => import("./pages/Admin/AdminBillingPage"));
const AdminClinicPage = lazy(() => import("./pages/Admin/AdminClinicPage"));

const App = () => {
  const [serverErrorMsg, setServerErrorMsg] = useState<string | undefined>();
  const { socket, setSocket } = useSocketContext();
  const { auth } = useAuthContext();
  const { user } = useUserContext();
  //REFRESH TOKEN
  const { tokenLimitVerifierID, toastExpiredID } = useRefreshToken();
  //LOCAL STORAGE
  // useLocalStorageTracker();
  useAutoLogout(120, toastExpiredID, tokenLimitVerifierID); //autologout in x min
  useLogoutForAll(); //log every tabs out if logout in one tab
  //CONTEXT SOCKETS
  useStaffInfosSocket();
  useAdminsInfosSocket();
  useUserSocket();
  useClinicSocket();
  useUnreadExternalSocket(); //for staff and patient
  useUnreadSocket(); //for staff
  useUnreadTodoSocket(); //for staff
  useUnreadFaxSocket(); //for staff (to remove one for all user if a user reads a new fax)
  //REACT QUERY SOCKETS
  useReactQuerySocket();
  useServerErrorSocket(setServerErrorMsg); //for server errors

  //For new tabs
  useEffect(() => {
    if (auth?.email && !socket) {
      const mySocket = socketIOClient(import.meta.env.VITE_BACKEND_URL, {
        withCredentials: true,
      });
      mySocket.on("connect", () => {
        console.log("Socket connected");
      });

      mySocket.on("disconnect", (reason) => {
        console.log("Socket disconnected:", reason);
      });

      mySocket.on("reconnect_attempt", (attemptNumber) => {
        console.log(`Socket reconnect attempt #${attemptNumber}`);
      });

      mySocket.on("reconnect", (attemptNumber) => {
        console.log(`Socket reconnexion succeed after ${attemptNumber} tries`);
      });

      mySocket.on("reconnect_failed", () => {
        console.log("Socket reconnexion failure");
      });

      mySocket.emit("message", { key: ["logs"] });
      if (user?.access_level === "staff") mySocket.emit("start polling faxes");
      setSocket(mySocket);
    }
  }, [auth, socket, setSocket, user]);

  if (serverErrorMsg) return <div>{serverErrorMsg}</div>;

  return (
    <>
      <Routes>
        {/*=============== LOGIN LAYOUT =================*/}
        <Route path="/" element={<LoginLayout />}>
          {/* public routes */}
          <Route index element={<LoginPage />} />
          <Route path="unauthorized" element={<UnauthorizedPage />} />
          <Route
            path="suspended"
            element={
              <Suspense fallback={<CircularProgressMedium />}>
                <SuspendedPage />
              </Suspense>
            }
          />
          <Route
            path="closed"
            element={
              <Suspense fallback={<CircularProgressMedium />}>
                <ClosedPage />
              </Suspense>
            }
          />
          <Route path="reset-password" element={<ResetPage />} />
          {/* catch all */}
          <Route path="*" element={<MissingPage />} />
        </Route>
        {/*=============== STAFF LAYOUT =================*/}
        <Route
          path="staff"
          element={
            <StaffLayout
              toastExpiredID={toastExpiredID}
              tokenLimitVerifierID={tokenLimitVerifierID}
            />
          }
        >
          {/* protected routes */}
          <Route element={<RequireAuth allowedAccesses={["staff"]} />}>
            <Route path="calendar" element={<StaffCalendarPage />} />
            <Route
              path="search-patient"
              element={
                <Suspense fallback={<CircularProgressMedium />}>
                  <StaffSearchPatientPage />
                </Suspense>
              }
            />
            <Route
              path="groups"
              element={
                <Suspense fallback={<CircularProgressMedium />}>
                  <StaffPatientsGroupsPage />
                </Suspense>
              }
            />
            <Route
              path="groups/:gid/:gtype"
              element={
                <Suspense fallback={<CircularProgressMedium />}>
                  <StaffPatientsGroupsPage />
                </Suspense>
              }
            />
            <Route
              path="patient-record/:id"
              element={
                <Suspense fallback={<CircularProgressMedium />}>
                  <StaffPatientRecordPage />
                </Suspense>
              }
            />
            <Route
              path="signup-patient"
              element={
                <Suspense fallback={<CircularProgressMedium />}>
                  <StaffSignupPatientPage />
                </Suspense>
              }
            />
            <Route
              path="search-practicians"
              element={
                <Suspense fallback={<CircularProgressMedium />}>
                  <StaffSearchPracticiansPage />
                </Suspense>
              }
            />
            <Route
              path="reports-inbox"
              element={
                <Suspense fallback={<CircularProgressMedium />}>
                  <StaffReportsInboxPage />
                </Suspense>
              }
            />
            <Route
              path="messages"
              element={
                <Suspense fallback={<CircularProgressMedium />}>
                  <StaffMessagesPage />
                </Suspense>
              }
            />
            <Route
              path="messages/:messageId/:sectionName/:msgType"
              element={
                <Suspense fallback={<CircularProgressMedium />}>
                  <StaffMessagesPage />
                </Suspense>
              }
            />
            <Route
              path="fax"
              element={
                <Suspense fallback={<CircularProgressMedium />}>
                  <StaffFaxPage />
                </Suspense>
              }
            />
            <Route
              path="reference"
              element={
                <Suspense fallback={<CircularProgressMedium />}>
                  <StaffReferencePage />
                </Suspense>
              }
            />
            <Route
              path="calvinai"
              element={
                <Suspense fallback={<CircularProgressMedium />}>
                  <StaffCalvinAIPage />
                </Suspense>
              }
            />
            <Route
              path="billing"
              element={
                <Suspense fallback={<CircularProgressMedium />}>
                  <StaffBillingPage />
                </Suspense>
              }
            />
            <Route
              path="billing/:pid/:pName/:hcn/:date/:refohip"
              element={
                <Suspense fallback={<CircularProgressMedium />}>
                  <StaffBillingPage />
                </Suspense>
              }
            />
            <Route
              path="billing/:pid/:pName/:hcn/:date"
              element={
                <Suspense fallback={<CircularProgressMedium />}>
                  <StaffBillingPage />
                </Suspense>
              }
            />
            <Route
              path="all-cycles"
              element={
                <Suspense fallback={<CircularProgressMedium />}>
                  <StaffAllCyclesPage />
                </Suspense>
              }
            />
            <Route
              path="my-account"
              element={
                <Suspense fallback={<CircularProgressMedium />}>
                  <StaffMyAccountPage />
                </Suspense>
              }
            />
            <Route
              path="credentials"
              element={
                <Suspense fallback={<CircularProgressMedium />}>
                  <StaffCredentialsPage />
                </Suspense>
              }
            />
          </Route>
        </Route>
        {/*=============== ADMIN LAYOUT =================*/}
        <Route
          path="admin"
          element={
            <AdminLayout
              toastExpiredID={toastExpiredID}
              tokenLimitVerifierID={tokenLimitVerifierID}
            />
          }
        >
          {/* protected routes */}
          <Route element={<RequireAuth allowedAccesses={["admin"]} />}>
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route
              path="staff-accounts"
              element={
                <Suspense fallback={<CircularProgressMedium />}>
                  <AdminStaffAccountsPage />
                </Suspense>
              }
            />
            <Route
              path="patients-accounts"
              element={
                <Suspense fallback={<CircularProgressMedium />}>
                  <AdminPatientsAccountsPage />
                </Suspense>
              }
            />
            <Route
              path="clinic"
              element={
                <Suspense fallback={<CircularProgressMedium />}>
                  <AdminClinicPage />
                </Suspense>
              }
            />
            <Route
              path="billing"
              element={
                <Suspense fallback={<CircularProgressMedium />}>
                  <AdminBillingPage />
                </Suspense>
              }
            />
            <Route
              path="migration"
              element={
                <Suspense fallback={<CircularProgressMedium />}>
                  <AdminMigrationPage />
                </Suspense>
              }
            />
            <Route
              path="logs"
              element={
                <Suspense fallback={<CircularProgressMedium />}>
                  <AdminLogsPage />
                </Suspense>
              }
            />
            <Route
              path="my-account"
              element={
                <Suspense fallback={<CircularProgressMedium />}>
                  <AdminMyAccountPage />
                </Suspense>
              }
            />
            <Route
              path="credentials"
              element={
                <Suspense fallback={<CircularProgressMedium />}>
                  <AdminCredentialsPage />
                </Suspense>
              }
            />
          </Route>
        </Route>
        {/*=============== PATIENT LAYOUT =================*/}
        <Route
          path="patient"
          element={
            <PatientLayout
              toastExpiredID={toastExpiredID}
              tokenLimitVerifierID={tokenLimitVerifierID}
            />
          }
        >
          {/* protected routes */}
          <Route element={<RequireAuth allowedAccesses={["patient"]} />}>
            <Route path="messages" element={<PatientMessagesPage />} />
            <Route
              path="appointments"
              element={
                <Suspense fallback={<CircularProgressMedium />}>
                  <PatientAppointmentsPage />
                </Suspense>
              }
            />
            <Route
              path="pamphlets"
              element={
                <Suspense fallback={<CircularProgressMedium />}>
                  <PatientPamphletsPage />
                </Suspense>
              }
            />
            <Route
              path="pharmacies"
              element={
                <Suspense fallback={<CircularProgressMedium />}>
                  <PatientPharmaciesPage />
                </Suspense>
              }
            />
            <Route
              path="my-account"
              element={
                <Suspense fallback={<CircularProgressMedium />}>
                  <PatientMyAccountPage />
                </Suspense>
              }
            />
            <Route
              path="credentials"
              element={
                <Suspense fallback={<CircularProgressMedium />}>
                  <PatientCredentialsPage />
                </Suspense>
              }
            />
          </Route>
        </Route>
      </Routes>
    </>
  );
};

export default App;
