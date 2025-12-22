import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { loginUser } from "../services/auth";

interface User {
  _id: string;
  username: string;
  email?: string;
  role: "admin" | "owner" | "staff";
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; needsCorporationSetup?: boolean }>;
  signup: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  needsCorporationSetup: boolean;
  setCorporationSetupComplete: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [needsCorporationSetup, setNeedsCorporationSetup] = useState(false);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    const corporationSetupStatus = localStorage.getItem("corporation_setup_complete");
    
    if (token && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        
        // Check if corporation setup is needed
        // If not marked as complete, check the stored status
        if (corporationSetupStatus !== "true") {
          // Check if needs_corporation_setup was stored
          const needsSetup = localStorage.getItem("needs_corporation_setup");
          setNeedsCorporationSetup(needsSetup === "true");
        }
      } catch (error) {
        // Clear invalid data
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("needs_corporation_setup");
        localStorage.removeItem("corporation_setup_complete");
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; needsCorporationSetup?: boolean }> => {
    try {
      const response = await loginUser({ email, password });

      if (response.success && response.data) {
        // Store token
        localStorage.setItem("token", response.data.token);

        // Store user data
        const userData: User = {
          _id: response.data.user.id,
          username: response.data.user.name,
          email: response.data.user.email,
          role: response.data.user.role as "admin" | "owner" | "staff",
        };

        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        
        // Store corporation setup status
        const needsSetup = response.data.needs_corporation_setup;
        setNeedsCorporationSetup(needsSetup);
        localStorage.setItem("needs_corporation_setup", needsSetup ? "true" : "false");
        
        return {
          success: true,
          needsCorporationSetup: needsSetup,
        };
      }

      return { success: false };
    } catch (error) {
      return { success: false };
    }
  };

  const signup = async (_username: string, _password: string): Promise<boolean> => {
    // Signup is handled by SignUpForm component directly
    // This function is kept for backward compatibility
    return false;
  };

  const logout = () => {
    setUser(null);
    setNeedsCorporationSetup(false);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("needs_corporation_setup");
    localStorage.removeItem("corporation_setup_complete");
  };

  const setCorporationSetupComplete = () => {
    setNeedsCorporationSetup(false);
    localStorage.setItem("corporation_setup_complete", "true");
    localStorage.setItem("needs_corporation_setup", "false");
  };

  const value: AuthContextType = {
    user,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
    needsCorporationSetup,
    setCorporationSetupComplete,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

