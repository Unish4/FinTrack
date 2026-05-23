import api from "./api.js";

export const getMonthlySummary = async (year) => {
  const response = await api.get("/transactions/summary/monthly", {
    params: { year },
  });
  return response.data;
};

export const getCategorySummary = async (type = "expense", year) => {
  const response = await api.get("/transactions/summary/by-category", {
    params: { type, year },
  });
  return response.data;
};
