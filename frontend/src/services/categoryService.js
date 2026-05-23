import api from "./api.js";

export const getCategories = async (type = "") => {
  const params = type ? { type } : {};
  const response = await api.get("/categories", { params });
  return response.data;
};
