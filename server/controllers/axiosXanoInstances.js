const axios = require("axios");
require("dotenv").config();

const axiosXanoAdmin = axios.create({
  baseURL: process.env.XANO_ADMIN_URL,
});

const axiosXanoStaff = axios.create({
  baseURL: process.env.XANO_STAFF_URL,
});

const axiosXanoPatient = axios.create({
  baseURL: process.env.XANO_PATIENT_URL,
});

const axiosXanoReset = axios.create({
  baseURL: process.env.XANO_RESET_URL,
});

module.exports = {
  axiosXanoAdmin,
  axiosXanoStaff,
  axiosXanoPatient,
  axiosXanoReset,
};
