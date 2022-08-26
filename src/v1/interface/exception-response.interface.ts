export interface ExceptionResponse {
  statusCode: number;
  timestamp: string;
  path: string;
  message?: string | object;
}
