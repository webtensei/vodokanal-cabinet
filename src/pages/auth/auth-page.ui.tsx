import { useEffect, useState } from 'react';
import { Tab, Tabs, Link } from '@nextui-org/react';
import { useLocation, useNavigate, Link as RLink } from 'react-router-dom';
import { routes } from '@/shared/lib/react-router';
import { LoginForm, RegisterForm } from '@/widgets/auth-forms';


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

  function handleTabChange(key:IAuthAction) {
    setSelected(key);
    return navigate(routes.auth[key]());
  }

  useEffect(() => {
    if (pathname === routes.auth.register()) handleTabChange(IAuthAction.register);
  }, [pathname]);

  return (
    <div className="flex justify-center items-center min-h-[100vh]">
      <div className="max-w-full w-[340px] h-96 ">
        <Tabs
          fullWidth
          aria-label="Выбор авторизации"
          selectedKey={selected}
          onSelectionChange={(key) => handleTabChange(key as IAuthAction)}
        >

          <Tab key={IAuthAction.login} title="Войти">
            <LoginForm/>
            <p className="mt-4 text-center text-small">
              Не зарегистрированы?{' '}
              <Link size="sm" as={RLink} to={routes.auth.register()}  className="cursor-pointer">
                Регистрация
              </Link>
            </p>
          </Tab>
          <Tab key={IAuthAction.register} title="Зарегестрироваться">
            <RegisterForm/>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}
