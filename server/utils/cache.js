import NodeCache from "node-cache";

const cache = new NodeCache({ checkperiod: 60 });

export const TTL = {
  USER_PLAN: 120,
  ADMIN_SETTINGS: 300,
  SUBSCRIPTION_PLANS: 3600,
  CV_COUNT: 30,
  ONLINE_COUNT: 10,
  USER_PROFILE: 300,
};

export function get(key) {
  return cache.get(key);
}

export function set(key, value, ttl) {
  return cache.set(key, value, ttl);
}

export function del(key) {
  return cache.del(key);
}

export function flush() {
  return cache.flushAll();
}
