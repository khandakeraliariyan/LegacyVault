import api from "./api";

export const getAdminDashboard = async () => {
    const response = await api.get("/admin/dashboard");
    return response.data.data;
};

export const getPendingClaims = async () => {
    const response = await api.get("/admin/claims");
    return response.data.data;
};

export const approveClaim = async (id) => {
    const response = await api.patch(`/admin/claims/${id}/approve`);
    return response.data.data;
};

export const rejectClaim = async (id, reason) => {
    const response = await api.patch(`/admin/claims/${id}/reject`, { reason });
    return response.data.data;
};

export const getAuditLogs = async () => {
    const response = await api.get("/admin/audit-logs");
    return response.data.data;
};
