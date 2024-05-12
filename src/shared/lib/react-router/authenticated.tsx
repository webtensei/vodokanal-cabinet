import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { hasToken, tokenPayload } from '@entities/session/session.model';
import { userQueries } from '@entities/user';
import { userService } from '@entities/user/user.queries';
import { routes } from '@shared/lib/react-router/';

export function Authenticated({ children }:{ children: ReactNode }) {

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { mutate: getUser, error, isSuccess } = userQueries.useFetchCurrentUserMutation();
  const user = userService.getCache();

  useEffect(() => {
    if (!hasToken()) return navigate(routes.auth.login());
    if (hasToken()) getUser({ username: tokenPayload().username });
  }, [getUser, navigate]);

  useEffect(() => {
    if (isSuccess) setIsLoading(false);
    if (error) {
      console.log(error);
      toast.error(error.response.message || 'Неизвестная ошибка');
    }
  }, [isSuccess, error]);

  if (isLoading) return <div>загрузка</div>;

  if (user && (!user.contacts.email_activated || !user.contacts.phone_activated)) {
    navigate(routes.auth.verify());
  }
  return (
    <>{children}</>
  );
}