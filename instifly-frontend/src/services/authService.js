import api from "../api/axiosClient";

export async function loginUser(data) {
  const res = await api.post("/account/login/", data);
  return res.data;
}