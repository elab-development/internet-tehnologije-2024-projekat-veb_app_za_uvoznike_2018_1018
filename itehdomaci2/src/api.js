const API_BASE = import.meta?.env?.VITE_API_URL || "http://127.0.0.1:8000/api";

export const setAuthToken = (t) => {
  if (t) {
    localStorage.setItem("token", t);
  } else {
    localStorage.removeItem("token");
  }
};

export const getAuthToken = () => {
  return localStorage.getItem("token");
};

const baseHeaders = () => {
  const token = getAuthToken();

  return {
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const jsonHeaders = () => ({
  ...baseHeaders(),
  "Content-Type": "application/json",
});

const handleResponse = async (res) => {
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const err = data ?? { message: res.statusText, status: res.status };
    throw err;
  }

  return data;
};

export async function apiGet(path) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: baseHeaders(),
  });
  return handleResponse(res);
}

export async function apiPost(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: jsonHeaders(),
    body: JSON.stringify(body ?? {}),
  });
  return handleResponse(res);
}

export async function apiPut(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "PUT",
    headers: jsonHeaders(),
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

export async function apiPostForm(path, formData) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: baseHeaders(),
    body: formData,
  });
  return handleResponse(res);
}

export async function apiPostFormWithMethod(path, method, formData) {
  formData.append("_method", method);

  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: baseHeaders(),
    body: formData,
  });
  return handleResponse(res);
}

// auth
export const registerApi = (payload) => apiPost("/register", payload);
export const loginApi = (email, password) => apiPost("/login", { email, password });
export const logoutApi = () => apiPost("/logout", {});

// products
export const listProducts = () => apiGet("/products");
export const getProduct = (id) => apiGet(`/products/${id}`);
export const deleteProduct = (id) => apiDelete(`/products/${id}`);

// za supplier create/update sa slikom
export const createProductWithImage = (formData) => apiPostForm("/products", formData);
export const updateProductWithImage = (id, formData) =>
  apiPostFormWithMethod(`/products/${id}`, "PUT", formData);

// ostalo ostavi kako već imaš
export const listContainers = () => apiGet("/containers");
export const getContainer = (id) => apiGet(`/containers/${id}`);
export const createContainer = (payload) => apiPost("/containers", payload);
export const updateContainer = (id, payload) => apiPut(`/containers/${id}`, payload);
export const deleteContainer = (id) => apiDelete(`/containers/${id}`);

export const listSupplierImporters = () => apiGet("/supplier-importers");
export const createSupplierImporter = (payload) => apiPost("/supplier-importers", payload);
export const deleteSupplierImporter = (id) => apiDelete(`/supplier-importers/${id}`);

export const listUsers = () => apiGet("/admin/users");
export const getUser = (id) => apiGet(`/admin/users/${id}`);
export const createUser = (payload) => apiPost("/admin/users", payload);
export const updateUser = (id, payload) => apiPut(`/admin/users/${id}`, payload);
export const deleteUser = (id) => apiDelete(`/admin/users/${id}`);



export const getImportersBySupplier = (supplierId) =>
  apiGet(`/supplier/${supplierId}/importers`);