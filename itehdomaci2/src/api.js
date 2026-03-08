
const API_BASE = import.meta?.env?.VITE_API_URL || "http://127.0.0.1:8000/api";

// ===== Token handling =====
let authToken = null;
export const setAuthToken = (t) => (authToken = t);
export const getAuthToken = () => authToken;

// ===== Helpers =====
const baseHeaders = () => ({
  "Content-Type": "application/json",
  "Accept": "application/json",                  
  "X-Requested-With": "XMLHttpRequest",         
  ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
});

const handleResponse = async (res) => {
  // pokušaj JSON, ako padne, baci statusText
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const err = data ?? { message: res.statusText, status: res.status };
    throw err;
  }
  return data;
};

export async function apiGet(path) {
  const res = await fetch(`${API_BASE}${path}`, { headers: baseHeaders() });
  return handleResponse(res);
}
export async function apiPost(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: baseHeaders(),
    body: JSON.stringify(body ?? {}),
  });
  return handleResponse(res);
}
export async function apiPut(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "PUT",
    headers: baseHeaders(),
    body: JSON.stringify(body ?? {}),
  });
  return handleResponse(res);
}
export async function apiDelete(path) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "DELETE",
    headers: baseHeaders(),
  });
  return handleResponse(res);
}


// =================== AUTH (bez /auth prefiksa) ===================
export const registerApi = (payload) => apiPost("/register", payload);
export const loginApi = (email, password) => apiPost("/login", { email, password });
// /logout je zaštićen sanctum-om → treba Bearer token
export const logoutApi = () => apiPost("/logout", {});

// =================== CONTAINERS (zaštićeno sanctum-om) ===================
export const listContainers = () => apiGet("/containers");
export const getContainer = (id) => apiGet(`/containers/${id}`);
export const createContainer = (payload) => apiPost("/containers", payload);
export const updateContainer = (id, payload) => apiPut(`/containers/${id}`, payload);
export const deleteContainer = (id) => apiDelete(`/containers/${id}`);

// =================== PRODUCTS (zaštićeno sanctum-om) ===================
export const listProducts = () => apiGet("/products");
export const getProduct = (id) => apiGet(`/products/${id}`);
export const createProduct = (payload) => apiPost("/products", payload);
export const updateProduct = (id, payload) => apiPut(`/products/${id}`, payload);
export const deleteProduct = (id) => apiDelete(`/products/${id}`);

// =================== OFFERS (apiResource, zaštićeno sanctum-om) ===================
// index, store, show, update, destroy -> /offers
export const listOffers = () => apiGet("/offers");
export const getOffer = (id) => apiGet(`/offers/${id}`);
export const createOffer = (payload) => apiPost("/offers", payload);
export const updateOffer = (id, payload) => apiPut(`/offers/${id}`, payload);
export const deleteOffer = (id) => apiDelete(`/offers/${id}`);

// =================== SUPPLIER-IMPORTER relacije (zaštićeno sanctum-om) ===================
export const listSupplierImporters = () => apiGet("/supplier-importers");
export const createSupplierImporter = (payload) => apiPost("/supplier-importers", payload);
export const deleteSupplierImporter = (id) => apiDelete(`/supplier-importers/${id}`);

export const getImportersBySupplier = (supplierId) =>
  apiGet(`/supplier/${supplierId}/importers`);

export const getSuppliersByImporter = (importerId) =>
  apiGet(`/importer/${importerId}/suppliers`);


// =================== ADMIN USERS ===================
export const listUsers = () => apiGet("/admin/users");
export const getUser = (id) => apiGet(`/admin/users/${id}`);
export const createUser = (payload) => apiPost("/admin/users", payload);
export const updateUser = (id, payload) => apiPut(`/admin/users/${id}`, payload);
export const deleteUser = (id) => apiDelete(`/admin/users/${id}`);