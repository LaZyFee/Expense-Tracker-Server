import { create } from "zustand";
import axios from "axios";

const API_URL = "https://expense-tracker-server-production-6e9d.up.railway.app";

axios.defaults.withCredentials = true;

export const useAuth = create((set) => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    isAuthenticated: !!localStorage.getItem('token'), // Check token in localStorage for authentication
    error: null,
    isLoading: false,
    isCheckingAuth: true,
    message: null,

    // Signup function
    signup: async (email, password, name) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/signup`, { email, password, name });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            set({ user: response.data.user, isAuthenticated: true, isLoading: false });
        } catch (error) {
            set({ error: error.response?.data?.message || "Error signing up", isLoading: false });
            throw error;
        }
    },

    // Login function
    login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/login`, { email, password });
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            set({ user, isAuthenticated: true, error: null, isLoading: false });
        } catch (error) {
            console.error('Login error:', error.response?.data?.message || error.message);
            set({ error: error.response?.data?.message || "Error logging in", isLoading: false });
            throw error;
        }
    },

    // Logout function
    logout: async () => {
        set({ isLoading: true, error: null });
        try {
            await axios.post(`${API_URL}/logout`);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            set({ user: null, isAuthenticated: false, isLoading: false });
        } catch (error) {
            set({ error: "Error logging out", isLoading: false });
            throw error;
        }
    },

    // Check authentication status
    // checkAuth: async () => {
    //     set({ isCheckingAuth: true, error: null });
    //     try {
    //         const response = await axios.get(`${API_URL}/check-auth`);
    //         localStorage.setItem('token', response.data.token);
    //         localStorage.setItem('user', JSON.stringify(response.data.user));
    //         set({ user: response.data.user, isAuthenticated: true, isCheckingAuth: false });
    //     } catch (error) {
    //         set({ isAuthenticated: false, isCheckingAuth: false });
    //         localStorage.removeItem('token');
    //         localStorage.removeItem('user');
    //     }
    // },
}));
