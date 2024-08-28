import { createElement } from 'react';
import { RouteObject } from 'react-router-dom';
import { routes } from '@/shared/lib/react-router';
import { ServicesPage } from './services-page.ui';

export const ServicesPageRoute: RouteObject = {
  path: `${routes.services.root()}`,
  element: createElement(ServicesPage),
  children: [],
};
