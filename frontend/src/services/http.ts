import type { ApiErrorBody } from "../types/dream";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000";

export class ApiError extends Error {
  code: string;
  status: number;
  constructor(message: string, code: string, status: number) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
    });
  } catch {
    throw new ApiError("网络错误，请检查后端服务是否启动", "NETWORK_ERROR", 0);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  if (!response.ok) {
    let code = "UNKNOWN_ERROR";
    let message = "请求失败，请稍后重试";
    try {
      const body = (await response.json()) as ApiErrorBody;
      if (body?.error?.code) code = body.error.code;
      if (body?.error?.message) message = body.error.message;
    } catch {
      // body not JSON, keep defaults
    }
    throw new ApiError(message, code, response.status);
  }

  return (await response.json()) as T;
}
