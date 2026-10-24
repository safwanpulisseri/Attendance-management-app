import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { INITIAL_USERS } from '../data/dummyData';
import { StorageService } from '../utils/storage';

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  users: User[];
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  refreshUsers: () => Promise<void>;
  quickLogin: (user: User) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(INITIAL_USERS[0]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const loadedUsers = await StorageService.getUsers();
        setUsers(loadedUsers);

        const savedUser = await StorageService.getCurrentUser();
        if (savedUser) {
          // ensure user still exists in directory
          const match = loadedUsers.find((u) => u.id === savedUser.id);
          setCurrentUser(match || savedUser || loadedUsers[0]);
        }
      } catch (err) {
        console.error('Failed to bootstrap auth state:', err);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrap();
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; message?: string }> => {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      return { success: false, message: 'Please enter both email and password.' };
    }

    const matchedUser = users.find(
      (u) => u.email.toLowerCase() === trimmedEmail && u.password === trimmedPassword
    );

    if (!matchedUser) {
      return {
        success: false,
        message: 'Invalid credentials. Please verify your email and password.',
      };
    }

    // Persist session
    await StorageService.setCurrentUser(matchedUser);
    setCurrentUser(matchedUser);
    return { success: true };
  };

  const quickLogin = async (user: User): Promise<void> => {
    await StorageService.setCurrentUser(user);
    setCurrentUser(user);
  };

  const logout = async (): Promise<void> => {
    await StorageService.setCurrentUser(null);
    setCurrentUser(null);
  };

  const refreshUsers = async (): Promise<void> => {
    const loadedUsers = await StorageService.getUsers();
    setUsers(loadedUsers);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isLoading,
        users,
        login,
        logout,
        refreshUsers,
        quickLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
