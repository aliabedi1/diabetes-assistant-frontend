import api from "./api";

export const getMedicines = () => api.get("/medicines");
export const getRecentMedicines = () => api.get("/medicines/recent");
export const createMedicineLog = (data) => api.post("/medicine-logs", data);
