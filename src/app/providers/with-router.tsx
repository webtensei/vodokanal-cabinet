import { RouterProvider, createBrowserRouter, useRouteError } from 'react-router-dom';
import { AuthPageRoute } from '@/pages/auth';
import { AuthenticatedLayout, GuestLayout, UserLayout } from '@/pages/layouts';
import { MetersPageRoute } from '@pages/meters';
import { PaymentsPageRoute } from '@pages/payments';
import { ProfilePageRoute } from '@pages/profile';
import { ServicesPageRoute } from '@pages/services';
import { VerifyPageRoute } from '@pages/verify';

// https://github.com/remix-run/react-router/discussions/10166
function BubbleError() {
  const error = useRouteError();
  if (error) throw error;
  return null;
}

const router = createBrowserRouter([
  {
    errorElement: <BubbleError />,
    children: [
      {
        element: <GuestLayout />,
        children: [AuthPageRoute],
      },
      {
        element: <UserLayout />,
        children: [ProfilePageRoute, PaymentsPageRoute, MetersPageRoute, ServicesPageRoute],
      },
      {
        element: <AuthenticatedLayout />,
        children: [VerifyPageRoute],
      },
    ],
  },
]);

export function BrowserRouter() {
  return <RouterProvider router={router} />;
}
