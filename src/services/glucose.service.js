import api from "./api";

export const getGlucoseLogs = () => api.get("/glucose/logs");
export const createGlucoseLog = (data) => api.post("/glucose/logs", data);

export const getLogs = getGlucoseLogs;
export const createLog = createGlucoseLog;
