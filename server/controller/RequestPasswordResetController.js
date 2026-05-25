import { CheckEmailDTO } from "../DTO/CheckEmailDTO.js";
import { AuthService } from "../service/AuthService.js";

export class RequestPasswordResetController {
  static async request(request, response, next) {
    try {
      const checkEmailDTO = new CheckEmailDTO(request.body);
      const result = await AuthService.requestPasswordReset(checkEmailDTO);
      response.json(result);
    } catch (error) {
      next(error);
    }
  }
}
