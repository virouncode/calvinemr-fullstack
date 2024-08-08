import axios from "axios";
import { AxiosXanoConfigType } from "../../types/app";

axios.defaults.withCredentials = true;

const xanoPostReset = async (
  URL: string,
  userType: string,
  tempToken: string,
  data: object,
  abortController?: AbortController
) => {
  const config: AxiosXanoConfigType = {
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
