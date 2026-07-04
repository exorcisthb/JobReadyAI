export class LogoutController {
  static async logout(request, response, next) {
    try {
      const userId = request.headers["x-user-id"];
      const userRole = request.headers["x-user-role"];

      // Log the logout action for audit purposes
      console.log(`[Logout] User ${userId} (${userRole}) logged out at ${new Date().toISOString()}`);

      // Logout is handled client-side (session/token cleared in browser)

      response.json({ 
        success: true, 
        message: "Đăng xuất thành công" 
      });
    } catch (error) {
      next(error);
    }
  }
}
