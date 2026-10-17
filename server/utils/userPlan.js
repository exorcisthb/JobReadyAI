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

  // Validate active subscriptions from user_subscriptions table
  try {
    const activeSubs = await query(
      `SELECT plan, status, expires_at FROM user_subscriptions 
       WHERE user_id = $1 AND status = 'active' AND (expires_at IS NULL OR expires_at > NOW())`,
      [userId]
    );
    const activePlans = new Set(activeSubs.rows.map(r => r.plan));

    let changed = false;
    if (user.sub_plan_interview && user.sub_plan_interview !== "free" && !activePlans.has(user.sub_plan_interview)) {
      user.sub_plan_interview = "free";
      user.sub_expires_interview = null;
      changed = true;
    }
    if (user.sub_plan_cv && user.sub_plan_cv !== "free" && !activePlans.has(user.sub_plan_cv)) {
      user.sub_plan_cv = "free";
      user.sub_expires_cv = null;
      changed = true;
    }

    if (changed) {
      await query(
        `UPDATE users SET sub_plan_interview = $1, sub_expires_interview = $2, sub_plan_cv = $3, sub_expires_cv = $4, updated_at = NOW() WHERE id = $5`,
        [user.sub_plan_interview, user.sub_expires_interview, user.sub_plan_cv, user.sub_expires_cv, userId]
      );
    }
  } catch (err) {
    console.warn("[getUserPlanCached] Subscription validation warning:", err?.message);
  }

  set(`user_plan:${userId}`, user, TTL.USER_PLAN);
  return user;
}
