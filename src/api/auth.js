import { apiClient } from "./client";

export async function register({ username, email, password }) {
  const { data } = await apiClient.post("/auth/register", {
    username,
    email,
    password,
  });
  return data;
}

export async function login({ username, password }) {
  const { data } = await apiClient.post("/auth/login", { username, password });
  return data;
}
