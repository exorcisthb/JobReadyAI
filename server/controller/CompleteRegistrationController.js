import { CompleteRegistrationDTO } from "../DTO/CompleteRegistrationDTO.js";
import { AuthService } from "../service/AuthService.js";
import { getRequestIp } from "../utils/requestIp.js";

export class CompleteRegistrationController {
  static async complete(request, response, next) {
    try {
      const completeRegistrationDTO = new CompleteRegistrationDTO(request.body);
      const user = await AuthService.completeRegistration(completeRegistrationDTO, getRequestIp(request));
      response.status(200).json({ user });
    } catch (error) {
      next(error);
    }
  }
}
