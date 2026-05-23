import { ResetPasswordDTO } from "../DTO/ResetPasswordDTO.js";
import { AuthService } from "../service/AuthService.js";

export class ResetPasswordController {
  static async reset(request, response, next) {
    try {
      const resetPasswordDTO = new ResetPasswordDTO(request.body);
      await AuthService.resetPassword(resetPasswordDTO);
      response.json({ ok: true });
    } catch (error) {
      next(error);
    }
  }
}
