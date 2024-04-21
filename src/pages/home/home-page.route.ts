import { createElement } from 'react';
import { RouteObject } from 'react-router-dom';
import { routes } from '@/shared/lib/react-router';
import { HomePage } from './home-page.ui';

export const HomePageRoute: RouteObject = {
  path: `${routes.root}/home`,
  element: createElement(HomePage),
};