import React, { useState, useEffect, createContext, useCallback } from "react";
import { toast } from "react-hot-toast";
import { io } from "socket.io-client";
import axios from "../src/api/axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export const AuthContext = createContext();

const AUTH_UPDATED_EVENT = "sandbox-auth-updated";

const getStoredSession = () => ({
  token: localStorage.getItem("token"),
  role: localStorage.getItem("role"),
  name: localStorage.getItem("name"),
});

const persistSession = ({ token, role, name }) => {
  if (token) {
    localStorage.setItem("token", token);
  } else {
    localStorage.removeItem("token");
  }

  if (role) {
    localStorage.setItem("role", role);
  } else {
    localStorage.removeItem("role");
  }

  if (name) {
    localStorage.setItem("name", name);
  } else {
    localStorage.removeItem("name");
  }
};

export const notifyAuthUpdated = () => {
  window.dispatchEvent(new Event(AUTH_UPDATED_EVENT));
};

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(getStoredSession);
  const [authUser, setAuthUser] = useState(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);

  const disconnectSocket = useCallback(() => {
    setSocket((currentSocket) => {
      if (currentSocket) {
        currentSocket.off("getOnlineUsers");
        currentSocket.disconnect();
      }
      return null;
    });
    setOnlineUsers([]);
  }, []);

  const syncSessionFromStorage = useCallback(() => {
    setSession(getStoredSession());
  }, []);

  const clearSession = useCallback(
    (showToast = false, message = "Logged out successfully") => {
      disconnectSocket();
      persistSession({ token: null, role: null, name: null });
      setSession({ token: null, role: null, name: null });
      setAuthUser(null);
      if (showToast) {
        toast.success(message);
      }
    },
    [disconnectSocket]
  );

  const connectSocket = useCallback(
    (userData) => {
      if (!userData?._id) return;

      setSocket((currentSocket) => {
        const currentUserId = currentSocket?.io?.opts?.query?.userId;

        if (currentSocket?.connected && currentUserId === userData._id) {
          return currentSocket;
        }

        if (currentSocket) {
          currentSocket.off("getOnlineUsers");
          currentSocket.disconnect();
        }

        const newSocket = io(backendUrl, {
          query: { userId: userData._id },
        });

        newSocket.on("getOnlineUsers", (userIds) => setOnlineUsers(userIds));
        return newSocket;
      });
    },
    []
  );

  const checkAuth = useCallback(async () => {
    if (!session.token) {
      setAuthUser(null);
      setIsInitialLoading(false);
      return;
    }

    try {
      const { data } = await axios.get("/auth/check");

      if (data?.success && data.user) {
        setAuthUser(data.user);
        persistSession({
          token: session.token,
          role: data.user.role || session.role,
          name: data.user.name || session.name,
        });
        setSession(getStoredSession());
        connectSocket(data.user);
      } else {
        clearSession();
      }
    } catch (error) {
      if (error.response?.status === 401) {
        clearSession();
      } else {
        console.error("Auth check failed:", error);
      }
      setAuthUser(null);
    } finally {
      setIsInitialLoading(false);
    }
  }, [clearSession, connectSocket, session.name, session.role, session.token]);

  useEffect(() => {
    const handleLogout = () => {
      clearSession();
      toast.error("Session expired. Please log in again.");
    };

    const handleAuthUpdated = () => {
      syncSessionFromStorage();
    };

    window.addEventListener("logout", handleLogout);
    window.addEventListener(AUTH_UPDATED_EVENT, handleAuthUpdated);

    return () => {
      window.removeEventListener("logout", handleLogout);
      window.removeEventListener(AUTH_UPDATED_EVENT, handleAuthUpdated);
    };
  }, [clearSession, syncSessionFromStorage]);

  useEffect(() => {
    setIsInitialLoading(true);
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    return () => {
      disconnectSocket();
    };
  }, [disconnectSocket]);

  const login = async (state, credentials) => {
    try {
      const { data } = await axios.post(`/auth/${state}`, credentials);

      if (data.success) {
        persistSession({
          token: data.token,
          role: data.userData?.role,
          name: data.userData?.name,
        });
        setSession(getStoredSession());
        setAuthUser(data.userData);
        connectSocket(data.userData);
        toast.success(data.message || "Login successful");
        notifyAuthUpdated();
        return data;
      }

      toast.error(data.message || "Login failed");
      return data;
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Login failed");
      return null;
    }
  };

  const logout = () => {
    clearSession(true);
  };

  const updateProfile = async (body) => {
    try {
      const { data } = await axios.put("/update-profile", body);
      if (data.success) {
        setAuthUser(data.user);
        persistSession({
          token: session.token,
          role: data.user?.role || session.role,
          name: data.user?.name || session.name,
        });
        setSession(getStoredSession());
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Profile update failed");
    }
  };

  const value = {
    axios,
    user: authUser,
    authUser,
    isInitialLoading,
    setAuthUser,
    onlineUsers,
    socket,
    login,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
