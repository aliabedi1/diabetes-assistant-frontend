import api from "./api";

export const getMedicalLogs = () => api.get("/medical/logs");
export const createMedicalLog = (data) => api.post("/medical/logs", data);
