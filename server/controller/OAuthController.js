import { OAuthDTO } from "../DTO/OAuthDTO.js";
import { AuthService } from "../service/AuthService.js";
import { getRequestIp } from "../utils/requestIp.js";
import { trackLoginFailed, checkMultiAccount } from "../middleware/suspiciousActivity.js";

export class OAuthController {
  static async login(request, response, next) {
    try {
      const oAuthDTO = new OAuthDTO(request.body);
      const ip = getRequestIp(request);
      const user = await AuthService.loginWithOAuth(oAuthDTO, ip);
      if (ip) {
        checkMultiAccount(ip, user.id).catch(() => {});
      }
      response.json({ user });
    } catch (error) {
      if (error.statusCode === 401 || error.statusCode === 403) {
        const ip = getRequestIp(request);
        trackLoginFailed(ip, request.body?.email).catch(() => {});
      }
      next(error);
    }
  }

  static async facebookLogin(request, response, next) {
    try {
      const ip = getRequestIp(request);
      const user = await AuthService.loginWithFacebook(request.body, ip);
      if (ip) {
        checkMultiAccount(ip, user.id).catch(() => {});
      }
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
