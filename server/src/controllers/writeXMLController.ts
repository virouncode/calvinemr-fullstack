import axios from "axios";
import downloadsFolder from "downloads-folder";
import { Request, Response } from "express";
import fs from "fs";
import fsPromises from "fs/promises";
import { DateTime } from "luxon";
import path from "path";
axios.defaults.withCredentials = true;

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

export const postWriteXML = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      xmlFinal,
      patientFirstName,
      patientLastName,
      patientId,
      patientDob,
      doctorFirstName,
      doctorLastName,
      doctorOHIP,
      authorName,
      dateOfExport,
      reportsFiles,
    } = req.body;

    // Names
    const exportFolderName = `CalvinEMR_Export_${dateOfExport}`;
    const folderName = `${doctorFirstName}_${doctorLastName}_${doctorOHIP}`;
    const fileName = `${patientFirstName}_${patientLastName}_${patientId}_${patientDob}.xml`;
    const reportsFilesFolderName = "Reports_files";

    // Paths
    const downloadsPath = downloadsFolder();
    const exportFolderPath = path.join(downloadsPath, exportFolderName);
    const folderPath = path.join(downloadsPath, exportFolderName, folderName);
    const filePath = path.join(folderPath, fileName);
    const reportsFilesPath = path.join(folderPath, reportsFilesFolderName);

    // Create folders with detailed logging
    await fsPromises
      .mkdir(exportFolderPath, { recursive: true })
      .catch((error) => {
        throw new Error(
          `Failed to create export folder: ${handleError(error)}`
        );
      });
    await fsPromises.mkdir(folderPath, { recursive: true }).catch((error) => {
      throw new Error(`Failed to create main folder: ${handleError(error)}`);
    });
    await fsPromises
      .mkdir(reportsFilesPath, { recursive: true })
      .catch((error) => {
        throw new Error(
          `Failed to create reports folder: ${handleError(error)}`
        );
      });

    // Create ReadMe text
    const currentDateTime = DateTime.local({
      zone: "America/Toronto",
      locale: "en-CA",
    });
    const formattedDateTime = currentDateTime.toLocaleString({
      month: "long",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short",
    });

    const readMeContent = `This EMR export from CalvinEMR software was performed by ${authorName} on ${formattedDateTime}.
The XML file follows the OntarioMD EMR Specification for EMR Data Migration. For more details, visit: https://www.ontariomd.ca/emr-certification/library/specifications`;

    const readMePath = path.join(folderPath, "README.md");

    // Write XML and README files asynchronously
    await fsPromises.writeFile(filePath, xmlFinal);
    console.log("XML file saved successfully in Downloads folder.");
    await fsPromises.writeFile(readMePath, readMeContent);
    console.log("README file saved successfully in Downloads folder.");

    // Download report files concurrently
    const downloadPromises = reportsFiles.map(
      async (reportFile: { url: string; name: string }) => {
        const url = reportFile.url;
        const destinationPath = path.join(reportsFilesPath, reportFile.name);
        try {
          const response = await axios.get(url, { responseType: "stream" });
          const fileStream = fs.createWriteStream(destinationPath);
          response.data.pipe(fileStream);

          await new Promise((resolve, reject) => {
            fileStream.on("finish", resolve);
            fileStream.on("error", reject);
          });
          console.log(`File ${reportFile.name} downloaded successfully.`);
        } catch (error) {
          console.error(
            `Error downloading file ${reportFile.name}: ${handleError(error)}`
          );
        }
      }
    );

    await Promise.all(downloadPromises);
    res.status(200).json({ success: true });
  } catch (err) {
    const errorMessage = handleError(err);
    console.error(errorMessage);
    res.status(500).json({ success: false, message: errorMessage });
  }
};
