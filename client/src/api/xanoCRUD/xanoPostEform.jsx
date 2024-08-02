import axios from "axios";

axios.defaults.withCredentials = true;

const xanoPostEform = async (data) => {
  const config = {
    url: `/api/xano/eforms`,
    method: "post",
    data,
  };
  const response = await axios(config);
  return response.data;
};

export default xanoPostEform;
