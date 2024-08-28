export const routes = {
  root: '/',
  home() {
    return routes.root;
  },
  page404() {
    return routes.root.concat('404/');
  },
  auth: {
    root() {
      return routes.root.concat('auth/');
    },
    login() {
      return routes.auth.root().concat('login/');
    },
    register() {
      return routes.auth.root().concat('register/');
    },
    verify() {
      return routes.auth.root().concat('verify/');
    },
  },
  profile: {
    root() {
      return routes.root.concat('profile/');
    },
  },
  payments: {
    root() {
      return routes.root.concat('payments/');
    },
  },
  meters: {
    root() {
      return routes.root.concat('meters/');
    },
  },
  services: {
    root() {
      return routes.root.concat('services/');
    },
  },
  indications: {
    root() {
      return routes.root.concat('indications/');
    },
  },
  admin: {
    root() {
      return routes.root.concat('admin/');
    },
    users: {
      root() {
        return routes.root.concat('users/');
      },
    },
    massMailing: {
      root() {
        return routes.root.concat('mass-mailing/');
      },
    },
    settings: {
      root() {
        return routes.root.concat('settings/');
      },
    },
  },
};

