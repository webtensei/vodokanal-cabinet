import { RouterProvider, createBrowserRouter, useRouteError } from 'react-router-dom';
import { AuthPageRoute } from '@/pages/auth';
import { HomePageRoute } from '@/pages/home';
import { GeneralLayout, GuestLayout } from '@/pages/layouts';
import { NehomePageRoute } from '@/pages/nehome';

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
        children:[
          NehomePageRoute,
          AuthPageRoute,
        ],
      },
      {
        element: <GeneralLayout />,
        children:[
          HomePageRoute,
        ],
      },
    ],
  },
]);

export function BrowserRouter() {
  return <RouterProvider router={router} />;
}
