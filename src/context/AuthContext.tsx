import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  _id: string;
  username: string;
  role: "admin" | "customer";
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  signup: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Dummy users for login
const DUMMY_USERS = [
  { _id: "1", username: "admin", password: "admin123", role: "admin" as const },
  { _id: "2", username: "customer", password: "customer123", role: "customer" as const },
  { _id: "3", username: "ahmad", password: "password123", role: "admin" as const },
  { _id: "4", username: "john", password: "password123", role: "customer" as const },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem("user");
      }
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Find user in dummy users
    const foundUser = DUMMY_USERS.find(
      (u) => u.username === username && u.password === password
    );

    if (foundUser) {
      const userData: User = {
        _id: foundUser._id,
        username: foundUser.username,
        role: foundUser.role,
      };
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      return true;
    }

    return false;
  };

  const signup = async (username: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Check if username already exists
    const userExists = DUMMY_USERS.find((u) => u.username === username);
    if (userExists) {
      return false; // Username already exists
    }

    // Create new user (default to customer role)
    const newUser: User = {
      _id: (DUMMY_USERS.length + 1).toString(),
      username: username,
      role: "customer",
    };

    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const value: AuthContextType = {
    user,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
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

