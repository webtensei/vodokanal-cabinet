// eslint-disable-next-line import/extensions
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { loginUserMutation } from '@entities/session/session.api';
import { sessionStore } from '@entities/session/session.model';
import { TSession } from '@entities/session/session.types';
import { GenericError } from '@shared/lib/fetch';
import { queryClient } from '@shared/lib/react-query';
import { routes } from '@shared/lib/react-router';


const keys = {
  root: () => ['session'],
  currentUser: () => [...keys.root(), 'currentUser'] as const,
  createUser: () => [...keys.root(), 'createUser'] as const,
  loginUser: () => [...keys.root(), 'loginUser'] as const,
  updateUser: () => [...keys.root(), 'updateUser'] as const,
  deleteUser: () => [...keys.root(), 'deleteUser'] as const,
};
export const userService = {
  queryKey: () => keys.currentUser(),

  getCache: () => queryClient.getQueryData<TSession>(userService.queryKey()),

  setCache: (session: TSession | null) =>
    queryClient.setQueryData(userService.queryKey(), session),

  removeCache: () =>
    queryClient.removeQueries({ queryKey: userService.queryKey() }),



  
};

export function useLoginUserMutation() {
  const navigate = useNavigate();

  return useMutation({
    mutationKey: keys.loginUser(),
    mutationFn: loginUserMutation,
    onSuccess: async (user) => {
      sessionStore.setState({ token: user.accessToken });
      userService.setCache(user);
      navigate(routes.profile.root());
    },
    onError: (error:GenericError<any>) => error,
  });
}