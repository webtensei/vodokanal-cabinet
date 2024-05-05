import { createElement } from 'react';
import { RouteObject } from 'react-router-dom';
import { routes } from '@/shared/lib/react-router';
import { ProfilePage } from './profile-page.ui';

export const ProfilePageRoute: RouteObject = {
  path: `${routes.profile.root()}`,
  element: createElement(ProfilePage),
  children: [
  ],
};