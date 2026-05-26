export class LogoutController {
  static async logout(request, response, next) {
    try {
      const userId = request.headers["x-user-id"];
      const userRole = request.headers["x-user-role"];

      // Log the logout action for audit purposes
      console.log(`[Logout] User ${userId} (${userRole}) logged out at ${new Date().toISOString()}`);

      // In a production app with JWT, you would:
      // 1. Add the token to a blacklist/revocation list
      // 2. Or remove from refresh token store
      // For this demo app, logout is handled client-side

      response.json({ 
        success: true, 
        message: "Đăng xuất thành công" 
      });
    } catch (error) {
      next(error);
    }
  }
}
