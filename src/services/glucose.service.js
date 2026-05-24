import api from "./api";

export const getLogs = () => api.get("/glucose/logs");

export const createLog = (data) =>
    api.post("/glucose/logs", data);