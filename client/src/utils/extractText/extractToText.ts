import axios from "axios";
axios.defaults.withCredentials = true;

export const extractToText = async (docUrl: string, mime: string) => {
  if (!docUrl || !mime) return [];
  const response = await axios.post(`/api/extractToText`, {
    docUrl,
    mime,
  });
  return response.data;
};
