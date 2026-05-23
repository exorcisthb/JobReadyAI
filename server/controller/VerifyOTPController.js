import { VerifyOTPDTO } from "../DTO/VerifyOTPDTO.js";
import { AuthService } from "../service/AuthService.js";

export class VerifyOTPController {
  static async verify(request, response, next) {
    try {
      const verifyOTPDTO = new VerifyOTPDTO(request.body);
      const result = await AuthService.verifyOTP(verifyOTPDTO);
      response.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
