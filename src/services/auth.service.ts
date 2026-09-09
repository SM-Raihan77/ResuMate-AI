import { auth } from "@/lib/auth";

export class AuthService {
  /**
   * Retrieves the current user session server-side from request headers.
   */
  static async getSession(headers: Headers) {
    try {
      return await auth.api.getSession({
        headers,
      });
    } catch (error) {
      console.error("Error fetching session in AuthService:", error);
      return null;
    }
  }
}
