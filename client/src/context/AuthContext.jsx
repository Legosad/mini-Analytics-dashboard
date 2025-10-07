import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthAPI } from '../api/auth';


const AuthContext = createContext(null);


export function AuthProvider({ children }) {
const [user, setUser] = useState(null);
const [loading, setLoading] = useState(true);


const token = localStorage.getItem('token');


useEffect(() => {
(async () => {
if (!token) { setUser(null); setLoading(false); return; }
try {
const res = await AuthAPI.me();
setUser(res.data);
} catch (_) {
localStorage.removeItem('token');
setUser(null);
} finally { setLoading(false); }
})();
}, [token]);


const login = async (email, password) => {
const res = await AuthAPI.login({ email, password });
localStorage.setItem('token', res.data.token);
setUser({ _id: res.data._id, username: res.data.username, email: res.data.email });
};


const register = async (username, email, password) => {
const res = await AuthAPI.register({ username, email, password });
localStorage.setItem('token', res.data.token);
setUser({ _id: res.data._id, username: res.data.username, email: res.data.email });
};


const logout = () => { localStorage.removeItem('token'); setUser(null); };


const value = { user, loading, login, register, logout };
return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}


export const useAuth = () => useContext(AuthContext);