import axios from "axios";
import { AxiosXanoConfigType } from "../../types/app";
axios.defaults.withCredentials = true;

const xanoPut = async (
  URL: string,
  userType: string,
  data: Record<string, unknown>,
  abortController?: AbortController
) => {
  const config: AxiosXanoConfigType = {
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
