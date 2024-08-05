
import { Response } from "express";

type responseType<T = any> = {
  res: Response;
  code?: number;
  status?: boolean;
  title?: string;
  error?: string;
  errors?: any;
  message?: string;
  data?: T;
};
export const response200 = ({
  res,
  status = true,
  message = "success",
  data = null,
  title = "",
  error = "",
}: responseType) => {
  return res.status(200).json({
    status,
    data,
    title,
    message,
    error,
  });
};

export const response404 = ({
  res,
  status = false,
  message = "404",
  data = null,
}: responseType) => {
  return res.status(404).json({
    status,
    data,
    message,
  });
};

export const response500 = ({
  res,
  status = false,
  data,
  message = "500",
}: responseType) => {
  return res.status(500).json({
    status,
    message,
    data,
  });
};

type paginationParamsType = {
  page?: string | number;
  limit?: string | number;
  search?: string;
  sort?: string;
  sortColumn?: string;
};

export const getPaginationParams = ({
  page,
  limit,
  search,
  sort,
  sortColumn,
}: paginationParamsType) => {
  page = parseInt((page ?? 1) as string, 10);
  limit = parseInt((limit ?? 20) as string, 10);
  const skip = (page - 1) * limit;
  return { page, limit, skip, search, sort, sortColumn };
};