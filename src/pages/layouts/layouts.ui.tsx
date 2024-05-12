import { Outlet } from 'react-router-dom';
import { Authenticated } from '@shared/lib/react-router/authenticated';

export function GuestLayout() {
  return <Outlet />;
}

export function AuthenticatedLayout() {
  return (
      <Authenticated>
        <Outlet/>
      </Authenticated>
  );
}

export function UserLayout() {
  return (
    <Authenticated>
      <div> hello</div>
      <Outlet />
    </Authenticated>
  );
}