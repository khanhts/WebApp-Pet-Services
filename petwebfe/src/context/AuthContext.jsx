import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import api from "../api";

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return authContext;
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null); // Store token in memory

  // Fetch user data on initial load
  useEffect(() => {
    const fetchMe = async () => {
      try {
        const response = await api.get("/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("User authenticated:", response.data.user);
      } catch (error) {
        if (error.response && error.response.status === 403) {
          console.log("Unauthorized: Token expired or invalid");
          setToken(null); // Clear the token if unauthorized
        } else {
          console.error("Failed to fetch user data:", error);
        }
      }
    };

    if (token) {
      fetchMe();
    }
  }, [token]);

  // Add Authorization header to outgoing requests
  useLayoutEffect(() => {
    const authInterceptor = api.interceptors.request.use((config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    return () => {
      api.interceptors.request.eject(authInterceptor);
    };
  }, [token]);

  // Handle token refresh on 403 errors
  useLayoutEffect(() => {
    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (
          error.response &&
          error.response.status === 403 &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true;
          try {
            const response = await api.get("/auth/refresh");
            setToken(response.data.accessToken); // Update token in memory
            originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
            return api(originalRequest); // Retry the original request
          } catch (refreshError) {
            console.log("Token refresh failed:", refreshError);
            setToken(null); // Clear the token if refresh fails
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};
