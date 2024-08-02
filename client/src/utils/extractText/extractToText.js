import axios from "axios";
axios.defaults.withCredentials = true;

export const extractToText = async (docUrl, mime) => {
  try {
    const response = await axios.post(`/api/extractToText`, {
      docUrl,
      mime,
    });
    return response.data;
  } catch (err) {
    throw err;
  }
};
