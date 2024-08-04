const axios = require("axios");
const useragent = require("useragent");
const { toPatientName } = require("../utils/toPatientName");
const { generatePassword } = require("../utils/generatePassword");
const {
  axiosXanoAdmin,
  axiosXanoStaff,
  axiosXanoPatient,
  axiosXanoReset,
} = require("./axiosXanoInstances");
const { handleResponse, handleError } = require("../utils/helper");
const { generatePIN } = require("../utils/generatePIN");
require("dotenv").config();

const getAxiosInstance = (userType) => {
  switch (userType) {
    case "admin":
      return axiosXanoAdmin;
    case "staff":
      return axiosXanoStaff;
    case "patient":
      return axiosXanoPatient;
    case "reset":
      return axiosXanoReset;
    default:
      throw new Error("Type d'utilisateur non valide");
  }
};

const getXano = async (req, res) => {
  try {
    const { URL, userType, queryParams } = req.query;
    const authToken = req.cookies.token;
    let headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    };
    const config = {
      method: "get",
      url: URL,
      headers,
    };
    if (queryParams) config.params = queryParams;
    const axiosXanoInstance = getAxiosInstance(userType);
    const response = await axiosXanoInstance(config);
    handleResponse(response, res);
  } catch (err) {
    handleError(err, res);
  }
};

const postXano = async (req, res) => {
  try {
    const { URL, userType } = req.query;
    const datasToPost = req.body;
    const authToken = req.cookies.token;
    let headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    };
    const config = {
      method: "post",
      url: URL,
      headers,
      data: datasToPost,
    };
    const axiosXanoInstance = getAxiosInstance(userType);
    const response = await axiosXanoInstance(config);
    handleResponse(response, res);
  } catch (err) {
    handleError(err, res);
  }
};
const postEform = async (req, res) => {
  const fdfContent = `
    %FDF-1.2
1 0 obj

   <</FDF

      <</Status (Submit was Successful)>>

   >>

endobj

trailer << /Root 1 0 R >>

%%EOF`;
  try {
    const authToken = req.cookies.token;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    };
    const config = {
      method: "post",
      url: "/eforms",
      headers,
      data: { datas: JSON.stringify(req.body), patient_id: 5 },
    };

    const axiosXanoInstance = getAxiosInstance("staff");

    res
      .setHeader(
        "Access-Control-Allow-Origin",
        "https://acrobatservices.adobe.com"
      )
      .setHeader("Content-Type", "application/vnd.fdf")
      .setHeader("Content-disposition", "inline")
      .status(200)
      .send(fdfContent);
  } catch (err) {
    console.error(err.message);
    res
      .setHeader(
        "Access-Control-Allow-Origin",
        "https://acrobatservices.adobe.com"
      )
      .setHeader("Content-Type", "application/vnd.fdf")
      .setHeader("Content-disposition", "inline")
      .status(500)
      .send(fdfContent);
  }
};

const putXano = async (req, res) => {
  try {
    const { URL, userType } = req.query;
    const datasToPut = req.body;
    const authToken = req.cookies.token;
    let headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    };
    const config = {
      method: "put",
      url: URL,
      headers,
      data: datasToPut,
    };
    const axiosXanoInstance = getAxiosInstance(userType);
    const response = await axiosXanoInstance(config);
    handleResponse(response, res);
  } catch (err) {
    handleError(err, res);
  }
};

const deleteXano = async (req, res) => {
  try {
    const { URL, userType } = req.query;
    const authToken = req.cookies.token;
    let headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    };

    const config = {
      method: "delete",
      url: URL,
      headers,
    };
    const axiosXanoInstance = getAxiosInstance(userType);
    const response = await axiosXanoInstance(config);
    res.status(response.status).send(JSON.stringify({ success: true }));
  } catch (err) {
    handleError(err, res);
  }
};

const authXano = async (req, res) => {
  try {
    const { URL, userType } = req.query;
    const datasToPost = req.body;
    let headers = {
      "Content-Type": "application/json",
    };
    const config = {
      method: "post",
      url: URL,
      headers,
      data: datasToPost,
    };
    const axiosXanoInstance = getAxiosInstance(userType);
    const response = await axiosXanoInstance(config);
    //new style cookie
    res.cookie("token", response.data.authToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      secure: true,
      sameSite: "none",
    });
    res.status(response.status).send(
      JSON.stringify({
        success: true,
        data: Date.now() + 24 * 60 * 60 * 1000,
      })
    );
  } catch (err) {
    handleError(err, res);
  }
};

const resetXano = async (req, res) => {
  try {
    const { URL, userType, tempToken } = req.query;
    const datasToPost = req.body;
    let headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tempToken}`,
    };
    const config = {
      method: "post",
      url: URL,
      headers,
      data: datasToPost,
    };
    const axiosXanoInstance = getAxiosInstance(userType);
    const response = await axiosXanoInstance(config);
    res.status(response.status).send(JSON.stringify({ success: true }));
  } catch (err) {
    handleError(err, res);
  }
};

const newStaff = async (req, res) => {
  try {
    const datasToPost = req.body;
    const clinicName = datasToPost.clinic_name;
    delete datasToPost.clinic_name;
    const newPassword = generatePassword();
    const newPIN = generatePIN();
    datasToPost.password = newPassword;
    datasToPost.pin = newPIN;
    const authToken = req.cookies.token;
    let headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    };
    const config = {
      method: "post",
      url: "/staff",
      headers,
      data: datasToPost,
    };
    const axiosXanoInstance = getAxiosInstance("admin");
    const response = await axiosXanoInstance(config);
    const emailToPost = {
      to: datasToPost.email, //to be changed to datasToPost.email
      subject: `Welcome to ${clinicName} - DO NOT REPLY`,
      text: `
Dear ${datasToPost.full_name},

Welcome to ${clinicName}!

Here is your access to the Staff Portal : 

Go to the following web address: ${process.env.APP_URL_SHORTCUT}
Login: ${datasToPost.email} 
Temporary Password: ${newPassword}
Temporary PIN: ${newPIN}

Make sure to sign in as a staff member (click the pink button on the left).
Once you login for the first time, it is very important to change your password and your PIN. This will guarantee that only you have access to your personal staff portal.

For confidentiality purposes, all the messages you send and receive will be through the portal and are not shared with any external email server.
Please do not reply to this email, as this address is automated and not monitored.

Regards,
The Reception Desk

Powered by Calvin EMR`,
    };
    const mailgunUrl = `${process.env.BACKEND_URL}/api/mailgun`;
    await axios.post(mailgunUrl, emailToPost);
    handleResponse(response, res);
  } catch (err) {
    handleError(err, res);
  }
};

const newPatient = async (req, res) => {
  try {
    const datasToPost = req.body;
    const clinicName = datasToPost.clinic_name;
    const firstName = datasToPost.first_name;
    const lastName = datasToPost.last_name;
    const middleName = datasToPost.middle_name;
    delete datasToPost.clinic_name;
    delete datasToPost.first_name;
    delete datasToPost.last_name;
    delete datasToPost.middle_name;
    const newPassword = generatePassword();
    const newPIN = generatePIN();
    datasToPost.password = newPassword;
    datasToPost.pin = newPIN;
    const authToken = req.cookies.token;
    let headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    };
    const config = {
      method: "post",
      url: "/patients",
      headers,
      data: datasToPost,
    };
    const axiosXanoInstance = getAxiosInstance("staff");
    const response = await axiosXanoInstance(config);
    const emailToPost = {
      to: datasToPost.email, //to be changed to datasToPost.email
      subject: `Welcome to ${clinicName} - DO NOT REPLY`,
      text: `
Dear ${firstName}${middleName ? " " + middleName : ""} ${lastName},

Welcome to ${clinicName}!

Here is your access to the Patient Portal : 

Go to the following web address: ${process.env.APP_URL_SHORTCUT}
Login: ${datasToPost.email} 
Temporary Password: ${newPassword}
Temporary PIN: ${newPIN}

Make sure to sign in as a patient (click the pink button in the middle).
Once you login for the first time, it is very important to change your password and your PIN. This will guarantee that only you have access to your personal patient portal.

In the patient portal, you will be able to :

  - Receive and send messages/documents with the clinic
  - Request/change/delete an appointment 
  - Update your personal/medical information
  - Access to a library of patient pamphlets
  
As a new patient, you will most likely be asked to fill a medical history form. This will appear as a new message in your portal.

For confidentiality purposes, all the messages you send and receive will be through the portal and are not shared with any external email server.
Please do not reply to this email, as this address is automated and not monitored.

Regards,
The Reception Desk

Powered by Calvin EMR`,
    };
    const mailgunUrl = `${process.env.BACKEND_URL}/api/mailgun`;
    await axios.post(mailgunUrl, emailToPost);
    handleResponse(response, res);
  } catch (err) {
    handleError(err, res);
  }
};

const tempPassword = async (req, res) => {
  try {
    const { email, userType } = req.query;
    let headers = {
      "Content-Type": "application/json",
    };
    const config = {
      method: "get",
      url: `/auth/${userType}/request_temp_password`,
      headers,
      params: { email },
    };
    const axiosXanoInstance = getAxiosInstance("reset");
    const response = await axiosXanoInstance(config);
    const emailToPost = {
      to: response.data.email, //to be changed to user.email
      subject: `${process.env.CLINIC_NAME}: Temporary Password - DO NOT REPLY`,
      text: `
Hello ${response.data.full_name || toPatientName(response.data.patient_infos)}

Please find your temporary password for your account: ${
        response.data.temp_login.temp_password
      }

This password will be active for 15 minutes, after this time, please make a new request.

Please do not reply to this email, as this address is automated and not monitored.

Regards,
The Reception Desk

Powered by Calvin EMR`,
    };
    const mailgunUrl = `${process.env.BACKEND_URL}/api/mailgun`;
    await axios.post(mailgunUrl, emailToPost);
    res.status(response.status).send(JSON.stringify({ success: true }));
  } catch (err) {
    handleError(err, res);
  }
};

const unlock = async (req, res) => {
  try {
    const { user_id, pin, userType } = req.body;
    const authToken = req.cookies.token;
    let headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    };
    const config = {
      method: "post",
      url: "/unlock",
      headers,
      data: { user_id, pin },
    };
    const axiosXanoInstance = getAxiosInstance(userType);
    const response = await axiosXanoInstance(config);
    handleResponse(response, res);
  } catch (err) {
    handleError(err, res);
  }
};

module.exports = {
  getXano,
  postXano,
  postEform,
  putXano,
  deleteXano,
  authXano,
  resetXano,
  newStaff,
  newPatient,
  tempPassword,
  unlock,
};
