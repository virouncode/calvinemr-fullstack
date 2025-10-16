import axios from "axios";
import dotenv from "dotenv";
import { Request, Response } from "express";
import { downloadAndEncodeFile } from "../utils/downloadAndEncodeFile";
import { fetchWithTimeout } from "../utils/fetchWithTimeout";
import { handleError, handleSuccess } from "../utils/helper";
dotenv.config();
axios.defaults.withCredentials = true;

type AttachmentType = {
  access: string;
  path: string;
  name: string;
  type: string;
  size: number;
  mime: string;
  meta: {
    width: number;
    height: number;
  };
  url: string;
};

const SRFAX_URL = "https://secure.srfax.com/SRF_SecWebSvc.php";
const DEFAULT_HEADERS = { "Content-Type": "application/json" };

const buildAuthData = () => ({
  access_id: process.env.SRFAX_ACCESS_ID!,
  access_pwd: process.env.SRFAX_ACCESS_PWD!,
});

const srfaxRequest = async <T>(
  payload: Record<string, any>
): Promise<{ result: T; status: number }> => {
  const config: RequestInit = {
    method: "POST",
    headers: DEFAULT_HEADERS,
    body: JSON.stringify(payload),
  };

  const response = await fetchWithTimeout(SRFAX_URL, config, 15000);
  const status = response.status;
  const result = await response.json();

  if (result.Status === "Failed") {
    throw new Error(result.Result || "SRFax API error");
  }

  return { result: result.Result as T, status };
};

// ------------------------------
// 📤 Send Fax
// ------------------------------

export const postFax = async (req: Request, res: Response) => {
  try {
    const {
      faxNumbers,
      sCPFromName,
      sCPToName,
      sCPOrganization,
      sCPSubject,
      sCPComments,
      attachments,
    } = req.body;

    const baseData: Record<string, any> = {
      ...buildAuthData(),
      action: "Queue_Fax",
      sCallerID: process.env.SRFAX_CALLER_ID!,
      sSenderEmail: "calvinemrtest@gmail.com",
      sFaxType: "SINGLE",
      sCPFromName,
      sCPToName,
      sCPOrganization,
      sCoverPage: "Basic",
      sCPSubject,
      sCPComments,
    };

    // Process attachments
    if (attachments?.length > 0) {
      await Promise.all(
        attachments.map(
          async (att: { fileName: string; fileURL: string }, i: number) => {
            const encoded = await downloadAndEncodeFile(att.fileURL);
            baseData[`sFileName_${i + 1}`] = att.fileName;
            baseData[`sFileContent_${i + 1}`] = encoded;
          }
        )
      );
    }

    // Send fax to each number
    await Promise.all(
      faxNumbers.map(async (faxNumber: string) => {
        const faxToPost = { ...baseData, sToFaxNumber: `1${faxNumber}` };
        await srfaxRequest(faxToPost);
      })
    );

    return handleSuccess({
      result: { message: "Fax successfully sent" },
      status: 200,
      res,
    });
  } catch (err) {
    return handleError({ err, res });
  }
};

// ------------------------------
// 📥 Get Faxes (Inbox / Outbox)
// ------------------------------

const getFaxList = async (
  action: "Get_Fax_Inbox" | "Get_Fax_Outbox",
  req: Request,
  res: Response
) => {
  try {
    const { viewedStatus, all, start, end } = req.body;

    const payload: Record<string, any> = {
      ...buildAuthData(),
      action,
      sPeriod: all ? "ALL" : "RANGE",
    };

    if (action === "Get_Fax_Inbox") {
      payload.sViewedStatus = viewedStatus ?? "ALL";
    }
    if (!all) {
      payload.sStartDate = start;
      payload.sEndDate = end;
    }

    const { result, status } = await srfaxRequest(payload);
    return handleSuccess({ result, status, res });
  } catch (err) {
    return handleError({ err, res });
  }
};

export const getFaxesInbox = (req: Request, res: Response) =>
  getFaxList("Get_Fax_Inbox", req, res);

export const getFaxesOutbox = (req: Request, res: Response) =>
  getFaxList("Get_Fax_Outbox", req, res);

// ------------------------------
// 📄 Retrieve / Delete Fax
// ------------------------------

export const getFaxFile = async (req: Request, res: Response) => {
  try {
    const { id, direction } = req.body;
    const payload = {
      ...buildAuthData(),
      action: "Retrieve_Fax",
      sFaxFileName: id,
      sDirection: direction,
      sFaxFormat: "PDF",
      sMarkasViewed: "Y",
    };

    const { result, status } = await srfaxRequest(payload);
    return handleSuccess({ result, status, res });
  } catch (err) {
    return handleError({ err, res });
  }
};

export const deleteFax = async (req: Request, res: Response) => {
  try {
    const { faxFileName, direction } = req.body;
    const payload = {
      ...buildAuthData(),
      action: "Delete_Fax",
      sFaxFileName: faxFileName,
      sDirection: direction,
    };

    const { result, status } = await srfaxRequest(payload);
    return handleSuccess({ result, status, res });
  } catch (err) {
    return handleError({ err, res });
  }
};

export const deleteFaxes = async (req: Request, res: Response) => {
  try {
    const { faxFileNames, direction } = req.body;

    const payload: Record<string, any> = {
      ...buildAuthData(),
      action: "Delete_Fax",
      sDirection: direction,
    };

    faxFileNames.forEach((name: string, i: number) => {
      payload[`sFaxFileName_${i + 1}`] = name;
    });

    const { result, status } = await srfaxRequest(payload);
    return handleSuccess({ result, status, res });
  } catch (err) {
    return handleError({ err, res });
  }
};

// ------------------------------
// 👁️ Mark Fax as Viewed
// ------------------------------

export const markFaxesAs = async (req: Request, res: Response) => {
  try {
    const { fileNames, viewedStatus } = req.body;

    await Promise.all(
      fileNames.map(async (faxFileName: string) => {
        const payload = {
          ...buildAuthData(),
          action: "Update_Viewed_Status",
          sFaxFileName: faxFileName,
          sDirection: "IN",
          sMarkasViewed: viewedStatus,
        };
        await srfaxRequest(payload);
      })
    );

    return handleSuccess({
      result: { message: "Viewed status updated successfully" },
      status: 200,
      res,
    });
  } catch (err) {
    return handleError({ err, res });
  }
};
