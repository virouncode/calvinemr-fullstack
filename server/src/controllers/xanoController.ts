import axios, { AxiosError } from "axios";
import dotenv from "dotenv";
import { Request, Response } from "express";
import { generatePassword } from "../utils/generatePassword";
import { generatePIN } from "../utils/generatePIN";
import { handleError, handleResponse } from "../utils/helper";
import {
  toPatientFirstName,
  toPatientLastName,
  toPatientMiddleName,
  toPatientName,
} from "../utils/toPatientName";
import {
  axiosXanoAdmin,
  axiosXanoPatient,
  axiosXanoReset,
  axiosXanoStaff,
} from "./axiosXanoInstances";

dotenv.config();

// Determine the appropriate Axios instance based on user type
const getAxiosInstance = (userType: string) => {
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
      throw new Error("Invalid user type");
  }
};

// GET request handler for Xano API
export const getXano = async (req: Request, res: Response): Promise<void> => {
  try {
    const { URL, userType, queryParams } = req.query;
    const authToken = req.cookies.token;

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    };
    const config = {
      method: "get",
      url: URL as string,
      headers,
      params: queryParams as object,
    };
    const axiosXanoInstance = getAxiosInstance(userType as string);
    const response = await axiosXanoInstance(config);

    if (URL === "/auth/me" && process.env.NODE_ENV !== "development") {
      const logConfig = {
        method: "post",
        url: "/logs",
        headers,
        data: {
          user_id: response.data.id,
          user_type: userType,
          ip_address: req.ip,
          user_name:
            userType === "patient"
              ? toPatientFirstName(response.data.patient_infos) +
                " " +
                toPatientMiddleName(response.data.patient_infos) +
                " " +
                toPatientLastName(response.data.patient_infos)
              : response.data.full_name,
        },
      };
      await axiosXanoInstance(logConfig);
    }

    handleResponse(response, res);
  } catch (err) {
    handleError(err as AxiosError, res);
  }
};

// POST request handler for Xano API
export const postXano = async (req: Request, res: Response): Promise<void> => {
  try {
    const { URL, userType } = req.query;
    const datasToPost = req.body;
    const authToken = req.cookies.token;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    };
    const config = {
      method: "post",
      url: URL as string,
      headers,
      data: datasToPost,
    };
    const axiosXanoInstance = getAxiosInstance(userType as string);
    const response = await axiosXanoInstance(config);
    handleResponse(response, res);
  } catch (err) {
    handleError(err as AxiosError, res);
  }
};

// PUT request handler for Xano API
export const putXano = async (req: Request, res: Response): Promise<void> => {
  try {
    const { URL, userType } = req.query;
    const datasToPut = req.body;
    const authToken = req.cookies.token;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    };
    const config = {
      method: "put",
      url: URL as string,
      headers,
      data: datasToPut,
    };
    const axiosXanoInstance = getAxiosInstance(userType as string);
    const response = await axiosXanoInstance(config);
    handleResponse(response, res);
  } catch (err) {
    handleError(err as AxiosError, res);
  }
};

// DELETE request handler for Xano API
export const deleteXano = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { URL, userType } = req.query;
    const authToken = req.cookies.token;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    };
    const data = req.body; // Optional data for DELETE request
    const config = {
      method: "delete",
      url: URL as string,
      headers,
      data,
    };
    const axiosXanoInstance = getAxiosInstance(userType as string);
    const response = await axiosXanoInstance(config);
    res.status(response.status).send(JSON.stringify({ success: true }));
  } catch (err) {
    handleError(err as AxiosError, res);
  }
};

// POST request handler for authentication
export const authXano = async (req: Request, res: Response): Promise<void> => {
  try {
    const { URL, userType } = req.query;

    const datasToPost = req.body;
    const headers = {
      "Content-Type": "application/json",
    };
    const config = {
      method: "post",
      url: URL as string,
      headers,
      data: datasToPost,
    };

    const axiosXanoInstance = getAxiosInstance(userType as string);
    const response = await axiosXanoInstance(config);

    res.cookie("token", response.data.authToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      secure: true,
      sameSite: "strict",
    });
    res.status(response.status).send(
      JSON.stringify({
        success: true,
        data: Date.now() + 24 * 60 * 60 * 1000, // 24 hours from now
      })
    );
  } catch (err) {
    handleError(err as AxiosError, res);
  }
};

// POST request handler for password reset
export const resetXano = async (req: Request, res: Response): Promise<void> => {
  try {
    const { URL, userType, tempToken } = req.query;
    const datasToPost = req.body;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tempToken as string}`,
    };
    const config = {
      method: "post",
      url: URL as string,
      headers,
      data: datasToPost,
    };
    const axiosXanoInstance = getAxiosInstance(userType as string);
    const response = await axiosXanoInstance(config);
    res.status(response.status).send(JSON.stringify({ success: true }));
  } catch (err) {
    handleError(err as AxiosError, res);
  }
};

// POST request handler to create new staff
export const newStaff = async (req: Request, res: Response): Promise<void> => {
  try {
    const datasToPost = req.body;
    const clinicName = datasToPost.clinic_name;
    delete datasToPost.clinic_name;
    const newPassword = generatePassword();
    const newPIN = generatePIN();
    datasToPost.password = newPassword;
    datasToPost.pin = newPIN;
    const authToken = req.cookies.token;
    const headers = {
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
      to: datasToPost.email,
      subject: `Welcome to ${clinicName} - DO NOT REPLY`,
      text: `Dear ${datasToPost.full_name},

Welcome to ${clinicName}!

Here is your access to the Staff Portal : 

Go to the following web address: ${process.env.APP_URL_SHORTCUT}
Login: ${datasToPost.email} 
Temporary Password: ${newPassword}
Temporary PIN: ${newPIN}

Please ensure you sign in as a staff member.
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
    handleError(err as AxiosError, res);
  }
};

// POST request handler to create new patient
export const newPatient = async (
  req: Request,
  res: Response
): Promise<void> => {
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
    const headers = {
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

    if (datasToPost.email) {
      const emailToPost = {
        to: datasToPost.email,
        subject: `Welcome to ${clinicName} - DO NOT REPLY`,
        text: `Dear ${firstName}${
          middleName ? " " + middleName : ""
        } ${lastName},

Welcome to ${clinicName}!

Here is your access to the Patient Portal : 

Go to the following web address: ${process.env.APP_URL_SHORTCUT}
Login: ${datasToPost.email} 
Temporary Password: ${newPassword}
Temporary PIN: ${newPIN}

Please ensure you sign in as a patient.
Once you login for the first time, it is very important to change your password and your PIN. This will guarantee that only you have access to your personal patient portal.

In the patient portal, you will be able to :

  - Receive and send messages/documents with the clinic
  - Request/change/delete an appointment 
  - Update your personal/medical information
  - Access to a library of patient pamphlets
  
As a new patient, you will most likely be asked to fill a medical history form. This will appear as a new message in your portal.

For confidentiality purposes, all the messages you send and receive will be through the portal and are not shared with any external email server.
Please do not reply to this email, as this address is automated and not monitored.

PS: You can also access to the patient portal through our website : https://www.carefertility.ca

Regards,
The Reception Desk

Powered by Calvin EMR`,
      };
      const mailgunUrl = `${process.env.BACKEND_URL}/api/mailgun`;
      await axios.post(mailgunUrl, emailToPost);
    }
    handleResponse(response, res);
  } catch (err) {
    handleError(err as AxiosError, res);
  }
};

// Request a temporary password for user
export const tempPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, userType } = req.query;
    const headers = {
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
      to: response.data.email,
      subject: `${process.env.CLINIC_NAME}: Temporary Password - DO NOT REPLY`,
      text: `Hello ${
        response.data.full_name || toPatientName(response.data.patient_infos)
      }

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
    handleError(err as AxiosError, res);
  }
};

// Unlock a user account
export const unlock = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user_id, pin, userType } = req.body;
    const authToken = req.cookies.token;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    };
    const config = {
      method: "post",
      url: "/unlock",
      headers,
      data: { user_id, pin },
    };
    const axiosXanoInstance = getAxiosInstance(userType as string);
    const response = await axiosXanoInstance(config);
    handleResponse(response, res);
  } catch (err) {
    handleError(err as AxiosError, res);
  }
};

export const resetStaffPwd = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { staff_id, email, clinic_name, full_name } = req.body;
    const password = generatePassword();
    const pin = generatePIN();
    const authToken = req.cookies.token;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    };
    const config = {
      method: "put",
      url: "/staff_password_pin",
      headers,
      data: { password, pin, staff_id },
    };
    const axiosXanoInstance = getAxiosInstance("admin");
    const response = await axiosXanoInstance(config);
    const emailToPost = {
      to: email,
      subject: `${clinic_name} - Password reset - DO NOT REPLY`,
      text: `Dear ${full_name},

Your password and PIN have been reset.

Here is your new access to the Staff Portal : 

Go to the following web address: ${process.env.APP_URL_SHORTCUT}
Login: ${email} 
Password: ${password}
PIN: ${pin}

Please ensure you sign in as a staff member.

Please do not reply to this email, as this address is automated and not monitored.

Regards,
The Reception Desk

Powered by Calvin EMR`,
    };
    const mailgunUrl = `${process.env.BACKEND_URL}/api/mailgun`;
    await axios.post(mailgunUrl, emailToPost);
    handleResponse(response, res);
  } catch (err) {
    handleError(err as AxiosError, res);
  }
};

export const resetPatientPwd = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { patient_id, email, clinic_name, full_name } = req.body;
    const password = generatePassword();
    const pin = generatePIN();
    const authToken = req.cookies.token;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    };
    const config = {
      method: "put",
      url: "/patient_password_pin",
      headers,
      data: { password, pin, patient_id },
    };
    const axiosXanoInstance = getAxiosInstance("admin");
    const response = await axiosXanoInstance(config);
    const emailToPost = {
      to: email,
      subject: `${clinic_name} - Password reset - DO NOT REPLY`,
      text: `Dear ${full_name},

Your password and PIN have been reset.

Here is your new access to the Patient Portal : 

Go to the following web address: ${process.env.APP_URL_SHORTCUT}
Login: ${email} 
Password: ${password}
PIN: ${pin}

Please ensure you sign in as a patient.

Please do not reply to this email, as this address is automated and not monitored.

PS: You can also access to the patient portal through our website : https://www.carefertility.ca

Regards,
The Reception Desk

Powered by Calvin EMR`,
    };
    const mailgunUrl = `${process.env.BACKEND_URL}/api/mailgun`;
    await axios.post(mailgunUrl, emailToPost);
    handleResponse(response, res);
  } catch (err) {
    handleError(err as AxiosError, res);
  }
};
