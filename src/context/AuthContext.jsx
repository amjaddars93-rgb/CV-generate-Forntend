import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/api";

const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const token = localStorage.getItem("cv_token");
    if (!token) { setLoading(false); return; }
    api.get("/auth/me")
      .then((res) => setUser(res.data.data.user))
      .catch(() => { localStorage.removeItem("cv_token"); setUser(null); })
      .finally(() => setLoading(false));
  }, []);
  async function login(email, password) {
    const res = await api.post("/auth/login", { email, password });
    localStorage.setItem("cv_token", res.data.data.token);
    setUser(res.data.data.user);
  }
  async function register(name, email, password) {
    const res = await api.post("/auth/register", { name, email, password });
    localStorage.setItem("cv_token", res.data.data.token);
    setUser(res.data.data.user);
  }
  function logout() { localStorage.removeItem("cv_token"); setUser(null); }
  return <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>;
}
export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}
