export type UserProvider = "email" | "google" | "facebook";

// Mock user database. In production, replace this with a real database.
export const mockUserDatabase: Record<
  string,
  { name: string; email: string; provider: UserProvider }
> = {
  "john@example.com": { name: "John Doe", email: "john@example.com", provider: "email" },
  "jane@example.com": { name: "Jane Smith", email: "jane@example.com", provider: "email" },
  "demo@jobredy.com": { name: "Demo User", email: "demo@jobredy.com", provider: "email" },
  "google@jobredy.com": { name: "Google Demo", email: "google@jobredy.com", provider: "google" },
  "facebook@jobredy.com": {
    name: "Facebook Demo",
    email: "facebook@jobredy.com",
    provider: "facebook",
  },
};

export function getUserByEmail(email: string) {
  return mockUserDatabase[email.toLowerCase()];
}

export function userExists(email: string) {
  return getUserByEmail(email);
}
