import { create } from "zustand";
import { getToken, setToken, removeToken } from "../utils/token";

export const useAuthStore = create((set) => ({
    token: getToken(),
    user: null,

    setToken: (token) => {
        setToken(token);
        set({ token });
    },

    setUser: (user) => set({ user }),

    logout: () => {
        removeToken();
        set({ token: null, user: null });
    }
}));