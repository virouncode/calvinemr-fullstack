var axios = require("axios");

const downloadAndEncodeFile = async (url) => {
  try {
    const response = await axios.get(url, { responseType: "arraybuffer" });
    return Buffer.from(response.data).toString("base64");
  } catch (error) {
    throw new Error(`Error downloading file: ${error.message}`);
  }
};

const postFax = async (req, res) => {
  try {
    const {
      sToFaxNumber,
      sCPFromName,
      sCPToName,
      sCPOrganization,
      sCPSubject,
      sCPComments,
      sFileName_1,
      fileURL,
    } = req.body;
    const encodedFileContent = await downloadAndEncodeFile(fileURL);
    const data = {
      action: "Queue_Fax",
      access_id: process.env.SRFAX_ACCESS_ID,
      access_pwd: process.env.SRFAX_ACCESS_PWD,
      sCallerID: process.env.SRFAX_CALLER_ID,
      sSenderEmail: "calvinemrtest@gmail.com",
      sFaxType: "SINGLE",
      sToFaxNumber,
      sCPFromName,
      sCPToName,
      sCPOrganization,
      sCoverPage: "Basic",
      sCPSubject,
      sCPComments,
      sFileName_1,
      sFileContent_1: encodedFileContent,
    };
    const response = await axios.post(
      "https://secure.srfax.com/SRF_SecWebSvc.php",
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.data.Status === "Failed") {
      throw new Error(response.data.Result);
    }
    res
      .status(200)
      .send(JSON.stringify({ success: true, data: response.data }));
  } catch (err) {
    console.error(err);
    res
      .status(400)
      .send(JSON.stringify({ success: false, message: err.message }));
  }
};

const getFaxesInbox = async (req, res) => {
  try {
    const { viewedStatus, all, start, end } = req.body;
    const data = {
      action: "Get_Fax_Inbox",
      access_id: process.env.SRFAX_ACCESS_ID,
      access_pwd: process.env.SRFAX_ACCESS_PWD,
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
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    res.status(200).send(response.data.Result);
  } catch (err) {
    console.error(err);
    res
      .status(400)
      .send(JSON.stringify({ success: false, message: err.message }));
  }
};

const getFaxesOutbox = async (req, res) => {
  try {
    const { all, start, end } = req.body;
    const data = {
      action: "Get_Fax_Outbox",
      access_id: process.env.SRFAX_ACCESS_ID,
      access_pwd: process.env.SRFAX_ACCESS_PWD,
      sPeriod: all ? "ALL" : "RANGE",
    };
    if (!all) {
      data.sStartDate = start;
      data.sEndDate = end;
    }
    const response = await axios.post(
      "https://secure.srfax.com/SRF_SecWebSvc.php",
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    res.status(200).send(response.data.Result);
  } catch (err) {
    console.error(err);
    res
      .status(400)
      .send(JSON.stringify({ success: false, message: err.message }));
  }
};

const getFaxFile = async (req, res) => {
  try {
    const { id, direction } = req.body;
    const data = {
      action: "Retrieve_Fax",
      access_id: process.env.SRFAX_ACCESS_ID,
      access_pwd: process.env.SRFAX_ACCESS_PWD,
      sFaxFileName: id,
      sDirection: direction,
      sFaxFormat: "PDF",
      sMarkasViewed: "Y",
    };
    const response = await axios.post(
      "https://secure.srfax.com/SRF_SecWebSvc.php",
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.data.Status === "Success") {
      res.status(200).send(response.data.Result);
    } else {
      res.status(400).send(response.data.Result);
    }
  } catch (err) {
    console.error(err);
    res
      .status(400)
      .send(JSON.stringify({ success: false, message: err.message }));
  }
};

const deleteFax = async (req, res) => {
  try {
    const { faxFileName, direction } = req.body;
    const data = {
      action: "Delete_Fax",
      access_id: process.env.SRFAX_ACCESS_ID,
      access_pwd: process.env.SRFAX_ACCESS_PWD,
      sFaxFileName: faxFileName,
      sDirection: direction,
    };
    const response = await axios.post(
      "https://secure.srfax.com/SRF_SecWebSvc.php",
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.data.Status === "Success") {
      res.status(200).send(response.data.Result);
    } else {
      res.status(400).send(response.data.Result);
    }
  } catch (err) {
    console.error(err);
    res
      .status(400)
      .send(JSON.stringify({ success: false, message: err.message }));
  }
};

const deleteFaxes = async (req, res) => {
  try {
    const { faxFileNames, direction } = req.body;
    const data = {
      action: "Delete_Fax",
      access_id: process.env.SRFAX_ACCESS_ID,
      access_pwd: process.env.SRFAX_ACCESS_PWD,
      sDirection: direction,
    };
    for (let i = 0; i < faxFileNames.length; i++) {
      data[`sFaxFileName_${i + 1}`] = faxFileNames[i];
    }
    const response = await axios.post(
      "https://secure.srfax.com/SRF_SecWebSvc.php",
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.data.Status === "Success") {
      res.status(200).send(response.data.Result);
    } else {
      res.status(400).send(response.data.Result);
    }
  } catch (err) {
    console.error(err);
    res
      .status(400)
      .send(JSON.stringify({ success: false, message: err.message }));
  }
};

module.exports = {
  postFax,
  getFaxesInbox,
  getFaxesOutbox,
  getFaxFile,
  deleteFax,
  deleteFaxes,
};
