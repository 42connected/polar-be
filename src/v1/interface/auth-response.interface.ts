export interface LoginResponse {
  jwt: string;
  user: {
    intraId: string;
    role: string;
  };
}
