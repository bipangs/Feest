import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { apiService } from '../services/api';

interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  role: string;
  isVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user && !!accessToken;

  // Load stored auth data on app start
  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('accessToken');
      const storedUser = await AsyncStorage.getItem('user');

      if (storedToken && storedUser) {
        setAccessToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error loading stored auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const storeAuthData = async (token: string, userData: User) => {
    try {
      await AsyncStorage.setItem('accessToken', token);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Error storing auth data:', error);
    }
  };
  const clearAuthData = async () => {
    try {
      console.log('Clearing AsyncStorage data...');
      await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user']);
      console.log('AsyncStorage cleared successfully');
    } catch (error) {
      console.error('Error clearing auth data:', error);
      // Try to clear items individually if multiRemove fails
      try {
        await AsyncStorage.removeItem('accessToken');
        await AsyncStorage.removeItem('refreshToken');
        await AsyncStorage.removeItem('user');
        console.log('Individual clear completed');
      } catch (individualError) {
        console.error('Individual clear also failed:', individualError);
      }
    }
  };const login = async (email: string, password: string) => {
    try {
      const response = await apiService.login({ email, password });
      
      if (response.data) {
        const { user: userData, accessToken: token, refreshToken } = response.data;
        
        // Store tokens and user data
        await storeAuthData(token, userData);
        await AsyncStorage.setItem('refreshToken', refreshToken);
        
        // Update state immediately
        setUser(userData);
        setAccessToken(token);
        
        console.log('Login successful, user authenticated:', userData.email);
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (userData: any) => {
    try {
      await apiService.register(userData);
      // Registration successful, but user needs to verify email
      // Don't auto-login, redirect to login page
    } catch (error) {
      throw error;
    }
  };  const logout = async () => {
    try {
      console.log('Starting logout process...');
      
      // Call backend logout endpoint if we have a token
      if (accessToken) {
        console.log('Calling backend logout API...');
        try {
          await apiService.logout(accessToken);
          console.log('Backend logout successful');
        } catch (apiError) {
          console.error('Backend logout failed:', apiError);
          // Continue with local logout even if backend call fails
        }
      }
      
      // Clear local storage
      console.log('Clearing auth data...');
      await clearAuthData();
      
      // Reset state
      console.log('Resetting state...');
      setUser(null);
      setAccessToken(null);
      
      console.log('Logout completed, navigating to login...');
      // Navigate to login screen
      router.replace('/(auth)/login' as any);
    } catch (error) {
      console.error('Error during logout:', error);
      // Even if there's an error, still try to clear state and navigate
      setUser(null);
      setAccessToken(null);
      router.replace('/(auth)/login' as any);
    }
  };

  const refreshToken = async () => {
    try {
      const storedRefreshToken = await AsyncStorage.getItem('refreshToken');
      if (!storedRefreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await apiService.refreshToken(storedRefreshToken);
      
      if (response.data) {
        const { accessToken: newToken, refreshToken: newRefreshToken } = response.data;
        
        await AsyncStorage.setItem('accessToken', newToken);
        await AsyncStorage.setItem('refreshToken', newRefreshToken);
        
        setAccessToken(newToken);
      }
    } catch (error) {
      // Refresh failed, logout user
      await logout();
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    accessToken,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    refreshToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
