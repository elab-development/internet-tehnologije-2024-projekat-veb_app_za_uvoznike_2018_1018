
const API_BASE = import.meta?.env?.VITE_API_URL || "http://localhost:8000/api";

let authToken = null;
export const setAuthToken = (t) => (authToken = t);

const baseHeaders = () => ({
  "Content-Type": "application/json",
  ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
});

export async function apiGet(path) {
  const res = await fetch(`${API_BASE}${path}`, { headers: baseHeaders() });
  if (!res.ok) throw await res.json().catch(() => new Error(res.statusText));
  return res.json();
}
export async function apiPost(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: baseHeaders(),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw await res.json().catch(() => new Error(res.statusText));
  return res.json();
}
export async function apiPut(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "PUT",
    headers: baseHeaders(),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw await res.json().catch(() => new Error(res.statusText));
  return res.json();
}
export async function apiDelete(path) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "DELETE",
    headers: baseHeaders(),
  });
  if (!res.ok) throw await res.json().catch(() => new Error(res.statusText));
  return res.json();
}

// AUTH
export const loginApi = (email, password) =>
  apiPost("/auth/login", { email, password });

export const logoutApi = () => apiPost("/auth/logout", {});

// CONTAINERS (CRUD)
export const listContainers = () => apiGet("/containers");
export const createContainer = (payload) => apiPost("/containers", payload);
export const updateContainer = (id, payload) => apiPut(`/containers/${id}`, payload);
export const deleteContainer = (id) => apiDelete(`/containers/${id}`);
