import axios from "axios";

axios.defaults.withCredentials = true;

const xanoPut = async (URL, userType, data, abortController = null) => {
  const config = {
    url: `/api/xano`,
    method: "put",
    params: {
      //query parameters !!! Not route parameters
      URL,
      userType,
    },
    data,
  };
  if (abortController) config.signal = abortController.signal;
  const response = await axios(config);
  return response.data;
};

export default xanoPut;
