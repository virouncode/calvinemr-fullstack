import axios from "axios";
import dotenv from "dotenv";
import { Request, Response } from "express";
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
type MessageAttachmentType = {
  id: number | string;
  file: AttachmentType | null;
  alias: string;
  date_created: number;
  created_by_user_type: "staff" | "patient";
  created_by_id: number;
};

// Helper function to download and encode the file to base64
const downloadAndEncodeFile = async (url: string): Promise<string> => {
  try {
    const response = await axios.get(url, { responseType: "arraybuffer" });
    return Buffer.from(response.data).toString("base64");
  } catch (error) {
    throw new Error(`Error downloading file: ${handleError(error)}`);
  }
};

// Error handling function to handle different types of errors
const handleError = (err: unknown): string => {
  if (err instanceof Error) {
    return err.message;
  } else if (typeof err === "string") {
    return err;
  } else {
    return "An unknown error occurred";
  }
};

// Post a fax
export const postFax = async (req: Request, res: Response): Promise<void> => {
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

    const data: {
      action: string;
      access_id: string;
      access_pwd: string;
      sCallerID: string;
      sSenderEmail: string;
      sFaxType: string;
      sCPFromName: string;
      sCPToName: string;
      sCPOrganization: string;
      sCoverPage: string;
      sCPSubject: string;
      sCPComments: string;
      [key: string]: string;
    } = {
      action: "Queue_Fax",
      access_id: process.env.SRFAX_ACCESS_ID!,
      access_pwd: process.env.SRFAX_ACCESS_PWD!,
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

    // Process attachments if they exist
    if (attachments && attachments.length > 0) {
      await Promise.all(
        attachments.map(
          async (
            attachment: { fileName: string; fileURL: string },
            index: number
          ) => {
            const encodedFileContent = await downloadAndEncodeFile(
              attachment.fileURL
            );
            data[`sFileName_${index + 1}`] = attachment.fileName;
            data[`sFileContent_${index + 1}`] = encodedFileContent;
          }
        )
      );
    }

    // Send faxes to each number
    await Promise.all(
      faxNumbers.map(async (faxNumber: string) => {
        const faxToPost = { ...data, sToFaxNumber: `1${faxNumber}` }; // Fix fax number formatting

        const response = await axios.post(
          "https://secure.srfax.com/SRF_SecWebSvc.php",
          faxToPost,
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        if (response.data.Status === "Failed") {
          throw new Error(response.data.Result);
        }
      })
    );

    res
      .status(200)
      .json({ success: true, data: { message: "Fax successfully sent" } });
  } catch (err) {
    const errorMessage = handleError(err);
    console.error(errorMessage);
    res.status(500).json({ success: false, message: errorMessage }); // Changed to 500 for server errors
  }
};

// Get faxes from inbox
export const getFaxesInbox = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { viewedStatus, all, start, end } = req.body;

    const data: Record<string, any> = {
      action: "Get_Fax_Inbox",
      access_id: process.env.SRFAX_ACCESS_ID!,
      access_pwd: process.env.SRFAX_ACCESS_PWD!,
      sPeriod: all ? "ALL" : "RANGE",
      sViewedStatus: viewedStatus,
    };

    if (!all) {
      data.sStartDate = start;
      data.sEndDate = end;
    }

    const response = await axios.post(
      "https://secure.srfax.com/SRF_SecWebSvc.php",
      data,
      { headers: { "Content-Type": "application/json" } }
    );

    res.status(200).json(response.data.Result);
  } catch (err) {
    const errorMessage = handleError(err);
    console.error(errorMessage);
    res.status(400).json({ success: false, message: errorMessage });
  }
};

// Get faxes from outbox
export const getFaxesOutbox = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { all, start, end } = req.body;

    const data: Record<string, any> = {
      action: "Get_Fax_Outbox",
      access_id: process.env.SRFAX_ACCESS_ID!,
      access_pwd: process.env.SRFAX_ACCESS_PWD!,
      sPeriod: all ? "ALL" : "RANGE",
    };

    if (!all) {
      data.sStartDate = start;
      data.sEndDate = end;
    }

    const response = await axios.post(
      "https://secure.srfax.com/SRF_SecWebSvc.php",
      data,
      { headers: { "Content-Type": "application/json" } }
    );

    res.status(200).json(response.data.Result);
  } catch (err) {
    const errorMessage = handleError(err);
    console.error(errorMessage);
    res.status(400).json({ success: false, message: errorMessage });
  }
};

// Get a specific fax file
export const getFaxFile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id, direction } = req.body;

    const data = {
      action: "Retrieve_Fax",
      access_id: process.env.SRFAX_ACCESS_ID!,
      access_pwd: process.env.SRFAX_ACCESS_PWD!,
      sFaxFileName: id,
      sDirection: direction,
      sFaxFormat: "PDF",
      sMarkasViewed: "Y",
    };

    const response = await axios.post(
      "https://secure.srfax.com/SRF_SecWebSvc.php",
      data,
      { headers: { "Content-Type": "application/json" } }
    );

    if (response.data.Status === "Success") {
      res.status(200).json(response.data.Result);
    } else {
      res.status(400).json(response.data.Result);
    }
  } catch (err) {
    const errorMessage = handleError(err);
    console.error(errorMessage);
    res.status(400).json({ success: false, message: errorMessage });
  }
};

// Delete a fax
export const deleteFax = async (req: Request, res: Response): Promise<void> => {
  try {
    const { faxFileName, direction } = req.body;

    const data = {
      action: "Delete_Fax",
      access_id: process.env.SRFAX_ACCESS_ID!,
      access_pwd: process.env.SRFAX_ACCESS_PWD!,
      sFaxFileName: faxFileName,
      sDirection: direction,
    };

    const response = await axios.post(
      "https://secure.srfax.com/SRF_SecWebSvc.php",
      data,
      { headers: { "Content-Type": "application/json" } }
    );

    if (response.data.Status === "Success") {
      res.status(200).json(response.data.Result);
    } else {
      res.status(400).json(response.data.Result);
    }
  } catch (err) {
    const errorMessage = handleError(err);
    console.error(errorMessage);
    res.status(400).json({ success: false, message: errorMessage });
  }
};

// Delete multiple faxes
export const deleteFaxes = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      faxFileNames,
      direction,
    }: {
      faxFileNames: string[];
      direction: string;
    } = req.body;

    const data: Record<string, any> = {
      action: "Delete_Fax",
      access_id: process.env.SRFAX_ACCESS_ID!,
      access_pwd: process.env.SRFAX_ACCESS_PWD!,
      sDirection: direction,
    };

    faxFileNames.forEach((faxFileName, i) => {
      data[`sFaxFileName_${i + 1}`] = faxFileName;
    });

    const response = await axios.post(
      "https://secure.srfax.com/SRF_SecWebSvc.php",
      data,
      { headers: { "Content-Type": "application/json" } }
    );

    if (response.data.Status === "Success") {
      res.status(200).json(response.data.Result);
    } else {
      res.status(400).json(response.data.Result);
    }
  } catch (err) {
    const errorMessage = handleError(err);
    console.error(errorMessage);
    res.status(400).json({ success: false, message: errorMessage });
  }
};
