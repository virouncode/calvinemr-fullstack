import axios from "axios";
axios.defaults.withCredentials = true;

const xanoDelete = async (URL, userType, abortController = null) => {
  const config = {
    url: `/api/xano`,
    method: "delete",
    params: {
      //query parameters !!! Not route parameters
      URL,
      userType,
    },
  };
  if (abortController) config.signal = abortController.signal;
  const response = await axios(config);
  return response.data;
};

export default xanoDelete;
