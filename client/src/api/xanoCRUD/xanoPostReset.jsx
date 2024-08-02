import axios from "axios";

axios.defaults.withCredentials = true;

const xanoPostReset = async (
  URL,
  userType,
  tempToken,
  data,
  abortController = null
) => {
  const config = {
    url: `/api/xano/reset`,
    method: "post",
    data,
    params: {
      //query parameters !!! Not route parameters
      URL,
      userType,
      tempToken,
    },
  };
  if (abortController) config.signal = abortController.signal;
  const response = await axios(config);
  return response.data;
};

export default xanoPostReset;
