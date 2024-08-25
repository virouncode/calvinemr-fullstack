var fs = require("fs");
var fsPromises = require("fs").promises;
var path = require("path");
var os = require("os");
var { DateTime } = require("luxon");
var axios = require("axios");
const { log } = require("console");

const postWriteXML = async (req, res) => {
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

    //Names
    const exportFolderName = `CalvinEMR_Export_${dateOfExport}`;
    const folderName = `${doctorFirstName}_${doctorLastName}_${doctorOHIP}`;
    const fileName = `${patientFirstName}_${patientLastName}_${patientId}_${patientDob}.xml`;
    const reportsFilesFolderName = "Reports_files";

    //Paths
    const downloadsPath = path.join(os.homedir(), "Downloads");
    const exportFolderPath = path.join(downloadsPath, exportFolderName);
    const folderPath = path.join(downloadsPath, exportFolderName, folderName);
    const filePath = path.join(folderPath, fileName);
    const reportsFilesPath = path.join(folderPath, reportsFilesFolderName);

    //Create folders
    await fsPromises.mkdir(exportFolderPath, { recursive: true });
    await fsPromises.mkdir(folderPath, { recursive: true });
    await fsPromises.mkdir(reportsFilesPath, { recursive: true });

    //Create ReadMe text
    const currentDateTime = DateTime.local({ zone: "America/Toronto" });
    // Formater la date et l'heure dans le format désiré avec le fuseau horaire inclus
    const formattedDateTime = currentDateTime.toLocaleString({
      locale: "en-CA",
      month: "long",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short",
    });
    const readMeContent = `This EMR export from CalvinEMR software was performed by ${authorName} on ${formattedDateTime}.\nThe XML file follows as strictly as possible the standard of the OntarioMD EMR Specification for EMR Data Migration. For further information, please visit: https://www.ontariomd.ca/emr-certification/library/specifications`;

    const readMePath = path.join(folderPath, "README.md");

    //Write files asynchronously
    await fsPromises.writeFile(filePath, xmlFinal);
    console.log("XML file saved successfully in Downloads folder.");
    await fsPromises.writeFile(readMePath, readMeContent);
    console.log("README file saved successfully in Downloads folder.");

    // Download report files concurrently
    const downloadPromises = reportsFiles.map(async (reportFile) => {
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
        console.log("File downloaded successfully.");
      } catch (error) {
        console.error(`Error downloading file: ${error.message}`);
      }
    });

    await Promise.all(downloadPromises);

    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { postWriteXML };
