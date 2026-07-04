import { LoginDTO } from "../DTO/LoginDTO.js";
import { AuthService } from "../service/AuthService.js";
import { getRequestIp } from "../utils/requestIp.js";

export class LoginController {
  static async login(request, response, next) {
    try {
      const loginDTO = new LoginDTO(request.body);
      const user = await AuthService.login(loginDTO, getRequestIp(request));
      response.json({ user });
    } catch (error) {
      next(error);
    }
  }
}
