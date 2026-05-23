import { normalizeEmail } from "../utils/authUtils.js";

export class CheckEmailDTO {
  constructor(body) {
    this.email = normalizeEmail(body.email);
  }
}
