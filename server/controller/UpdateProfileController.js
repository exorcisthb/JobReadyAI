import { query } from "../config/database.js";

export class UpdateProfileController {
  static async update(request, response, next) {
    try {
      const userId = request.headers["x-user-id"];
      if (!userId) {
        return response.status(401).json({ error: "Unauthorized" });
      }

      const {
        full_name,
        phone,
        job_title,
        industry,
        experience_level,
        location,
        skills,
        career_goal,
        avatar_url,
      } = request.body;

      // Update user_profiles table
      await query(
        `
        INSERT INTO user_profiles (user_id, full_name, phone, job_title, industry, experience_level, location, skills, career_goal, avatar_url, profile_completed, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, true, NOW())
        ON CONFLICT (user_id)
        DO UPDATE SET
          full_name = COALESCE($2, user_profiles.full_name),
          phone = COALESCE($3, user_profiles.phone),
          job_title = COALESCE($4, user_profiles.job_title),
          industry = COALESCE($5, user_profiles.industry),
          experience_level = COALESCE($6, user_profiles.experience_level),
          location = COALESCE($7, user_profiles.location),
          skills = COALESCE($8, user_profiles.skills),
          career_goal = COALESCE($9, user_profiles.career_goal),
          avatar_url = COALESCE($10, user_profiles.avatar_url),
          profile_completed = true,
          updated_at = NOW()
      `,
        [userId, full_name, phone, job_title, industry, experience_level, location, skills, career_goal, avatar_url]
      );

      response.json({
        success: true,
        message: "Cập nhật hồ sơ thành công",
      });
    } catch (error) {
      next(error);
    }
  }
}
