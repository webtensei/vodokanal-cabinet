import { useMutation } from '@tanstack/react-query';
import { changePassword, fetchCurrentUser } from '@entities/user/user.api';
import { TUser } from '@entities/user/user.types';
import { GenericError } from '@shared/lib/fetch';
import { queryClient } from '@shared/lib/react-query';

const keys = {
  root: () => ['user'],
  currentUser: () => [...keys.root(), 'currentUser'] as const,
  changeCredentials: () => [...keys.root(), 'changeCredentials'] as const,
  changePassword: () => [...keys.root(), 'changePassword'] as const,
};
export const userService = {
  queryKey: () => keys.currentUser(),

  getCache: () => queryClient.getQueryData<TUser>(userService.queryKey()),

  setCache: (session: TUser | null) => queryClient.setQueryData(userService.queryKey(), session),

  removeCache: () => queryClient.removeQueries({ queryKey: userService.queryKey() }),
};

export function useFetchCurrentUserMutation() {
  return useMutation({
    mutationKey: keys.currentUser(),
    mutationFn: fetchCurrentUser,
    onSuccess: async (user) => {
      userService.setCache(user);
    },
    onError: (error: GenericError<any>) => error,
  });
}

export function useChangePassword() {
  return useMutation({
    mutationKey: keys.changePassword(),
    mutationFn: changePassword,
    onError: (error: GenericError<any>) => error,
  });
}
