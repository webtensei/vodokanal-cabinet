import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { hasToken, sessionStore } from '@entities/session/session.model';
import { userQueries } from '@entities/user';
import { userService } from '@entities/user/user.queries';
import { routes } from '@shared/lib/react-router';

export function GuestLayout() {
  return (
    <Outlet />
  );
}

export function GeneralLayout() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const {
    mutate: getUser,
    error,
    isSuccess,
    isError,
  } = userQueries.useFetchCurrentUserMutation();


  useEffect(() => {
    if (!hasToken()) return navigate(routes.auth.login());
    const { username } = sessionStore.getState();
    if (username) getUser({ username:username ?? null });
  }, []);

  useEffect(() => {
    if (isSuccess) setIsLoading(false);
    if (isError) toast.error(error.response.message || 'Неизвестная ошибка');
  }, [isSuccess, isError]);

  if (isLoading) return <div>загрузка</div>;
  if (isSuccess && !isLoading) {
      const user = userService.getCache();
    if (user && (!user.contacts.email_activated || !user.contacts.phone_activated)) {
      navigate('pepe');
    }
  }
  return (
    <div>
      s
      <Outlet />
    </div>
  );
}