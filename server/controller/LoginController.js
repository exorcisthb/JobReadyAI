import { LoginDTO } from "../DTO/LoginDTO.js";
import { AuthService } from "../service/AuthService.js";
import { getRequestIp } from "../utils/requestIp.js";

export class LoginController {
  static async login(request, response, next) {
    try {
      console.log("[LoginController] Request body:", JSON.stringify(request.body, null, 2));
      const loginDTO = new LoginDTO(request.body);
      console.log("[LoginController] Getting IP address...");
      const ip = getRequestIp(request);
      console.log("[LoginController] IP address:", ip);
      console.log("[LoginController] Calling AuthService.login...");
      const user = await AuthService.login(loginDTO, ip);
      console.log("[LoginController] Login successful, user:", user.email);
      response.json({ user });
    } catch (error) {
      console.error("[LoginController] Error during login:", error);
      next(error);
    }
  }
}
