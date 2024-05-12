import { RouterProvider, createBrowserRouter, useRouteError } from 'react-router-dom';
import { AuthPageRoute } from '@/pages/auth';
import { AuthenticatedLayout, GuestLayout, UserLayout } from '@/pages/layouts';
import { ProfilePageRoute } from '@pages/profile';
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
        children: [ProfilePageRoute],
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
