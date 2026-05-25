const TOKEN = "diabetes_assistant_token";

export const setToken = (t) => localStorage.setItem(TOKEN, t);
export const getToken = () => localStorage.getItem(TOKEN);
export const removeToken = () => localStorage.removeItem(TOKEN);
