import axios from "axios";
axios.defaults.withCredentials = true;

export type UserType = "patient" | "staff" | "admin" | "reset";

export const xanoPost = (
  path: string,
  userType: UserType,
  data: Record<string, unknown>,
  abortController?: AbortController
) => {
  const config: RequestInit = {
    method: "POST",
    body: JSON.stringify(data),
    signal: abortController?.signal,
  };
  return fetch(`/api/xano${path}?userType=${userType}`, config);
};

// export const xanoPost = async (
//   URL: string,
//   userType: string,
//   data: Record<string, unknown>,
//   abortController?: AbortController
// ) => {
//   const config: AxiosXanoConfigType = {
//     url: `/api/xano`,
//     method: "post",
//     data,
//     params: {
//       //query parameters !!! Not route parameters
//       URL,
//       userType,
//     },
//   };
//   if (abortController) config.signal = abortController.signal;
//   const response = await axios(config);
//   return response.data;
// };

export const xanoPostBatch = async (
  URL: string,
  userType: string,
  datas: Record<string, unknown>[]
) => {
  const responses = await Promise.all(
    datas.map((data) =>
      axios({
        url: `/api/xano`,
        method: "post",
        data,
        params: {
          //query parameters !!! Not route parameters
          URL,
          userType,
        },
      })
    )
  );
  return responses.map((response) => response.data);
};
