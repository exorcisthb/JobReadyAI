import { OAuthDTO } from "../DTO/OAuthDTO.js";
import { AuthService } from "../service/AuthService.js";

export class OAuthController {
  static async login(request, response, next) {
    try {
      const oAuthDTO = new OAuthDTO(request.body);
      const user = await AuthService.loginWithOAuth(oAuthDTO);
      response.json({ user });
    } catch (error) {
      next(error);
    }
  }
}
