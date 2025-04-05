// eslint-disable-next-line import/extensions
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  authenticatedDevices,
  loginHistory,
  loginUserMutation,
  logoutUser,
  registerUserMutation,
} from '@entities/session/session.api';
import { sessionStore } from '@entities/session/session.model';
import { GenericError } from '@shared/lib/fetch';
import { routes } from '@shared/lib/react-router';

const keys = {
  root: () => ['session'],
  login: () => [...keys.root(), 'login'] as const,
  logout: () => [...keys.root(), 'logout'] as const,
  history: () => [...keys.root(), 'history'] as const,
  register: () => [...keys.root(), 'register'] as const,
  authenticatedDevices: () => [...keys.root(), 'authenticatedDevices'] as const,
};

export function useLoginUserMutation() {
  const navigate = useNavigate();
  return useMutation({
    mutationKey: keys.login(),
    mutationFn: loginUserMutation,
    onSuccess: async (user) => {
      sessionStore.setState({ token: user.accessToken });
      navigate(routes.profile.root());
    },
    onError: (error: GenericError<any>) => error,
  });
}
export function useLogoutUserMutation() {
  const navigate = useNavigate();
  return useMutation({
    mutationKey: keys.logout(),
    mutationFn: logoutUser,
    onSuccess: async () => {
      sessionStore.getState().updateToken(null);
      navigate(routes.auth.login());
    },
    onError: (error: GenericError<any>) => error,
  });
}
export function useLoginHistory() {
  return useMutation({
    mutationKey: keys.history(),
    mutationFn: loginHistory,
    onError: (error: GenericError<any>) => error,
  });
}

export function useAuthenticatedDevices() {
  return useMutation({
    mutationKey: keys.authenticatedDevices(),
    mutationFn: authenticatedDevices,
    onError: (error: GenericError<any>) => error,
  });
}

export function useRegisterUserMutation() {
  return useMutation({
    mutationKey: keys.register(),
    mutationFn: registerUserMutation,
    onError: (error: GenericError<any>) => error,
  });
}
