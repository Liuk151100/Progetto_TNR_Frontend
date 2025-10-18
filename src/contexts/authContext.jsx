import { createContext, useContext, useState, useMemo, useEffect } from "react";
import { useNavigate} from "react-router-dom";
import axios from "../../data/axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loggedUser, setLoggedUser] = useState(null);
  const navigate = useNavigate();

  const login = (jwt) => {
    localStorage.setItem("token", jwt);
    setToken(jwt);
    navigate("/", { replace: true });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setLoggedUser(null);
    navigate("/", { replace: true });
  };

  const userId = useMemo(() => {
    if (!token) return null;
    try {
      const payloadBase64 = token.split(".")[1];
      const payloadJson = atob(payloadBase64); //parsa da base 64
      const payload = JSON.parse(payloadJson);
      return payload.userId || payload.id;
    } catch {
      return null;
    }
  }, [token]);

  const fetchLoggedUser = async () => {
    if (!token) return;
    try {
      const res = await axios.get(`/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLoggedUser(res.data);
    } catch (err) {
      console.error("fetchLoggedUser error:", err);
      logout();
    }
  };

  //salva l'utente loggato 
  useEffect(() => {
    if (token) {
      console.log("authContext token", token);
      fetchLoggedUser();
    } 
  }, [token]);

  return (
    <AuthContext.Provider
      value={{ token, loggedUser, userId, setToken, setLoggedUser, login, logout }} >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}
