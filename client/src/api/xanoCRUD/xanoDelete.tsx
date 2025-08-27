import axios from "axios";
import { AxiosXanoConfigType } from "../../types/app";
axios.defaults.withCredentials = true;

export const xanoDelete = async (
  URL: string,
  userType: string,
  data?: Record<string, unknown>,
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
  if (data) config.data = data;
  const response = await axios(config);
  return response.data;
};

export const xanoDeleteBatchSuccessfulRequests = async (
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
          URL: `${request.endpoint}/${request.id}`,
          userType,
        },
      })
    )
  );
  return responses.map((response) => response.data);
};

export const xanoDeleteBatch = async (
  URL: string,
  userType: string,
  idsToDelete: number[]
) => {
  const responses = await Promise.all(
    idsToDelete.map((id) =>
      axios({
        url: `/api/xano`,
        method: "delete",
        params: {
          //query parameters !!! Not route parameters
          URL: `${URL}/${id}`,
          userType,
        },
      })
    )
  );
  return responses.map((response) => response.data);
};
