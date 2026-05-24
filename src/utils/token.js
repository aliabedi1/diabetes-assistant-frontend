const TOKEN = "access_token";

export const setToken = (t) => localStorage.setItem(TOKEN, t);
export const getToken = () => localStorage.getItem(TOKEN);
export const removeToken = () => localStorage.removeItem(TOKEN);