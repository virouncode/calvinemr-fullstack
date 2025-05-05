import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
axios.defaults.withCredentials = true;

export const axiosXanoAdmin = axios.create({
  baseURL: process.env.XANO_ADMIN_URL,
  timeout: 25000,
});

export const axiosXanoStaff = axios.create({
  baseURL: process.env.XANO_STAFF_URL,
  timeout: 25000,
});

export const axiosXanoPatient = axios.create({
  baseURL: process.env.XANO_PATIENT_URL,
  timeout: 25000,
});

export const axiosXanoReset = axios.create({
  baseURL: process.env.XANO_RESET_URL,
  timeout: 25000,
});
