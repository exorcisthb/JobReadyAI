import { query } from "../config/database.js";
import { ApiError } from "../utils/ApiError.js";

export class UpdateLanguageController {
  /**
   * Update user's language preference
   * @route PUT /api/auth/language
   */
  static async update(req, res, next) {
    try {
      const userId = req.header("x-user-id");
      const { language } = req.body;

      // Validate user ID
      if (!userId) {
        throw ApiError.unauthorized("User ID is required");
      }

      // Validate language
      if (!language || !["vi", "en"].includes(language)) {
        throw ApiError.badRequest("Language must be 'vi' or 'en'");
      }

      // Update language in database
      const result = await query(
        `UPDATE users 
         SET language = $1, updated_at = NOW() 
         WHERE id = $2 
         RETURNING id, language`,
        [language, userId]
      );

      if (result.rows.length === 0) {
        throw ApiError.notFound("User not found");
      }

      res.status(200).json({
        success: true,
        message: "Language preference updated successfully",
        language: result.rows[0].language,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get user's language preference
   * @route GET /api/auth/language
   */
  static async get(req, res, next) {
    try {
      const userId = req.header("x-user-id");

      if (!userId) {
        throw ApiError.unauthorized("User ID is required");
      }

      const result = await query(
        `SELECT language FROM users WHERE id = $1`,
        [userId]
      );

      if (result.rows.length === 0) {
        throw ApiError.notFound("User not found");
      }

      res.status(200).json({
        success: true,
        language: result.rows[0].language || "vi", // Default to Vietnamese
      });
    } catch (error) {
      next(error);
    }
  }
}
