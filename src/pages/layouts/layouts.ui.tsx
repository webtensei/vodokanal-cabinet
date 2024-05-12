import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { hasToken, sessionStore } from '@entities/session/session.model';
import { userQueries } from '@entities/user';
import { userService } from '@entities/user/user.queries';
import { routes } from '@shared/lib/react-router';

export function GuestLayout() {
  return <Outlet />;
}

export function GeneralLayout() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { mutate: getUser, error, isSuccess } = userQueries.useFetchCurrentUserMutation();
  const user = userService.getCache();

  useEffect(() => {
    if (!hasToken()) return navigate(routes.auth.login());
    const { username } = sessionStore.getState();
    if (username) getUser({ username: username ?? null });
  }, [getUser, navigate]);

  useEffect(() => {
    if (isSuccess) setIsLoading(false);
    if (error) toast.error(error.response.message || 'Неизвестная ошибка');
  }, [isSuccess, error]);

  if (isLoading) return <div>загрузка</div>;

  if (user && (!user.contacts.email_activated || !user.contacts.phone_activated)) {
    navigate('verify');
  }

  return (
    <div>
      s
      <Outlet />
    </div>
  );
}
