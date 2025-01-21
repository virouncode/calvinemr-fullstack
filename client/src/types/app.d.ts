import React from "react";
import { Socket } from "socket.io-client";
import {
  AdminType,
  ClinicType,
  DemographicsType,
  PatientType,
  SettingsType,
  StaffType,
} from "./api";

export type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

export type CodeTableType = {
  code: string;
  name: string;
};

export type AuthType = {
  email: string;
  tokenLimit?: number;
};

export type AuthContextType = {
  auth: AuthType | null;
  setAuth: React.Dispatch<React.SetStateAction<AuthType | null>>;
};

export type UserStaffType = StaffType & {
  settings: SettingsType;
  unreadMessagesNbr: number;
  unreadMessagesExternalNbr: number;
  unreadTodosNbr: number;
  unreadNbr: number;
  unreadFaxNbr: number;
  nbReportsInbox: number;
};

export type UserPatientType = PatientType & {
  demographics: DemographicsType;
  full_name: string;
  unreadNbr: number;
  title?: string;
};

export type UserAdminType = AdminType;

export type UserType = UserStaffType | UserPatientType | UserAdminType | null;

export type UserContextType = {
  user: UserType;
  setUser: React.Dispatch<React.SetStateAction<UserType>>;
};

export type StaffInfosContextType = {
  staffInfos: StaffType[];
  setStaffInfos: React.Dispatch<React.SetStateAction<StaffType[]>>;
};

export type AdminsInfosContextType = {
  adminsInfos: AdminType[];
  setAdminsInfos: React.Dispatch<React.SetStateAction<AdminType[]>>;
};

export type TitleContextType = {
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
};

export type SocketContextType = {
  socket: Socket | null;
  setSocket: React.Dispatch<React.SetStateAction<Socket | null>>;
};

export type ClinicContextType = {
  clinic: ClinicType | null;
  setClinic: React.Dispatch<React.SetStateAction<ClinicType | null>>;
};

export type AxiosXanoConfigType = {
  url: string;
  method: string;
  data?: object;
  params: {
    //query parameters !!! Not route parameters
    URL: string;
    userType: string;
    queryParams?: object;
    tempToken?: string;
  };
  signal?: AbortSignal;
};

export type CredentialsFormType = {
  email: string;
  password: string;
  confirmPassword: string;
  pin: string;
};

export type PasswordValidityType = {
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
  special: boolean;
  size: boolean;
};

export type TopKFrequentType = {
  id: number;
  [key: string]: number | string;
  frequency: number;
};

export type TotalRevenueBySiteType = {
  revenue: number;
};

export type TotalStaffBySiteType = {
  Doctors: number;
  ["Medical students"]: number;
  Nurses: number;
  ["Nursing students"]: number;
  Secretaries: number;
  ["Ultra sound techs"]: number;
  ["Lab techs"]: number;
  Nutritionists: number;
  Physiotherapists: number;
  Psychologists: number;
  Others: number;
};

export type TotalStaffDurationBySiteType = {
  longest: number | null;
  shortest: number | null;
};

export type SearchPatientType = {
  name: string;
  email: string;
  phone: string;
  birth: string;
  chart: string;
  health: string;
};

export type AppointmentProposalType = {
  id: number;
  host_id: number;
  start: number;
  end: number;
  reason: string;
  all_day: boolean;
};

export type RemainingStaffType = {
  id: number;
  color: string;
  textColor: string;
};

export type SocketMessageType<TData> = {
  route: string;
  action: string;
  content: {
    id: number;
    data: TData;
    userId?: number;
  };
};

export type DayType =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export type PromptTextType = {
  intro: string;
  body: string;
  attachments: string;
  reports: string;
  question: string;
};

export type AIMessageType = {
  role: "user" | "assistant";
  content: string;
};
