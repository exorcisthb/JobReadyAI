import { CompleteProfileDTO } from "../DTO/CompleteProfileDTO.js";
import { AuthService } from "../service/AuthService.js";

export class CompleteProfileController {
  static async complete(request, response, next) {
    try {
      const completeProfileDTO = new CompleteProfileDTO(request.body);
      const profile = await AuthService.completeProfile(completeProfileDTO);
      response.json({ profile });
    } catch (error) {
      next(error);
    }
  }
}
