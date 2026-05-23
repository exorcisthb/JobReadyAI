import { query } from "../config/database.js";

export class HealthController {
  static async check(_request, response, next) {
    try {
      await query("select 1");
      response.json({ ok: true });
    } catch (error) {
      next(error);
    }
  }
}
