export interface UserSession {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
  };
  session: {
    id: string;
    userId: string;
    expiresAt: Date;
    token: string;
  };
}

export interface AuthErrorResponse {
  message?: string;
  code?: string;
}
