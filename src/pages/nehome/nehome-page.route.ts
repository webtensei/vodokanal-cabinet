import { createElement } from 'react';
import { RouteObject } from 'react-router-dom';
import { NeHomePage } from '@/pages/nehome/nehome-page.ui';
import { routes } from '@/shared/lib/react-router';

export const NehomePageRoute: RouteObject = {
  path: `${routes.root}/nehome`,
  element: createElement(NeHomePage),
};