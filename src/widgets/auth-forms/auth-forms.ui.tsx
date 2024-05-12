import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Card, CardBody, CardFooter, Input, Progress } from '@nextui-org/react';
import { FieldValues, useForm } from 'react-hook-form';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';
import { toast } from 'react-toastify';
import { sessionContracts, sessionTypes, sessionQueries } from '@entities/session';
import { addServerErrors, isErrorWithValidationErrors } from '@shared/lib/zod';
import { cn } from '@shared/ui';

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<sessionTypes.TLoginUserDto>({ resolver: zodResolver(sessionContracts.LoginUserDtoSchema) });

  const { mutate: loginUser, error } = sessionQueries.useLoginUserMutation();

  const [isVisiblePassword, setIsVisiblePassword] = useState<boolean>(false);

  function toggleVisibility() {
    return setIsVisiblePassword((isVisiblePassword) => !isVisiblePassword);
  }

  const onSubmit = async (user: sessionTypes.TLoginUserDto) => {
    loginUser({ user });
  };

  useEffect(() => {
    if (error && isErrorWithValidationErrors(error)) addServerErrors(error.validationErrors, setError);
    else if (error) {
      toast.error(`${error.response?.message || error.explanation}`);
    }
  }, [setError, error]);
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardBody className="flex flex-col gap-4">
          <Input
            {...register('username')}
            isRequired={!!errors.username}
            errorMessage={errors.username && String(errors.username?.message)}
            type="number"
            label="Логин"
            placeholder="Введите ИНН/Лицевой счет"
          />
          <Input
            {...register('password')}
            isRequired={!!errors.password}
            errorMessage={errors.password && String(errors.password?.message)}
            type={isVisiblePassword ? 'text' : 'password'}
            label="Пароль"
            placeholder="Введите пароль"
            endContent={
              <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                {isVisiblePassword ? <IoMdEyeOff className="icons-default" /> : <IoMdEye className="icons-default" />}
              </button>
            }
          />
        </CardBody>
        <CardFooter>
          <Button
            isLoading={isSubmitting}
            spinnerPlacement="start"
            type="submit"
            color="primary"
            variant="solid"
            fullWidth
          >
            {isSubmitting ? '' : 'Войти'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}

export function RegisterForm() {
  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<sessionTypes.TRegisterUserDto>({ resolver: zodResolver(sessionContracts.RegisterUserDtoSchema) });

  const [step, setStep] = useState(0);
  const handleNextStep = async () => {
    if (step === registerTabs.length - 1) return;
    const validationTabResult = await Promise.all(
      registerTabs[step].map((tab) => trigger(tab.name as keyof sessionTypes.TRegisterUserDto)),
    );
    if (validationTabResult.includes(false)) return;
    return setStep(step + 1);
  };

  const handlePrevStep = () => {
    if (step === 0) return;
    setStep(step - 1);
  };

  async function onSubmit(data: FieldValues) {
    if (step < registerTabs.length - 1) return handleNextStep();
    console.log(data);
    return true;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardBody>
          <Progress size="md" className="pb-4" value={step * 34} aria-label="Прогресс" />
          {registerTabs.map((tab, index) => (
            <div className={cn('flex flex-col gap-4', step !== index && 'hidden')}>
              {tab.map((slot) => {
                if (slot.item === 'component') return slot.component;
                if (slot.item === 'input')
                  return (
                    <Input
                      key={slot.name}
                      {...register(slot.name as keyof sessionTypes.TRegisterUserDto)}
                      isRequired={!!errors[slot.name as keyof sessionTypes.TRegisterUserDto]}
                      errorMessage={
                        errors[slot.name as keyof sessionTypes.TRegisterUserDto] &&
                        String(errors[slot.name as keyof sessionTypes.TRegisterUserDto]?.message)
                      }
                      type={slot.type}
                      label={slot.label}
                      placeholder={slot.placeholder}
                    />
                  );
                return null;
              })}
            </div>
          ))}
        </CardBody>
        <CardFooter className="justify-between gap-2">
          <Button
            disabled={step === 0}
            variant="bordered"
            color={step === 0 ? 'default' : 'primary'}
            onPress={handlePrevStep}
          >
            Назад
          </Button>
          <div className={cn(step === registerTabs.length - 1 && 'hidden')}>
            <Button variant="bordered" color="primary" type="button" onPress={handleNextStep}>
              Далее
            </Button>
          </div>
          <div className={cn(step !== registerTabs.length - 1 && 'hidden')}>
            <Button
              variant="solid"
              fullWidth
              color="primary"
              type="submit"
              isLoading={isSubmitting}
              spinnerPlacement="start"
            >
              Зарегистрироваться
            </Button>
          </div>
        </CardFooter>
      </Card>
    </form>
  );
}

const registerTabs = [
  [
    {
      item: 'input',
      name: 'username',
      type: 'string',
      label: 'Логин',
      placeholder: 'Введите ИНН/Лицевой счет',
    },
    {
      item: 'input',
      name: 'phone',
      type: 'phone',
      label: 'Телефон',
      placeholder: 'Введите телефон',
    },
    {
      item: 'input',
      name: 'email',
      type: 'email',
      label: 'Почта',
      placeholder: 'Введите почту',
    },
  ],
  [
    {
      item: 'input',
      name: 'uname',
      type: 'string',
      label: 'Имя',
      placeholder: 'Введите имя',
    },
    {
      item: 'input',
      name: 'surname',
      type: 'string',
      label: 'Фамилия',
      placeholder: 'Введите фамилию',
    },
    {
      item: 'input',
      name: 'patronymic',
      type: 'string',
      label: 'Отчество ( при наличии )',
      placeholder: 'Введите отчество',
    },
  ],
  [
    {
      item: 'component',
      component: <Input label="Он вставлен в маппинге" placeholder="Кастомный компонент" />,
    },
    {
      item: 'input',
      name: 'password',
      type: 'password',
      label: 'Пароль',
      placeholder: 'Введите пароль',
    },
    {
      item: 'input',
      name: 'confirmPassword',
      type: 'password',
      label: 'Пароль еще раз',
      placeholder: 'Повторите пароль',
    },
  ],
];
