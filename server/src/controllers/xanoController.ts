import { authQuerySchema, authSchema } from "@shared/zod-schemas/authSchema";
import {
  insertPatientSchema,
  InsertPatientType,
} from "@shared/zod-schemas/patientSchema";
import {
  resetPasswordQuerySchema,
  resetPasswordSchema,
  resetPatientPwdFromAdminSchema,
  resetStaffPwdFromAdminSchema,
} from "@shared/zod-schemas/resetPasswordSchema";
import {
  insertStaffSchema,
  InsertStaffType,
} from "@shared/zod-schemas/staffSchema";
import { tempPasswordQuerySchema } from "@shared/zod-schemas/tempPasswordSchema";
import {
  unlockQuerySchema,
  unlockSchema,
} from "@shared/zod-schemas/unlockSchema";
import { xanoQuerySchema } from "@shared/zod-schemas/xanoSchema";
import axios from "axios";
import dotenv from "dotenv";
import { Request, Response } from "express";
import { jwtDecode } from "jwt-decode";
import { generatePassword } from "../utils/generatePassword";
import { generatePIN } from "../utils/generatePIN";
import { handleError, handleSuccess } from "../utils/helper";
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
const axiosMap = {
  admin: axiosXanoAdmin,
  staff: axiosXanoStaff,
  patient: axiosXanoPatient,
  reset: axiosXanoReset,
} as const;

type UserType = keyof typeof axiosMap; // "admin" | "staff" | "patient" | "reset"

export const getAxiosInstance = (userType: UserType) => {
  const instance = axiosMap[userType];
  if (!instance) throw new Error(`Invalid user type: ${userType}`);
  return instance;
};

// GET request handler for Xano API
export const getXano = async (req: Request, res: Response) => {
  try {
    const { URL, userType, queryParams } = xanoQuerySchema.parse(req.query);
    const authToken = req.cookies.token;

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    };
    const axiosXanoInstance = getAxiosInstance(userType);
    const axiosResponse = await axiosXanoInstance.get(URL, {
      headers,
      params: queryParams,
    });

    if (URL === "/auth/me" && process.env.NODE_ENV !== "development") {
      // Log user login activity
      await axiosXanoInstance.post(
        "/logs",
        {
          user_id: axiosResponse.data.id,
          user_type: userType,
          ip_address: req.ip,
          user_name:
            userType === "patient"
              ? toPatientFirstName(axiosResponse.data.patient_infos) +
                " " +
                toPatientMiddleName(axiosResponse.data.patient_infos) +
                " " +
                toPatientLastName(axiosResponse.data.patient_infos)
              : axiosResponse.data.full_name,
        },
        { headers }
      );
    }

    return handleSuccess({ axiosResponse, res });
  } catch (err) {
    return handleError({ err, res });
  }
};

// POST request handler for Xano API
export const postXano = async (req: Request, res: Response) => {
  try {
    const { URL, userType } = xanoQuerySchema.parse(req.query);
    const body = req.body;
    const authToken = req.cookies.token;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    };
    const axiosXanoInstance = getAxiosInstance(userType);
    const axiosResponse = await axiosXanoInstance.post(URL, body, { headers });
    return handleSuccess({ axiosResponse, res });
  } catch (err) {
    return handleError({ err, res });
  }
};

// PUT request handler for Xano API
export const putXano = async (req: Request, res: Response) => {
  try {
    const { URL, userType } = xanoQuerySchema.parse(req.query);
    const body = req.body;
    const authToken = req.cookies.token;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    };
    const axiosXanoInstance = getAxiosInstance(userType);
    const axiosResponse = await axiosXanoInstance.put(URL, body, { headers });
    return handleSuccess({ axiosResponse, res });
  } catch (err) {
    return handleError({ err, res });
  }
};

// DELETE request handler for Xano API
export const deleteXano = async (req: Request, res: Response) => {
  try {
    const { URL, userType } = xanoQuerySchema.parse(req.query);
    const authToken = req.cookies.token;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    };
    const data = req.body; // Optional data for DELETE request
    const axiosXanoInstance = getAxiosInstance(userType);
    const axiosResponse = await axiosXanoInstance.delete(URL, {
      headers,
      data,
    });
    return handleSuccess({ axiosResponse, res });
  } catch (err) {
    return handleError({ err, res });
  }
};

// POST request handler for authentication
export const authXano = async (req: Request, res: Response) => {
  try {
    const { URL, userType } = authQuerySchema.parse(req.query); // Validate query parameters
    const body = authSchema.parse(req.body); // Validate request body

    const headers = {
      "Content-Type": "application/json",
    };
    const axiosXanoInstance = getAxiosInstance(userType);
    const axiosResponse = await axiosXanoInstance.post(URL, body, { headers });

    if (typeof axiosResponse.data?.authToken !== "string") {
      throw new Error("Invalid response from Xano: missing authToken");
    }

    const decoded = jwtDecode(axiosResponse.data.authToken);

    console.log("Decoded JWT:", decoded);

    res.cookie("token", axiosResponse.data.authToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return handleSuccess({ axiosResponse, message: "Login successfully", res });
  } catch (err) {
    return handleError({ err, res });
  }
};

// POST request handler for password reset
export const resetXano = async (req: Request, res: Response) => {
  try {
    const { URL, userType, tempToken } = resetPasswordQuerySchema.parse(
      req.query
    );
    const body = resetPasswordSchema.parse(req.body);
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tempToken}`,
    };

    const axiosXanoInstance = getAxiosInstance(userType);
    const axiosResponse = await axiosXanoInstance.post(URL, body, { headers });
    return handleSuccess({
      axiosResponse,
      message: "Password reset successfully",
      res,
    });
  } catch (err) {
    handleError({
      err,
      res,
    });
  }
};

// POST request handler to create new staff
export const newStaff = async (req: Request, res: Response) => {
  try {
    const body = insertStaffSchema.parse(req.body);
    const { clinic_name: clinicName, ...rest } = body;

    const newPassword = generatePassword();
    const newPIN = generatePIN();

    const datasToPost: Omit<InsertStaffType, "clinic_name"> & {
      password: string;
      pin: string;
    } = {
      ...rest,
      password: newPassword,
      pin: newPIN,
    };
    const authToken = req.cookies.token;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    };
    const axiosXanoInstance = getAxiosInstance("admin");
    const axiosResponse = await axiosXanoInstance.post("/staff", datasToPost, {
      headers,
    });

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
    return handleSuccess({
      axiosResponse,
      message: "Staff created successfully",
      res,
    });
  } catch (err) {
    return handleError({ err, res });
  }
};

// POST request handler to create new patient
export const newPatient = async (req: Request, res: Response) => {
  try {
    const body = insertPatientSchema.parse(req.body);
    const {
      clinic_name: clinicName,
      first_name: firstName,
      middle_name: middleName,
      last_name: lastName,
      ...rest
    } = body;

    const newPassword = generatePassword();
    const newPIN = generatePIN();
    const datasToPost: Omit<
      InsertPatientType,
      "clinic_name" | "first_name" | "middle_name" | "last_name"
    > & {
      password: string;
      pin: string;
    } = {
      ...rest,
      password: newPassword,
      pin: newPIN,
    };

    const authToken = req.cookies.token;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    };
    const axiosXanoInstance = getAxiosInstance("staff");
    const axiosResponse = await axiosXanoInstance.post(
      "/patients",
      datasToPost,
      {
        headers,
      }
    );

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
      return handleSuccess({
        axiosResponse,
        message: "Patient created successfully",
        res,
      });
    }
  } catch (err) {
    return handleError({ err, res });
  }
};

// Request a temporary password for user
export const tempPassword = async (req: Request, res: Response) => {
  try {
    const { email, userType } = tempPasswordQuerySchema.parse(req.query);
    const headers = {
      "Content-Type": "application/json",
    };
    const axiosXanoInstance = getAxiosInstance("reset");
    const axiosResponse = await axiosXanoInstance.get(
      `/auth/${userType}/request_temp_password`,
      { headers, params: { email } }
    );
    if (
      !axiosResponse.data.temp_login.temp_password ||
      typeof axiosResponse.data.temp_login.temp_password !== "string"
    ) {
      throw new Error("Failed to generate temporary password");
    }

    const emailToPost = {
      to: axiosResponse.data.email,
      subject: `${process.env.CLINIC_NAME}: Temporary Password - DO NOT REPLY`,
      text: `Hello ${
        axiosResponse.data.full_name ||
        toPatientName(axiosResponse.data.patient_infos)
      }

Please find your temporary password for your account: ${
        axiosResponse.data.temp_login.temp_password
      }

This password will be active for 15 minutes, after this time, please make a new request.

Please do not reply to this email, as this address is automated and not monitored.

Regards,
The Reception Desk

Powered by Calvin EMR`,
    };
    const mailgunUrl = `${process.env.BACKEND_URL}/api/mailgun`;
    await axios.post(mailgunUrl, emailToPost);
    return handleSuccess({
      axiosResponse,
      message: "Temporary password sent to your email",
      res,
    });
  } catch (err) {
    return handleError({ err, res });
  }
};

// Unlock a user account
export const unlock = async (req: Request, res: Response): Promise<void> => {
  try {
    const body = unlockSchema.parse(req.body);
    const { userType } = unlockQuerySchema.parse(req.query);
    const authToken = req.cookies.token;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    };

    const axiosXanoInstance = getAxiosInstance(userType);
    const axiosResponse = await axiosXanoInstance.post("/unlock", body, {
      headers,
    });
    handleSuccess({ axiosResponse, res });
  } catch (err) {
    handleError({ err, res });
  }
};

//Reset passwords and pins from admin dashboard
export const resetStaffPwd = async (req: Request, res: Response) => {
  try {
    const { staff_id, email, clinic_name, full_name } =
      resetStaffPwdFromAdminSchema.parse(req.body);
    const password = generatePassword();
    const pin = generatePIN();

    const authToken = req.cookies.token;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    };
    const axiosXanoInstance = getAxiosInstance("admin");
    const response = await axiosXanoInstance.put(
      "/staff_password_pin",
      { password, pin, staff_id },
      { headers }
    );
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
    return handleSuccess({
      axiosResponse: response,
      res,
      message:
        "Staff password reset successfully, an email has been sent to the staff member",
    });
  } catch (err) {
    return handleError({ err, res });
  }
};

export const resetPatientPwd = async (req: Request, res: Response) => {
  try {
    const { patient_id, email, clinic_name, full_name } =
      resetPatientPwdFromAdminSchema.parse(req.body);

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
    const axiosResponse = await axiosXanoInstance.put(
      "/patient_password_pin",
      { password, pin, patient_id },
      { headers }
    );
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
    handleSuccess({
      axiosResponse,
      res,
      message:
        "Patient password reset successfully, an email has been sent to the patient",
    });
  } catch (err) {
    handleError({ err, res });
  }
};
