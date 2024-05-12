// eslint-disable-next-line import/extensions
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { loginUserMutation } from '@entities/session/session.api';
import { sessionStore } from '@entities/session/session.model';
import { GenericError } from '@shared/lib/fetch';
import { routes } from '@shared/lib/react-router';

const keys = {
  root: () => ['session'],
  login: () => [...keys.root(), 'login'] as const,
  logout: () => [...keys.root(), 'logout'] as const,
  register: () => [...keys.root(), 'register'] as const,
};

export function useLoginUserMutation() {
  const navigate = useNavigate();

  return useMutation({
    mutationKey: keys.login(),
    mutationFn: loginUserMutation,
    onSuccess: async (user) => {
      sessionStore.setState({ token: user.accessToken, username: user.refreshToken.username });
      navigate(routes.profile.root());
    },
    onError: (error: GenericError<any>) => error,
  });
}
