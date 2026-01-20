import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/api';
import { API_URL } from '@/api/apiURL';
import { getDeviceInfo } from '@/utils/deviceInfo';

const AdminContext = createContext();

export function AdminProvider({ children }) {
  const [adminDevice, setAdminDevice] = useState(null);
  //const [token, setToken] = useState(null);

  useEffect(() => {
    async function load() {
      //const t = await AsyncStorage.getItem('token');
      const u = await AsyncStorage.getItem('admin');
      console.log("Loaded admin from storage: ", u);
      if (u?.length > 3) {

        //setToken(t);
        console.log("Setting admin device from storage: ", JSON.parse(u));
        setAdminDevice(JSON.parse(u));
        //api.defaults.headers.common['Authorization'] = `Bearer ${t}`;
      } else {
        const deviceId = await getDeviceInfo().then(info => info.id);
        const admin = await fetch(`${API_URL}/api/admindevices`)
                        .then(res => {console.log("Response:", res); return res.json()})
                        .then(data => data.filter(item => (item.deviceId === deviceId)));
        if (admin) {
          setAdminDevice(admin);
          await AsyncStorage.setItem('admin', JSON.stringify(admin));
        }
      }
    }
    load();
  }, []);

  async function login(token, userData) {
    //setToken(token);
    setAdminDevice(userData);
    //await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('admin', JSON.stringify(userData));
    //api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  async function logout() {
    //setToken(null);
    setAdminDevice(null);
    //await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('admin');
    //delete api.defaults.headers.common['Authorization'];
  }

  return (
    <AdminContext.Provider value={{ adminDevice, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => useContext(AdminContext);
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

