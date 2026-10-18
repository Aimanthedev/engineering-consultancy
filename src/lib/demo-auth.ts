export const DEMO_EMAIL = "admin@studiocommand.com";
export const DEMO_PASSWORD = "Demo@123";
const KEY = "sc-demo-session";

export const hasSession = () => typeof window !== "undefined" && localStorage.getItem(KEY) === "1";
export const startSession = () => localStorage.setItem(KEY, "1");
export const endSession = () => localStorage.removeItem(KEY);
export const checkCredentials = (email: string, password: string) =>
  email.trim().toLowerCase() === DEMO_EMAIL && password === DEMO_PASSWORD;
