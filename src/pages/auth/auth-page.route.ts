import { createElement } from 'react';
import { RouteObject } from 'react-router-dom';
import { routes } from '@/shared/lib/react-router';
import { AuthPage } from './auth-page.ui';

export const AuthPageRoute: RouteObject = {
  path: `${routes.auth.root()}`,
  element: createElement(AuthPage),
  children: [
    { path: `${routes.auth.login()}`, element: createElement(AuthPage) },
    { path: `${routes.auth.register()}`, element: createElement(AuthPage) },
  ],
};