import { AxiosError, AxiosResponse } from "axios";
import { Response } from "express";
import { ZodError } from "zod";
import { ApiResponse } from "../types/api";

export const handleSuccess = <T>({
  axiosResponse,
  message = "Request successful",
  res,
}: {
  axiosResponse: AxiosResponse<T>;
  message?: string;
  res: Response;
}) => {
  const response: ApiResponse<T> = {
    success: true,
    data: axiosResponse.data,
    message,
  };
  return res.status(axiosResponse.status).json(response);
};

export const handleError = ({
  err,
  message = "Request failed",
  res,
}: {
  err: unknown;
  message?: string;
  res: Response;
}) => {
  console.log(err);
  // Zod validation errors → 400
  if (err instanceof ZodError) {
    const response: ApiResponse<never> = {
      success: false,
      message: "Validation failed",
      errors: err.flatten().fieldErrors,
    };
    return res.status(400).json(response);
  }

  // Axios errors
  if (err instanceof AxiosError) {
    const status = err.response?.status ?? 500;
    const response: ApiResponse<unknown> = {
      success: false,
      message:
        (err.response?.data as any)?.message ||
        err.response?.statusText ||
        err.message ||
        message,
    };
    return res.status(status).json(response);
  }

  const response: ApiResponse<never> = {
    success: false,
    message: (err as Error)?.message || message,
  };
  return res.status(500).json(response);
};

module.exports = { handleSuccess, handleError };
