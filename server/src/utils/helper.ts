import { AxiosError } from "axios";
import { Response } from "express";

export const handleResponse = (response: any, res: Response) => {
  if (typeof response.data === "number") {
    res.status(response.status).send(response.data.toString());
  } else {
    res.status(response.status).send(response.data);
  }
};
export const handleError = (err: AxiosError, res: Response) => {
  console.error(err);
  console.log(err.response);
  if (err.response) {
    // If the error has a response (from the server)
    res.status(err.response.status).send(err.response.data);
  } else if (err.request) {
    // If the error has a request but no response (e.g., network issues)
    res
      .status(503)
      .send({ error: "Service Unavailable", message: err.message });
  } else {
    // General error
    res.status(500).send({
      error: "Internal Server Error",
      message: err.message,
    });
  }
};

module.exports = { handleResponse, handleError };
