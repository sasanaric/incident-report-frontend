import { createContext, useCallback, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import {
  INCIDENT_TOKEN_REFRESH_URL,
  INCIDENT_TOKEN_URL,
} from "../constants/URL";
import { message } from "antd";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null
  );
  const [user, setUser] = useState(() =>
    localStorage.getItem("authTokens")
      ? jwtDecode(localStorage.getItem("authTokens"))
      : null
  );
  const [loading, setLoading] = useState(true);
  const history = useNavigate();
  const loginUser = async (username, password) => {
    try {
      const response = await fetch(INCIDENT_TOKEN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.ok) {
        setAuthTokens(data);
        setUser(jwtDecode(data.access));
        localStorage.setItem("authTokens", JSON.stringify(data));
        history("/");
      }
    } catch (error) {
      message.error("Login error");
    }
  };

  const logoutUser = useCallback(() => {
    setUser(null);
    setAuthTokens(null);
    localStorage.removeItem("authTokens");
    history("/login");
  }, [history]);

  const updateToken = useCallback(async () => {
    try {
      const response = await fetch(INCIDENT_TOKEN_REFRESH_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh: authTokens?.refresh }),
      });

      const data = await response.json();
      if (response.ok && data.access) {
        setAuthTokens(data);
        setUser(jwtDecode(data.access));
        localStorage.setItem("authTokens", JSON.stringify(data));
      } else {
        logoutUser();
      }

      if (loading) {
        setLoading(false);
      }
    } catch (error) {
      message.error("Network error");
      logoutUser();
    }
  }, [authTokens, loading, logoutUser]);

  useEffect(() => {
    if (loading) {
      updateToken();
    }
    const interval = setInterval(() => {
      if (authTokens) {
        updateToken();
      }
    }, 240000);
    return () => clearInterval(interval);
  }, [authTokens, loading, updateToken]);

  const contextData = {
    user: user,
    loginUser: loginUser,
    logoutUser: logoutUser,
  };

  return (
    <AuthContext.Provider value={{ ...contextData }}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
