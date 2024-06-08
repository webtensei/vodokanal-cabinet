import { Outlet } from 'react-router-dom';
import { Authenticated } from '@shared/lib/react-router/';
import { Navbar } from '@widgets/navbar';

export function GuestLayout() {
  return <Outlet />;
}

export function AuthenticatedLayout() {
  return (
    <Authenticated>
      <Outlet />
    </Authenticated>
  );
}

export function UserLayout() {
  return (
    <Authenticated>
      <main className='min-h-screen bg-background max-w-7xl font-sans antialiased flex flex-col mx-auto md:flex-row gap-4 md:pt-8 overflow-hidden'>
          <Navbar/>
          <Outlet />
      </main>
    </Authenticated>
);
}
