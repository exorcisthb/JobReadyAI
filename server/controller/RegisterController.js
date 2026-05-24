import { RegisterDTO } from "../DTO/RegisterDTO.js";
import { AuthService } from "../service/AuthService.js";

export class RegisterController {
  static async register(request, response, next) {
    try {
      const registerDTO = new RegisterDTO(request.body);
      const result = await AuthService.register(registerDTO);
      response.status(201).json(result);
    } catch (error) {
      if (error.code === "23505") {
        response.status(409).json({ error: "Email này đã được đăng ký." });
        return;
      }

      next(error);
    }
  }
}
