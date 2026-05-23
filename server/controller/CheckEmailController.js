import { CheckEmailDTO } from "../DTO/CheckEmailDTO.js";
import { AuthService } from "../service/AuthService.js";

export class CheckEmailController {
  static async check(request, response, next) {
    try {
      const checkEmailDTO = new CheckEmailDTO(request.body);
      const exists = await AuthService.checkEmail(checkEmailDTO);
      response.json({ exists });
    } catch (error) {
      next(error);
    }
  }
}
