export interface User {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
  streak_days: number;
  daily_study_goal_minutes: number;
  created_at: string;
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("tutor_token");
}

export function setAuthSession(token: string, user: User) {
  if (typeof window === "undefined") return;
  localStorage.setItem("tutor_token", token);
  localStorage.setItem("tutor_user", JSON.stringify(user));
}

export function getUser(): User | null {
  if (typeof window === "undefined") return null;
  const userStr = localStorage.getItem("tutor_user");
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

export function logout() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("tutor_token");
  localStorage.removeItem("tutor_user");
  window.location.href = "/login";
}

export function isAuthenticated(): boolean {
  return !!getToken();
}
