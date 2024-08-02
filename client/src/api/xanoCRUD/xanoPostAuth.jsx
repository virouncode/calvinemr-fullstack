import axios from "axios";
axios.defaults.withCredentials = true;

const xanoPostAuth = async (URL, userType, data) => {
  const config = {
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
