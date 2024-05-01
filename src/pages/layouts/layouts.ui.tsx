import { Outlet } from 'react-router-dom';

export function GuestLayout() {
  return (
    <Outlet />
  );
}

export function GeneralLayout() {
  return (
    <div>
      general
      <Outlet />
    </div>
  );
}