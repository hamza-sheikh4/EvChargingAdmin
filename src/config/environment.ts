export const environment = {
  appEnv: process.env.NEXT_PUBLIC_APP_ENV ?? "development",
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1",
} as const;
