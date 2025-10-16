import { fetchWithTimeout } from "./fetchWithTimeout";

export const downloadAndEncodeFile = async (url: string): Promise<string> => {
  const response = await fetchWithTimeout(url, { method: "GET" }, 10000);
  if (!response.ok) throw new Error(`Failed to download file from ${url}`);
  const buffer = await response.arrayBuffer();
  return Buffer.from(buffer).toString("base64");
};
