//Librairies
import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import AdminLayout from "./components/All/Layouts/AdminLayout";
import LoginLayout from "./components/All/Layouts/LoginLayout";
import PatientLayout from "./components/All/Layouts/PatientLayout";
import StaffLayout from "./components/All/Layouts/StaffLayout";
import RequireAuth from "./context/RequireAuth";
import useSocketConfig from "./hooks/reactquery/queries/useSocketConfig";
import useAdminsInfosSocket from "./hooks/socket/useAdminsInfosSocket";
import useClinicSocket from "./hooks/socket/useClinicSocket";
import useReactQuerySocket from "./hooks/socket/useReactQuerySocket";
import { useServerErrorSocket } from "./hooks/socket/useServerErrorSocket";
import useStaffInfosSocket from "./hooks/socket/useStaffInfosSocket";
import useUnreadExternalSocket from "./hooks/socket/useUnreadExternalSocket";
import useUnreadSocket from "./hooks/socket/useUnreadSocket";
import useUnreadTodoSocket from "./hooks/socket/useUnreadTodoSocket";
import useUserSocket from "./hooks/socket/useUserSocket";
import useAutoLogout from "./hooks/useAutoLogout";
import { useLocalStorageTracker } from "./hooks/useLocalStorageTracker";
import useLogoutForAll from "./hooks/useLogoutForAll";
import useRefreshToken from "./hooks/useRefreshToken";
import AdminBillingPage from "./pages/Admin/AdminBillingPage";
import AdminClinicPage from "./pages/Admin/AdminClinicPage";
import AdminCredentialsPage from "./pages/Admin/AdminCredentialsPage";
import AdminDashboardPage from "./pages/Admin/AdminDashboardPage";
import AdminMigrationPage from "./pages/Admin/AdminMigrationPage";
import AdminMyAccountPage from "./pages/Admin/AdminMyAccountPage";
import AdminPatientsAccountsPage from "./pages/Admin/AdminPatientsAccountsPage";
import AdminStaffAccountsPage from "./pages/Admin/AdminStaffAccountsPage";
import ClosedPage from "./pages/All/ClosedPage";
import LoginPage from "./pages/All/LoginPage";
import MissingPage from "./pages/All/MissingPage";
import ResetPage from "./pages/All/ResetPage";
import SuspendedPage from "./pages/All/SuspendedPage";
import UnauthorizedPage from "./pages/All/UnauthorizedPage";
import PatientAppointmentsPage from "./pages/Patient/PatientAppointmentsPage";
import PatientCredentialsPage from "./pages/Patient/PatientCredentialsPage";
import PatientMessagesPage from "./pages/Patient/PatientMessagesPage";
import PatientMyAccountPage from "./pages/Patient/PatientMyAccountPage";
import PatientPamphletsPage from "./pages/Patient/PatientPamphletsPage";
import PatientPharmaciesPage from "./pages/Patient/PatientPharmaciesPage";
import StaffBillingPage from "./pages/Staff/StaffBillingPage";
import StaffCalendarPage from "./pages/Staff/StaffCalendarPage";
import StaffCalvinAIPage from "./pages/Staff/StaffCalvinAIPage";
import StaffCredentialsPage from "./pages/Staff/StaffCredentialsPage";
import StaffFaxPage from "./pages/Staff/StaffFaxPage";
import StaffMessagesPage from "./pages/Staff/StaffMessagesPage";
import StaffMyAccountPage from "./pages/Staff/StaffMyAccountPage";
import StaffPatientRecordPage from "./pages/Staff/StaffPatientRecordPage";
import StaffPatientsGroupsPage from "./pages/Staff/StaffPatientsGroupsPage";
import StaffReferencePage from "./pages/Staff/StaffReferencePage";
import StaffReportsInboxPage from "./pages/Staff/StaffReportsInboxPage";
import StaffSearchPatientPage from "./pages/Staff/StaffSearchPatientPage";
import StaffSignupPatientPage from "./pages/Staff/StaffSignupPatientPage";

const App = () => {
  const [serverErrorMsg, setServerErrorMsg] = useState<string | undefined>();
  //REFRESH TOKEN
  const { tokenLimitVerifierID, toastExpiredID } = useRefreshToken();
  //LOCAL STORAGE
  useLocalStorageTracker();
  useAutoLogout(120, toastExpiredID, tokenLimitVerifierID); //autologout in x min
  useLogoutForAll(); //log every tabs out if logout in one tab
  //SOCKET CONFIG
  useSocketConfig(); //true for dev, false for prod
  //CONTEXT SOCKETS
  useStaffInfosSocket();
  useAdminsInfosSocket();
  useUserSocket();
  useClinicSocket();
  useUnreadExternalSocket(); //for staff and patient
  useUnreadSocket(); //for staff
  useUnreadTodoSocket(); //for staff
  //REACT QUERY SOCKETS
  useReactQuerySocket();
  useServerErrorSocket(setServerErrorMsg); //for server errors

  if (serverErrorMsg) return <div>{serverErrorMsg}</div>;

  return (
    <>
      <Routes>
        <Route path="/" element={<LoginLayout />}>
          {/* public routes */}
          <Route index element={<LoginPage />} />
          <Route path="unauthorized" element={<UnauthorizedPage />} />
          <Route path="suspended" element={<SuspendedPage />} />
          <Route path="closed" element={<ClosedPage />} />
          <Route path="reset-password" element={<ResetPage />} />
          {/* catch all */}
          <Route path="*" element={<MissingPage />} />
        </Route>
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
            <Route path="search-patient" element={<StaffSearchPatientPage />} />
            <Route path="groups" element={<StaffPatientsGroupsPage />} />
            <Route
              path="groups/:gid/:gtype"
              element={<StaffPatientsGroupsPage />}
            />
            <Route
              path="patient-record/:id"
              element={<StaffPatientRecordPage />}
            />
            <Route path="signup-patient" element={<StaffSignupPatientPage />} />
            <Route path="reports-inbox" element={<StaffReportsInboxPage />} />
            <Route path="messages" element={<StaffMessagesPage />} />
            <Route
              path="messages/:messageId/:sectionName/:msgType"
              element={<StaffMessagesPage />}
            />
            <Route path="fax" element={<StaffFaxPage />} />
            <Route path="reference" element={<StaffReferencePage />} />
            <Route path="calvinai" element={<StaffCalvinAIPage />} />
            <Route path="billing" element={<StaffBillingPage />} />
            <Route
              path="billing/:pid/:pName/:hcn/:date"
              element={<StaffBillingPage />}
            />
            <Route path="my-account" element={<StaffMyAccountPage />} />
            <Route path="credentials" element={<StaffCredentialsPage />} />
          </Route>
        </Route>
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
            <Route path="staff-accounts" element={<AdminStaffAccountsPage />} />
            <Route
              path="patients-accounts"
              element={<AdminPatientsAccountsPage />}
            />
            <Route path="clinic" element={<AdminClinicPage />} />
            <Route path="billing" element={<AdminBillingPage />} />
            <Route path="migration" element={<AdminMigrationPage />} />
            <Route path="my-account" element={<AdminMyAccountPage />} />
            <Route path="credentials" element={<AdminCredentialsPage />} />
          </Route>
        </Route>
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
            <Route path="appointments" element={<PatientAppointmentsPage />} />
            <Route path="pamphlets" element={<PatientPamphletsPage />} />
            <Route path="pharmacies" element={<PatientPharmaciesPage />} />
            <Route path="my-account" element={<PatientMyAccountPage />} />
            <Route path="credentials" element={<PatientCredentialsPage />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
};

export default App;
