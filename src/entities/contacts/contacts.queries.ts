import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { sendVerificationCode } from '@entities/contacts/contacts.api';
import { GenericError } from '@shared/lib/fetch';
import { routes } from '@shared/lib/react-router';

const keys = {
  root: () => ['contacts'],
  verifyPhone: () => [...keys.root(), 'verifyPhoneCode'] as const,
  verifyEmail: () => [...keys.root(), 'verifyEmailCode'] as const,
};

export function useVerifyPhoneMutation() {
  const navigate = useNavigate();

  return useMutation({
    mutationKey: keys.verifyPhone(),
    mutationFn: sendVerificationCode,
    onSuccess: async () => {
      navigate(routes.profile.root());
    },
    onError: (error: GenericError<any>) => error,
  });
}

export function useVerifyEmailMutation() {
  const navigate = useNavigate();

  return useMutation({
    mutationKey: keys.verifyEmail(),
    mutationFn: sendVerificationCode,
    onSuccess: async () => {
      navigate(routes.profile.root());
    },
    onError: (error: GenericError<any>) => error,
  });
}
