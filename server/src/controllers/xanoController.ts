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
import { xanoQuerySchema } from "@shared/zod-schemas/xanoSchema";
import dotenv from "dotenv";
import { Request, Response } from "express";
import { jwtDecode } from "jwt-decode";
import { fetchWithTimeout } from "../utils/fetchWithTimeout";
import { generatePassword } from "../utils/generatePassword";
import { generatePIN } from "../utils/generatePIN";
import { handleError, handleSuccess } from "../utils/helper";
import {
  toPatientFirstName,
  toPatientLastName,
  toPatientName,
} from "../utils/toPatientName";

dotenv.config();

type UserType = "admin" | "staff" | "patient" | "reset";

export const getBaseUrl = (userType: UserType) => {
  switch (userType) {
    case "admin":
      return process.env.XANO_ADMIN_API_URL;
    case "staff":
      return process.env.XANO_STAFF_API_URL;
    case "patient":
      return process.env.XANO_PATIENT_API_URL;
    case "reset":
      return process.env.XANO_RESET_API_URL;
    default:
      throw new Error(`Invalid user type: ${userType}`);
  }
};

// GET request handler for Xano API
export const getXano = async (req: Request, res: Response) => {
  try {
    const { result, status } = await callXano(req, "GET");
    return handleSuccess({ result, status, res });
  } catch (err) {
    return handleError({ err, res });
  }
};
export const postXano = async (req: Request, res: Response) => {
  try {
    const { result, status } = await callXano(req, "POST", req.body);
    return handleSuccess({ result, status, res });
  } catch (err) {
    return handleError({ err, res });
  }
};

export const putXano = async (req: Request, res: Response) => {
  try {
    const { result, status } = await callXano(req, "PUT", req.body);
    return handleSuccess({ result, status, res });
  } catch (err) {
    return handleError({ err, res });
  }
};

export const deleteXano = async (req: Request, res: Response) => {
  try {
    const { result, status } = await callXano(req, "DELETE", req.body);
    return handleSuccess({ result, status, res });
  } catch (err) {
    return handleError({ err, res });
  }
};

// POST request handler for authentication
export const authXano = async (req: Request, res: Response) => {
  try {
    const { userType } = authQuerySchema.parse(req.query);
    const body = authSchema.parse(req.body);

    // Appel via ton helper générique
    const { result, status } = await callXano(req, "POST", body);

    // Vérifications spécifiques à l'auth
    if (typeof result.authToken !== "string") {
      throw new Error("Invalid response from Xano: missing authToken");
    }

    // (facultatif) Log ou vérification JWT
    const decoded = jwtDecode(result.authToken);
    console.log("Decoded JWT:", decoded);

    // Configuration du cookie sécurisé
    res.cookie("token", result.authToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return handleSuccess({
      result,
      status,
      message: "Login successfully",
      res,
    });
  } catch (err) {
    res.clearCookie("token");
    return handleError({ err, res });
  }
};

// POST request handler for password reset
export const resetXano = async (req: Request, res: Response) => {
  try {
    const { userType, tempToken } = resetPasswordQuerySchema.parse(req.query);
    const body = resetPasswordSchema.parse(req.body);

    const { result, status } = await callXano(req, "POST", body);

    return handleSuccess({
      result,
      status,
      res,
      message: "Password reset successfully",
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

    const { result, status } = await callXano(req, "POST", datasToPost);

    const emailToPost = {
      to: datasToPost.email,
      subject: `Welcome to ${clinicName} - DO NOT REPLY`,
      text: `Dear ${datasToPost.full_name},

Welcome to ${clinicName}!

Here is your access to the Staff Portal: 

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

    let mailSent = false;
    try {
      const mailResponse = await fetchWithTimeout(mailgunUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(emailToPost),
      });

      if (!mailResponse.ok) {
        const errMsg = await mailResponse.text();
        console.error("Mailgun error:", errMsg);
        throw new Error(errMsg);
      }

      mailSent = true;
    } catch (mailErr) {
      console.error("Failed to send welcome email:", mailErr);
      // On ne throw PAS ici, on veut renvoyer un succès partiel
    }

    const message = mailSent
      ? "Staff created successfully and welcome email sent."
      : "Staff created successfully, but email could not be sent.";

    return handleSuccess({
      result,
      status,
      message,
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

    const { result, status } = await callXano(req, "POST", datasToPost);
    let mailSent = false;
    let message = "";

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

      try {
        const mailResponse = await fetchWithTimeout(mailgunUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(emailToPost),
        });

        if (!mailResponse.ok) {
          const errMsg = await mailResponse.text();
          console.error("Mailgun error:", errMsg);
          throw new Error(errMsg);
        }

        mailSent = true;
      } catch (mailErr) {
        console.error("Failed to send welcome email:", mailErr);
        // On ne throw PAS ici, on veut renvoyer un succès partiel
      }
      message = mailSent
        ? "Patient created successfully and welcome email sent."
        : "Patient created successfully, but email could not be sent. Please check the email address and try reseting the password from the admin dashboard.";
    } else {
      message =
        "Patient created successfully (no email provided). Please set email and send credentials from admin dashboard.";
    }

    return handleSuccess({
      result,
      status,
      message,
      res,
    });
  } catch (err) {
    return handleError({ err, res });
  }
};

// Request a temporary password for user
export const tempPassword = async (req: Request, res: Response) => {
  try {
    //THE USERTYPE SHOULD ALSO BE INCLUDED AS A ROUTE PARAMETER
    const { email, userType } = tempPasswordQuerySchema.parse(req.query);

    const { result, status } = await callXano(req, "GET");

    if (result.temp_login?.temp_password && result.email) {
      const emailToPost = {
        to: result.email,
        subject: `${process.env.CLINIC_NAME}: Temporary Password - DO NOT REPLY`,
        text: `Hello ${result.full_name || toPatientName(result.patient_infos)}

Please find your temporary password for your account: ${
          result.temp_login.temp_password
        }

This password will be active for 15 minutes, after this time, please make a new request.

Please do not reply to this email, as this address is automated and not monitored.

Regards,
The Reception Desk

Powered by Calvin EMR`,
      };
      const mailgunUrl = `${process.env.BACKEND_URL}/api/mailgun`;
      try {
        const mailResponse = await fetchWithTimeout(mailgunUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(emailToPost),
        });

        if (!mailResponse.ok) {
          const errMsg = await mailResponse.text();
          console.error("Mailgun error:", errMsg);
          throw new Error(errMsg);
        }
      } catch (err) {
        throw new Error(
          `Failed to send temporary password email: ${
            err instanceof Error ? err.message : " unknown error"
          }`
        );
      }
    } else {
      throw new Error("No email associated with this account");
    }

    return handleSuccess({
      result,
      status,
      message: "Temporary password sent to your email address",
      res,
    });
  } catch (err) {
    return handleError({ err, res });
  }
};

//Reset a staff member's password and pin from admin dashboard
//UserType should be in the queyry parameters
export const resetStaffPwd = async (req: Request, res: Response) => {
  try {
    const { staff_id, email, clinic_name, full_name } =
      resetStaffPwdFromAdminSchema.parse(req.body);
    const password = generatePassword();
    const pin = generatePIN();

    const { result, status } = await callXano(req, "PUT", {
      password,
      pin,
      staff_id,
    });

    let emailSent = false;
    let message = "";
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

    try {
      const mailResponse = await fetchWithTimeout(mailgunUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(emailToPost),
      });

      if (!mailResponse.ok) {
        const errMsg = await mailResponse.text();
        console.error("Mailgun error:", errMsg);
        throw new Error(errMsg);
      }
      emailSent = true;
    } catch (mailErr) {
      console.error("Failed to send email:", mailErr);
      // On ne throw PAS ici, on veut renvoyer un succès partiel
    }
    message = emailSent
      ? "Staff password reset successfully and email sent."
      : "Staff password reset successfully, but email could not be sent. Please check the email address and try reseting the password again.";

    return handleSuccess({
      result,
      status,
      message,
      res,
    });
  } catch (err) {
    return handleError({ err, res });
  }
};
//UserType should be in the query parameters
export const resetPatientPwd = async (req: Request, res: Response) => {
  try {
    const { patient_id, email, clinic_name, full_name } =
      resetPatientPwdFromAdminSchema.parse(req.body);
    const password = generatePassword();
    const pin = generatePIN();

    const { result, status } = await callXano(req, "PUT", {
      password,
      pin,
      patient_id,
    });

    let emailSent = false;
    let message = "";

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
    try {
      const mailResponse = await fetchWithTimeout(mailgunUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(emailToPost),
      });

      if (!mailResponse.ok) {
        const errMsg = await mailResponse.text();
        console.error("Mailgun error:", errMsg);
        throw new Error(errMsg);
      }
      emailSent = true;
    } catch (mailErr) {
      console.error("Failed to send email:", mailErr);
      // On ne throw PAS ici, on veut renvoyer un succès partiel
    }
    message = emailSent
      ? "Patient password reset successfully and email sent."
      : "Patient password reset successfully, but email could not be sent. Please check the email address and try reseting the password again.";

    return handleSuccess({
      result,
      status,
      message,
      res,
    });
  } catch (err) {
    handleError({ err, res });
  }
};

export async function callXano(
  req: Request,
  method: string,
  body?: any,
  opts?: { logAuth?: boolean }
) {
  const { userType } = xanoQuerySchema.parse(req.query);
  const authToken = req.cookies.token;

  const headers: Record<string, string> = {
    Authorization: `Bearer ${authToken}`,
  };

  if (!(body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const baseUrl = getBaseUrl(userType);
  if (!baseUrl) throw new Error(`Base URL not configured for ${userType}`);

  const queryParams = new URLSearchParams(
    Object.entries(req.query)
      .filter(([k]) => k !== "userType")
      .map(([k, v]) => [k, String(v)])
  ).toString();

  const path = req.path;
  let URL = path === "/" ? baseUrl : baseUrl + path;
  if (queryParams) URL += `?${queryParams}`;

  const config: RequestInit = {
    method,
    headers,
    credentials: "include",
  };
  if (body && method !== "GET") {
    config.body = body instanceof FormData ? body : JSON.stringify(body);
  }

  const response = await fetchWithTimeout(URL, config);

  const status = response.status;
  let result: any;
  try {
    result = await response.json();
  } catch {
    result = await response.text(); // si non-JSON
  }

  if (
    (opts?.logAuth || path === "/auth/me") &&
    process.env.NODE_ENV !== "development"
  ) {
    await fetchWithTimeout(`${baseUrl}/logs`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        user_id: result.id,
        user_type: userType,
        ip_address: req.ip,
        user_name:
          userType === "patient"
            ? `${toPatientFirstName(result.patient_infos)} ${toPatientLastName(
                result.patient_infos
              )}`
            : result.full_name,
      }),
    });
  }

  if (!response.ok) {
    throw new Error(`Xano API error: ${JSON.stringify(result)}`);
  }

  return { result, status };
}
