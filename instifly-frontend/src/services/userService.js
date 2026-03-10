import api from "../api/axiosClient";

export async function fetchUsers(cursor = null) {
  const params = {};
  if (cursor) params.cursor = cursor;
  const res = await api.get("/account/users/", { params });
  return res.data;
}

export async function getUser(id) {
  const res = await api.get(`/account/users/${id}/`);
  return res.data;
}

export async function createUser(data) {
  const res = await api.post("/account/users/", data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}

export async function updateUser(id, data) {
  const res = await api.put(`/account/users/${id}/`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}

export async function deleteUser(id) {
  const res = await api.delete(`/account/users/${id}/`);
  return res.data;
}

export async function toggleUserActive(id) {
  const res = await api.patch(`/account/users/${id}/toggle-active/`);
  return res.data;
}

export async function adminChangePassword(id, data) {
  const res = await api.post(`/account/users/${id}/change-password/`, data);
  return res.data;
}
