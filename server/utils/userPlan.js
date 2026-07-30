import { query } from "../config/database.js";
import { get, set, TTL } from "./cache.js";

export async function getUserPlanCached(userId) {
  const cached = get(`user_plan:${userId}`);
  if (cached) return cached;

  const result = await query(
    `SELECT id, email, auth_provider,
            sub_plan_interview, sub_expires_interview, sub_plan_cv, sub_expires_cv,
            subscription_plan, subscription_expires_at
     FROM users WHERE id = $1`,
    [userId]
  );

  if (result.rows.length === 0) return null;

  const user = result.rows[0];
  set(`user_plan:${userId}`, user, TTL.USER_PLAN);
  return user;
}
