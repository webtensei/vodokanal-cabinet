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
  profile:{
    root() {
      return routes.root.concat('profile/');
    },
  },
};