import { createElement } from 'react';
import { RouteObject } from 'react-router-dom';
import { routes } from '@/shared/lib/react-router';
import { VerufyPage } from './verify-page.ui';

export const VerifyPageRoute: RouteObject = {
  path: `${routes.auth.verify()}`,
  element: createElement(VerufyPage),
  children: [],
};
