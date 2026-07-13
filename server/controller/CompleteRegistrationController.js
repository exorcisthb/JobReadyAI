import { CompleteRegistrationDTO } from "../DTO/CompleteRegistrationDTO.js";
import { AuthService } from "../service/AuthService.js";
import { getRequestIp } from "../utils/requestIp.js";
import { checkMultiAccount } from "../middleware/suspiciousActivity.js";

export class CompleteRegistrationController {
  static async complete(request, response, next) {
    try {
      const completeRegistrationDTO = new CompleteRegistrationDTO(request.body);
      const ip = getRequestIp(request);
      const user = await AuthService.completeRegistration(completeRegistrationDTO, ip);
      if (ip) {
        checkMultiAccount(ip, user.id).catch(() => {});
      }
      response.status(200).json({ user });
    } catch (error) {
      next(error);
    }
  }
}
