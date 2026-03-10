import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../services/authService";
import store from "../redux/store";
import { setUser } from "../redux/userSlice";

export function useLogin() {
  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      store.dispatch(setUser(data.user));
      console.log(data.user)
    },
  });
}