import axios from "axios";
axios.defaults.withCredentials = true;

const xanoGet = async (
  URL, //URL to xano endpoint
  userType,
  queryParams = null,
  abortController = null
) => {
  const config = {
    url: `/api/xano`,
    method: "get",
    //query parameters !!! Not route parameters
    params: {
      URL,
      userType,
    },
  };
  if (abortController) config.signal = abortController.signal;
  if (queryParams) config.params.queryParams = queryParams;
  const response = await axios(config);
  return response.data;
};

export default xanoGet;
