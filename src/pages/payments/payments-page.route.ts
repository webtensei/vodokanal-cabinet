import { createElement } from 'react';
import { RouteObject } from 'react-router-dom';
import { routes } from '@/shared/lib/react-router';
import { PaymentsPage } from './payments-page.ui';

export const PaymentsPageRoute: RouteObject = {
  path: `${routes.payments.root()}`,
  element: createElement(PaymentsPage),
  children: [],
};
