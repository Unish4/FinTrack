import api from "./api.js";

export const registerUser = async ({ clerkUserId, email, name }) => {
  const response = await api.post("/auth/register", {
    clerkUserId,
    email,
    name,
  });
  return response.data;
};

export const getUserProfile = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};
