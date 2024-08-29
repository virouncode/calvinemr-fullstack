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
  console.log("delete batch successfulRequests", successfulRequests);

  const responses = [];
  for (const { endpoint, id } of successfulRequests) {
    const config: AxiosXanoConfigType = {
      url: `/api/xano`,
      method: "delete",
      params: {
        //query parameters !!! Not route parameters
        URL: `${endpoint}${id}`,
        userType,
      },
    };
    const response = await axios(config);
    responses.push(response.data);
  }
  return responses;
};
