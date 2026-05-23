import { CompleteRegistrationDTO } from "../DTO/CompleteRegistrationDTO.js";
import { AuthService } from "../service/AuthService.js";

export class CompleteRegistrationController {
  static async complete(request, response, next) {
    try {
      const completeRegistrationDTO = new CompleteRegistrationDTO(request.body);
      const user = await AuthService.completeRegistration(completeRegistrationDTO);
      response.status(200).json({ user });
    } catch (error) {
      next(error);
    }
  }
}
