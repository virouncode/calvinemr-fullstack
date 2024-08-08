import axios from "axios";
import { AxiosXanoConfigType } from "../../types/app";
axios.defaults.withCredentials = true;

const xanoPost = async (
  URL: string,
  userType: string,
  data: object,
  abortController?: AbortController
) => {
  const config: AxiosXanoConfigType = {
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
