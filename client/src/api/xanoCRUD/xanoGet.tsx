import axios from "axios";
import { AxiosXanoConfigType } from "../../types/app";
axios.defaults.withCredentials = true;

const xanoGet = async (
  URL: string, //URL to xano endpoint
  userType: string, //staff, patient, admin
  queryParams?: object,
  abortController?: AbortController
) => {
  const config: AxiosXanoConfigType = {
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
