import { create } from "zustand";
import { getToken, setToken, removeToken } from "../utils/token";
import { login as loginRequest, logout as logoutRequest, me, register as registerRequest } from "../services/auth.service";

function extractToken(payload) {
    return payload?.token || payload?.access_token || payload?.data?.token || payload?.data?.access_token;
}

function extractUser(payload) {
    return payload?.user || payload?.data?.user || payload?.data || null;
}

export const useAuthStore = create((set, get) => ({
    token: getToken(),
    user: null,
    loading: false,
    error: null,

    setToken: (token) => {
        setToken(token);
        set({ token });
    },

    setUser: (user) => set({ user }),

    login: async (credentials) => {
        set({ loading: true, error: null });

        try {
            const response = await loginRequest(credentials);
            const token = extractToken(response.data);

            if (!token) {
                throw new Error("Login succeeded but no token was returned.");
            }

            setToken(token);
            set({ token, user: extractUser(response.data), loading: false });
            return response.data;
        } catch (error) {
            set({ loading: false, error });
            throw error;
        }
    },

    register: async (payload) => {
        set({ loading: true, error: null });

        try {
            const response = await registerRequest(payload);
            const token = extractToken(response.data);

            if (token) {
                setToken(token);
            }

            set({
                token: token || get().token,
                user: extractUser(response.data),
                loading: false,
            });
            return response.data;
        } catch (error) {
            set({ loading: false, error });
            throw error;
        }
    },

    loadUser: async () => {
        if (!get().token) {
            return null;
        }

        try {
            const response = await me();
            const user = extractUser(response.data);
            set({ user });
            return user;
        } catch (error) {
            void error;
            removeToken();
            set({ token: null, user: null });
            return null;
        }
    },

    logout: async () => {
        try {
            if (get().token) {
                await logoutRequest();
            }
        } catch (error) {
            void error;
        }

        removeToken();
        set({ token: null, user: null });
    }
}));
