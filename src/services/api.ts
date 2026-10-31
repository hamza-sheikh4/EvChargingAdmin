/**
 * Calls the Express API, the same way the mobile app does (services/http/client.ts there).
 * Every response is { data } on success and { error, code } on failure. The admin login
 * is an httpOnly cookie, sent with credentials: "include".
 */
import { environment } from "@/config/environment";
import { errorCopy } from "@/content/layout";

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
type Query = Record<string, string | number | undefined>;
type Options = { body?: unknown; query?: Query };

const timeoutMs = 15_000;

/** A failed call. status is 0 when the server could not be reached. */
export class ApiError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
  }
}

function withQuery(path: string, query?: Query): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined) params.set(key, String(value));
  }
  const search = params.toString();
  return search ? `${path}?${search}` : path;
}

async function request<T>(method: Method, path: string, { body, query }: Options = {}): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${environment.apiUrl}${withQuery(path, query)}`, {
      method,
      headers: {
        Accept: "application/json",
        ...(body === undefined ? {} : { "Content-Type": "application/json" }),
      },
      credentials: "include",
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: AbortSignal.timeout(timeoutMs),
    });
  } catch {
    throw new ApiError(errorCopy.network, 0);
  }
  const payload = (await response.json().catch(() => undefined)) as { data?: T; error?: unknown } | undefined;
  if (!response.ok) {
    const message = typeof payload?.error === "string" ? payload.error : errorCopy.failed(response.status);
    throw new ApiError(message, response.status);
  }
  return payload?.data as T;
}

export const api = {
  get: <T>(path: string, query?: Query) => request<T>("GET", path, { query }),
  post: <T>(path: string, body?: unknown) => request<T>("POST", path, { body: body ?? {} }),
  patch: <T>(path: string, body: unknown) => request<T>("PATCH", path, { body }),
  delete: <T>(path: string) => request<T>("DELETE", path),
};
