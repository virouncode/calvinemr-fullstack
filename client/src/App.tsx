//Librairies
import React, { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginLayout from "./components/All/Layouts/LoginLayout";
import RequireAuth from "./context/RequireAuth";
import { useServerErrorSocket } from "./hooks/socket/useServerErrorSocket";
import ClosedPage from "./pages/All/ClosedPage";
import ErrorPage from "./pages/All/ErrorPage";
import LoginPage from "./pages/All/LoginPage";
import MissingPage from "./pages/All/MissingPage";
import ResetPage from "./pages/All/ResetPage";
import SuspendedPage from "./pages/All/SuspendedPage";
import UnauthorizedPage from "./pages/All/UnauthorizedPage";
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
import StaffLayout from "./components/All/Layouts/StaffLayout";

const App = () => {
  const [serverErrorMsg, setServerErrorMsg] = useState<string | undefined>();
  // //REFRESH TOKEN
  // const { tokenLimitVerifierID, toastExpiredID } = useRefreshToken();
  // //LOCAL STORAGE
  // useLocalStorageTracker();
  // useAutoLogout(120, toastExpiredID, tokenLimitVerifierID); //autologout in x min
  // useLogoutForAll(); //log every tabs out if logout in one tab
  //CONTEXT SOCKETS
  // useStaffInfosSocket();
  // useAdminsInfosSocket();
  // useUserSocket();
  // useClinicSocket();
  // useUnreadExternalSocket(); //for staff and patient
  // useUnreadSocket(); //for staff
  // useUnreadTodoSocket(); //for staff
  // useUnreadFaxSocket(); //for staff (to remove one for all user if a user reads a new fax)
  // //REACT QUERY SOCKETS
  // useReactQuerySocket();
  useServerErrorSocket(setServerErrorMsg); //for server errors

  if (serverErrorMsg) return <div>{serverErrorMsg}</div>;

  const router = createBrowserRouter([
    {
      path: "/",
      element: <LoginLayout />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "",
          element: <LoginPage />,
        },
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
    {
      path: "/staff",
      element: <RequireAuth allowedAccesses={["staff"]} />,
      children: [
        {
          path: "calendar",
          element: (
            <StaffLayout>
              <StaffCalendarPage />
            </StaffLayout>
          ),
        },
        {
          path: "search-patient",
          element: <StaffSearchPatientPage />,
        },
        {
          path: "groups",
          element: <StaffPatientsGroupsPage />,
        },
        {
          path: "groups/:gid/:gtype",
          element: <StaffPatientsGroupsPage />,
        },
        {
          path: "patient-record/:id",
          element: <StaffPatientRecordPage />,
        },
        {
          path: "signup-patient",
          element: <StaffSignupPatientPage />,
        },
        {
          path: "reports-inbox",
          element: <StaffReportsInboxPage />,
        },
        {
          path: "messages",
          element: <StaffMessagesPage />,
        },
        {
          path: "messages/:messageId/:sectionName/:msgType",
          element: <StaffMessagesPage />,
        },
        {
          path: "fax",
          element: <StaffFaxPage />,
        },
        {
          path: "reference",
          element: <StaffReferencePage />,
        },
        {
          path: "calvinai",
          element: <StaffCalvinAIPage />,
        },
        {
          path: "billing",
          element: <StaffBillingPage />,
        },
        {
          path: "billing/:pid/:pName/:hcn/:date",
          element: <StaffBillingPage />,
        },
        {
          path: "my-account",
          element: <StaffMyAccountPage />,
        },
        {
          path: "credentials",
          element: <StaffCredentialsPage />,
        },
      ],
    },
  ]);

  //   return (
  //     <>

  //       <Routes>
  //         <Route path="/" element={<LoginLayout />}>
  //           {/* public routes */}
  //           <Route index element={<LoginPage />} />
  //           <Route path="unauthorized" element={<UnauthorizedPage />} />
  //           <Route path="suspended" element={<SuspendedPage />} />
  //           <Route path="closed" element={<ClosedPage />} />
  //           <Route path="reset-password" element={<ResetPage />} />
  //           {/* catch all */}
  //           <Route path="*" element={<MissingPage />} />
  //         </Route>

  //         <Route
  //           path="staff"
  //           element={
  //             <StaffLayout
  //               toastExpiredID={toastExpiredID}
  //               tokenLimitVerifierID={tokenLimitVerifierID}
  //             />
  //           }
  //         >
  //           {/* protected routes */}
  //           <Route element={<RequireAuth allowedAccesses={["staff"]} />}>
  //             <Route path="calendar" element={<StaffCalendarPage />} />
  //             <Route path="search-patient" element={<StaffSearchPatientPage />} />
  //             <Route path="groups" element={<StaffPatientsGroupsPage />} />
  //             <Route
  //               path="groups/:gid/:gtype"
  //               element={<StaffPatientsGroupsPage />}
  //             />
  //             <Route
  //               path="patient-record/:id"
  //               element={<StaffPatientRecordPage />}
  //             />
  //             <Route path="signup-patient" element={<StaffSignupPatientPage />} />
  //             <Route path="reports-inbox" element={<StaffReportsInboxPage />} />
  //             <Route path="messages" element={<StaffMessagesPage />} />
  //             <Route
  //               path="messages/:messageId/:sectionName/:msgType"
  //               element={<StaffMessagesPage />}
  //             />
  //             <Route path="fax" element={<StaffFaxPage />} />
  //             <Route path="reference" element={<StaffReferencePage />} />
  //             <Route path="calvinai" element={<StaffCalvinAIPage />} />
  //             <Route path="billing" element={<StaffBillingPage />} />
  //             <Route
  //               path="billing/:pid/:pName/:hcn/:date"
  //               element={<StaffBillingPage />}
  //             />
  //             <Route path="my-account" element={<StaffMyAccountPage />} />
  //             <Route path="credentials" element={<StaffCredentialsPage />} />
  //           </Route>
  //         </Route>
  //         <Route
  //           path="admin"
  //           element={
  //             <AdminLayout
  //               toastExpiredID={toastExpiredID}
  //               tokenLimitVerifierID={tokenLimitVerifierID}
  //             />
  //           }
  //         >
  //           {/* protected routes */}
  //           <Route element={<RequireAuth allowedAccesses={["admin"]} />}>
  //             <Route path="dashboard" element={<AdminDashboardPage />} />
  //             <Route path="staff-accounts" element={<AdminStaffAccountsPage />} />
  //             <Route
  //               path="patients-accounts"
  //               element={<AdminPatientsAccountsPage />}
  //             />
  //             <Route path="clinic" element={<AdminClinicPage />} />
  //             <Route path="billing" element={<AdminBillingPage />} />
  //             <Route path="migration" element={<AdminMigrationPage />} />
  //             <Route path="logs" element={<AdminLogsPage />} />
  //             <Route path="my-account" element={<AdminMyAccountPage />} />
  //             <Route path="credentials" element={<AdminCredentialsPage />} />
  //           </Route>
  //         </Route>
  //         <Route
  //           path="patient"
  //           element={
  //             <PatientLayout
  //               toastExpiredID={toastExpiredID}
  //               tokenLimitVerifierID={tokenLimitVerifierID}
  //             />
  //           }
  //         >
  //           {/* protected routes */}
  //           <Route element={<RequireAuth allowedAccesses={["patient"]} />}>
  //             <Route path="messages" element={<PatientMessagesPage />} />
  //             <Route path="appointments" element={<PatientAppointmentsPage />} />
  //             <Route path="pamphlets" element={<PatientPamphletsPage />} />
  //             <Route path="pharmacies" element={<PatientPharmaciesPage />} />
  //             <Route path="my-account" element={<PatientMyAccountPage />} />
  //             <Route path="credentials" element={<PatientCredentialsPage />} />
  //           </Route>
  //         </Route>
  //       </Routes>
  //     </>
  //   );
  // };
  return <RouterProvider router={router} />;
};

export default App;
