import { createContext, useContext, useState, useEffect } from 'react';

// Create the context
const AuthContext = createContext();

// Provider wraps the whole app
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // On app load, check if user was previously logged in
  useEffect(() => {
    const savedToken = localStorage.getItem('tatvapath_token');
    const savedUser = localStorage.getItem('tatvapath_user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Login — save to state + localStorage
  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('tatvapath_token', userToken);
    localStorage.setItem('tatvapath_user', JSON.stringify(userData));
  };

  // Logout — clear everything
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('tatvapath_token');
    localStorage.removeItem('tatvapath_user');
  };

  // Update user points locally after quiz
  const updatePoints = (newPoints) => {
    const updatedUser = { ...user, totalPoints: user.totalPoints + newPoints };
    setUser(updatedUser);
    localStorage.setItem('tatvapath_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ 
      user, token, loading, login, logout, updatePoints 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook — easy to use in any component
export const useAuth = () => useContext(AuthContext);