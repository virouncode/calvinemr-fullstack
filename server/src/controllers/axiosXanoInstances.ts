import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export const axiosXanoAdmin = axios.create({
  baseURL: process.env.XANO_ADMIN_URL,
});

export const axiosXanoStaff = axios.create({
  baseURL: process.env.XANO_STAFF_URL,
});

export const axiosXanoPatient = axios.create({
  baseURL: process.env.XANO_PATIENT_URL,
});

export const axiosXanoReset = axios.create({
  baseURL: process.env.XANO_RESET_URL,
});
