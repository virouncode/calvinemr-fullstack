import axios from "axios";
axios.defaults.withCredentials = true;

const xanoPost = async (URL, userType, data, abortController = null) => {
  const config = {
    url: `/api/xano`,
    method: "post",
    data,
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

export default xanoPost;
