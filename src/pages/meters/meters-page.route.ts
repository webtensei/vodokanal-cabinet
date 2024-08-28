import { createElement } from 'react';
import { RouteObject } from 'react-router-dom';
import { routes } from '@/shared/lib/react-router';
import { MetersPage } from './meters-page.ui';

export const MetersPageRoute: RouteObject = {
  path: `${routes.meters.root()}`,
  element: createElement(MetersPage),
  children: [],
};
