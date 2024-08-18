import axios from "axios";
import { AxiosXanoConfigType } from "../../types/app";
axios.defaults.withCredentials = true;

const xanoPostAuth = async (
  URL: string,
  userType: string,
  data: Record<string, unknown>
) => {
  const config: AxiosXanoConfigType = {
    url: `/api/xano/auth`,
    method: "post",
    data,
    params: {
      //query parameters !!! Not route parameters
      URL,
      userType,
    },
  };
  const response = await axios(config);
  return response.data;
};

export default xanoPostAuth;
