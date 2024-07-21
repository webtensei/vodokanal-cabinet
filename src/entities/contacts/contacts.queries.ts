import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { changeContacts, sendVerificationCode } from '@entities/contacts/contacts.api';
import { GenericError } from '@shared/lib/fetch';
import { routes } from '@shared/lib/react-router';

const keys = {
  root: () => ['contacts'],
  verifyPhone: () => [...keys.root(), 'verifyPhoneCode'] as const,
  verifyEmail: () => [...keys.root(), 'verifyEmailCode'] as const,
  changeContacts: () => [...keys.root(), 'changeContacts'] as const,
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

export function useChangeContacts() {

  return useMutation({
    mutationKey: keys.changeContacts(),
    mutationFn: changeContacts,
    onError: (error: GenericError<any>) => console.log(error),
  });
}
