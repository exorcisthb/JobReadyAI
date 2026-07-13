import { LoginDTO } from "../DTO/LoginDTO.js";
import { AuthService } from "../service/AuthService.js";
import { getRequestIp } from "../utils/requestIp.js";
import { trackLoginFailed } from "../middleware/suspiciousActivity.js";

export class LoginController {
  static async login(request, response, next) {
    try {
      const loginDTO = new LoginDTO(request.body);
      const ip = getRequestIp(request);
      const user = await AuthService.login(loginDTO, ip);
      response.json({ user });
    } catch (error) {
      if (error.statusCode === 401 || error.statusCode === 403) {
        const ip = getRequestIp(request);
        trackLoginFailed(ip, request.body?.email).catch(() => {});
      }
      next(error);
    }
  }
}
