import { ReactNode, useEffect, useState } from 'react';
import { Spinner } from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { hasToken, sessionStore, tokenPayload } from '@entities/session/session.model';
import { userQueries } from '@entities/user';
import { userService } from '@entities/user/user.queries';
import { routes } from '@shared/lib/react-router/';

export function Authenticated({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { mutate: getUser, error, isSuccess } = userQueries.useFetchCurrentUserMutation();
  const user = userService.getCache();

  useEffect(() => {
    if (!hasToken()) return navigate(routes.auth.login());
    getUser({ username: tokenPayload().username });
  }, [getUser, navigate]);

  useEffect(() => {
    if (isSuccess) setIsLoading(false);
    if (error) {
      if (error && error.response.message === 'Unauthorized') {
        sessionStore.getState().updateToken(null);
        navigate(routes.auth.login());
      }
      toast.error(error.response.message || 'Неизвестная ошибка');
    }
  }, [isSuccess, error]);

  useEffect(() => {
    if (user && (!user.contacts.email_activated || !user.contacts.phone_activated))
      return navigate(routes.auth.verify());
  }, [user]); 
  if (isLoading) return <div className='w-screen h-screen flex justify-center items-center'><Spinner size='lg' label="Загрузка" color="primary" labelColor="primary"/></div>;
  console.log('render authenticated');

  return <>{children}</>;
}
