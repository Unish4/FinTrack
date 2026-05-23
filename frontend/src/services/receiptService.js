import api from "./api.js";

export const uploadReceipt = async (transactionId, file) => {
  const formData = new FormData();
  formData.append("receipt", file);

  const response = await api.post(
    `/transactions/${transactionId}/upload-receipt`,
    formData,
  );
  return response.data;
};

export const deleteReceipt = async (transactionId) => {
  const response = await api.delete(`/transactions/${transactionId}/receipt`);
  return response.data;
};
