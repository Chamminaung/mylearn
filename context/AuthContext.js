import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    async function load() {
      const t = await AsyncStorage.getItem('token');
      const u = await AsyncStorage.getItem('user');
      if (t) {
        setToken(t);
        setUser(JSON.parse(u));
        api.defaults.headers.common['Authorization'] = `Bearer ${t}`;
      }
    }
    load();
  }, []);

  async function login(token, userData) {
    setToken(token);
    setUser(userData);
    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('user', JSON.stringify(userData));
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  async function logout() {
    setToken(null);
    setUser(null);
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

// real api calls would go here

// import React, { createContext, useState, useEffect, useContext } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';

// const AuthContext = createContext();
// const BASE_URL = 'https://your-backend.com/api';

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function loadUser() {
//       const storedToken = await AsyncStorage.getItem('token');
//       if (storedToken) {
//         setToken(storedToken);
//         const res = await axios.get(`${BASE_URL}/me`, {
//           headers: { Authorization: `Bearer ${storedToken}` },
//         });
//         setUser(res.data);
//       }
//       setLoading(false);
//     }
//     loadUser();
//   }, []);

//   const login = async (email, password) => {
//     const res = await axios.post(`${BASE_URL}/login`, { email, password });
//     await AsyncStorage.setItem('token', res.data.token);
//     setToken(res.data.token);
//     setUser(res.data.user);
//   };

//   const register = async (name, email, password) => {
//     const res = await axios.post(`${BASE_URL}/register`, { name, email, password });
//     await AsyncStorage.setItem('token', res.data.token);
//     setToken(res.data.token);
//     setUser(res.data.user);
//   };

//   const logout = async () => {
//     await AsyncStorage.removeItem('token');
//     setToken(null);
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);

