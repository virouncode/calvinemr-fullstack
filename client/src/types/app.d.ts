import { Socket } from "socket.io-client";
import {
  AdminType,
  ClinicType,
  DemographicsType,
  PatientType,
  SettingType,
  StaffType,
} from "./api";

export type CodeTableType = {
  code: string;
  name: string;
};

export type AuthType = {
  email: string;
  tokenLimit?: string;
} | null;

export type AuthContextType = {
  auth: AuthType;
  setAuth: React.Dispatch<React.SetStateAction<AuthType>>;
};

export type UserStaffType = StaffType &
  SettingType & {
    unreadMessagesNbr: number;
    unreadMessagesExternalNbr: number;
    unreadTodosNbr: number;
    unreadNbr: number;
  };

export type UserPatientType = PatientType &
  DemographicsType & { full_name: string; unreadNbr: number; title?: string };

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
  clinic: ClinicType;
  setClinic: React.Dispatch<React.SetStateAction<ClinicType>>;
};
