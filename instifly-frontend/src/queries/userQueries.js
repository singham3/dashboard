import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
  toggleUserActive,
  adminChangePassword,
} from "../services/userService";

export function useUsers(cursor) {
  return useQuery({
    queryKey: ["users", cursor],
    queryFn: () => fetchUsers(cursor),
    keepPreviousData: true,
  });
}

export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createUser,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });
}

export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateUser(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });
}

export function useToggleUserActive() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: toggleUserActive,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });
}

export function useAdminChangePassword() {
  return useMutation({
    mutationFn: ({ id, data }) => adminChangePassword(id, data),
  });
}
