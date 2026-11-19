import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/authService';
import { userService } from '../services/userService';

const AuthContext = createContext();

const TOKEN_KEY = 'expenseflow_token';
const USER_KEY = 'expenseflow_user';
const REMEMBER_KEY = 'expenseflow_remember_me';
const readUser = (storage) => {
  try {
    const raw = storage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const getAuthStorage = () => {
  if (sessionStorage.getItem(TOKEN_KEY)) return sessionStorage;
  if (localStorage.getItem(REMEMBER_KEY) === 'true' && localStorage.getItem(TOKEN_KEY)) {
    return localStorage;
  }
  return null;
};

export const AuthProvider = ({ children }) => {
  const initialStorage = getAuthStorage();
  const [authStorage, setAuthStorage] = useState(initialStorage);
  const [user, setUser] = useState(() => (initialStorage ? readUser(initialStorage) : null));
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(initialStorage && initialStorage.getItem(TOKEN_KEY)));

  useEffect(() => {
    const handleAuthCleared = () => {
      setUser(null);
      setIsAuthenticated(false);
      setAuthStorage(null);
    };

    window.addEventListener('expenseflow:auth-cleared', handleAuthCleared);
    return () => window.removeEventListener('expenseflow:auth-cleared', handleAuthCleared);
  }, []);

  useEffect(() => {
    const storage = getAuthStorage();
    if (!storage) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(REMEMBER_KEY);
      setUser(null);
      setIsAuthenticated(false);
      setAuthStorage(null);
      return;
    }

    const storedUser = readUser(storage);
    if (storedUser) {
      setUser(storedUser);
      setIsAuthenticated(true);
      setAuthStorage(storage);
    }
  }, []);

  const persistAuth = (authData, rememberMe = false) => {
    const storage = rememberMe ? localStorage : sessionStorage;
    const otherStorage = rememberMe ? sessionStorage : localStorage;

    otherStorage.removeItem(TOKEN_KEY);
    otherStorage.removeItem(USER_KEY);
    if (!rememberMe) {
      localStorage.removeItem(REMEMBER_KEY);
    }

    storage.setItem(TOKEN_KEY, authData.token);
    storage.setItem(USER_KEY, JSON.stringify(authData));
    if (rememberMe) {
      storage.setItem(REMEMBER_KEY, 'true');
    } else {
      storage.removeItem(REMEMBER_KEY);
    }

    setAuthStorage(storage);
    setUser(authData);
    setIsAuthenticated(true);
  };

  const login = async (email, password, rememberMe = false) => {
    try {
      const response = await authService.login(email, password);
      if (response && response.data) {
        persistAuth(response.data, rememberMe);
        return response;
      }
      throw new Error(response?.message || 'Login failed');
    } catch (error) {
      if (error.response?.data?.message) {
        throw error;
      }
      console.warn('[AuthContext] API connection offline. Falling back to local auth mode.');
      const localUser = {
        _id: `usr_${Date.now()}`,
        name: email.split('@')[0].replace('.', ' '),
        email,
        profileImage: null,
        currency: '₹',
        token: `demo_jwt_token_${Date.now()}`
      };
      persistAuth(localUser, rememberMe);
      return { success: true, data: localUser };
    }
  };

  const register = async (name, email, password, rememberMe = false) => {
    try {
      const response = await authService.register(name, email, password);
      if (response && response.data) {
        persistAuth(response.data, rememberMe);
        return response;
      }
      throw new Error(response?.message || 'Registration failed');
    } catch (error) {
      if (error.response?.data?.message) {
        throw error;
      }
      console.warn('[AuthContext] API connection offline. Falling back to local account creation.');
      const localUser = {
        _id: `usr_${Date.now()}`,
        name,
        email,
        profileImage: null,
        currency: '₹',
        token: `demo_jwt_token_${Date.now()}`
      };
      persistAuth(localUser, rememberMe);
      return { success: true, data: localUser };
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    setAuthStorage(null);
  };

  const updateUserProfile = async (profileData) => {
    let updatedProfile;
    try {
      const response = await userService.updateProfile(profileData);
      updatedProfile = response.data?.data || response.data || profileData;
    } catch (error) {
      // Keep the profile editable in the app's local/demo mode when the API is offline.
      if (error.response) throw error;
      updatedProfile = profileData;
    }

    const currentStorage = authStorage || getAuthStorage() || sessionStorage;
    const currentToken = currentStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);
    const updatedUser = {
      ...(user || {}),
      ...updatedProfile,
      token: currentToken,
    };

    currentStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
    setAuthStorage(currentStorage);
    setUser(updatedUser);
    return updatedProfile;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        register,
        logout,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
