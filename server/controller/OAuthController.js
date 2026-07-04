import { OAuthDTO } from "../DTO/OAuthDTO.js";
import { AuthService } from "../service/AuthService.js";
import { getRequestIp } from "../utils/requestIp.js";

export class OAuthController {
  static async login(request, response, next) {
    try {
      const oAuthDTO = new OAuthDTO(request.body);
      const user = await AuthService.loginWithOAuth(oAuthDTO, getRequestIp(request));
      response.json({ user });
    } catch (error) {
      next(error);
    }
  }
}
