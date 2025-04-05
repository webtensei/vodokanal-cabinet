import { useEffect, useState } from 'react';
import { Tab, Tabs, Link } from '@nextui-org/react';
import { useLocation, useNavigate, Link as RLink } from 'react-router-dom';
import { routes } from '@/shared/lib/react-router';
import { LoginForm, RegisterForm } from '@/widgets/auth-forms';
import { hasToken } from '@entities/session/session.model';

enum IAuthAction {
  login = 'login',
  register = 'register',
}
export function AuthPage() {
  const [selected, setSelected] = useState<IAuthAction>();
  // Прошу подметить одну нетривиальную вещь, редирект со страницы /auth/ произойдет на /auth/login/ автоматически
  // работает это потому-что Tabs сам лезет в функцию сеттер(onSelectionChange) с ключом первой Tab в children'ах
  const navigate = useNavigate();
  const { pathname } = useLocation();

  function handleTabChange(key: IAuthAction) {
    setSelected(key);
    return navigate(routes.auth[key]());
  }

  useEffect(() => {
    if (hasToken()) return navigate(routes.profile.root());
  }, []);

  return (
    <div className="flex min-h-[100vh] items-center justify-center">
      <div className="h-96 w-[340px] max-w-full ">
        <Tabs
          fullWidth
          aria-label="Выбор авторизации"
          selectedKey={selected}
          onSelectionChange={(key) => handleTabChange(key as IAuthAction)}
        >
          <Tab key={IAuthAction.login} title="Войти">
            <LoginForm />
            <p className="mt-4 text-center text-small">
              Не зарегистрированы?{' '}
              <Link size="sm" as={RLink} to={routes.auth.register()} className="cursor-pointer">
                Регистрация
              </Link>
            </p>
          </Tab>
          <Tab key={IAuthAction.register} title="Зарегестрироваться">
            <RegisterForm />
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}
