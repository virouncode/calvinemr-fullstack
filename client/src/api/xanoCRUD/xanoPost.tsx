import axios from "axios";
import { AxiosXanoConfigType } from "../../types/app";
axios.defaults.withCredentials = true;

const xanoPost = async (
  URL: string,
  userType: string,
  data: Record<string, unknown>,
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

export const xanoPostBatch = async (
  URL: string,
  userType: string,
  datas: Record<string, unknown>[]
) => {
  const responses = [];
  for (const data of datas) {
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
    const response = await axios(config);
    responses.push(response.data);
  }
  return responses;
};
