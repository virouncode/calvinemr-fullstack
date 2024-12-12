import axios from "axios";
import { AxiosXanoConfigType } from "../../types/app";
axios.defaults.withCredentials = true;

export const xanoDelete = async (
  URL: string,
  userType: string,
  abortController?: AbortController
) => {
  const config: AxiosXanoConfigType = {
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

export const xanoDeleteBatch = async (
  successfulRequests: {
    endpoint: string;
    id: number;
  }[],
  userType: string
) => {
  const responses = await Promise.all(
    successfulRequests.map((request) =>
      axios({
        url: `/api/xano`,
        method: "delete",
        params: {
          //query parameters !!! Not route parameters
          URL: `${request.endpoint}${request.id}`,
          userType,
        },
      })
    )
  );
  responses.map((response) => response.data);
};
