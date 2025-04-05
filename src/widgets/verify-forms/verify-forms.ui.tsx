import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardBody, CardFooter, CardHeader, Input, Code, Button } from '@nextui-org/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { FiPhone } from 'react-icons/fi';
import { IoMailOutline } from 'react-icons/io5';
import { toast } from 'react-toastify';
import { contactsContracts, contactsTypes, contactsQueries, contactsApi } from '@entities/contacts';
import { userService } from '@entities/user/user.queries';
import { addServerErrors, isErrorWithValidationErrors } from '@shared/lib/zod';
import { ChangeEmailWrapper } from '@features/change-contacts';


export function VerifyPhoneForm() {
  const user = userService.getCache();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<contactsTypes.TSendPhoneVerification>({
    resolver: zodResolver(contactsContracts.PhoneVerificationDtoSchema),
    defaultValues: { type: 'phone', username: user?.username },
  });
  const { mutate: verifyPhone, error } = contactsQueries.useVerifyPhoneMutation();
  const [timer, setTimer] = useState(0);
  const [creationInProcess, setCreationInProgress] = useState(false);
  const [step, setStep] = useState(0);

  const onSubmit: SubmitHandler<contactsTypes.TSendPhoneVerification> = async (data) => {
    const { code, username, type } = data;
    verifyPhone({ code, username, type });
  };
  const sendCode = async () => {
    setCreationInProgress(true);
    contactsApi.createVerification({ type: 'phone' })
      .then((r) => {
        toast.success(`${r.body.message}`);
        setTimer(60);
        const intervalId = setInterval(() => {
          setTimer((prevTimer) => {
            if (prevTimer === 0) {
              clearInterval(intervalId);
              return 0;
            }
            return prevTimer - 1;
          });
        }, 1000);
        if (r.body.status === 200) {
          setStep(1);
        }
      })
      .catch(() => toast.error('Произошла ошибка, попробуйте позже'))
      .finally(() => setCreationInProgress(false));
  };

  useEffect(() => {
    if (error && isErrorWithValidationErrors(error)) addServerErrors(error.validationErrors, setError);
    else if (error) {
      toast.error(`${error.response?.message || error.explanation}`);
    }
  }, [setError, error]);
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="md:w-[350px]">
        <CardHeader className="font-bold">Подтвердите номер</CardHeader>
        <CardBody className="flex flex-col gap-4">
          <Input startContent={<FiPhone />} label="Номер" disabled readOnly value={user && user.contacts.phone} />
          {step === 0 && (
            <p className="w-80 text-justify text-sm">
              На указанный номер поступит звонок в течение короткого времени. Для завершения процесса подтверждения,
              пожалуйста, не отвечайте на звонок и введите 4 последние цифры входящего номера
            </p>
          )}
          {step === 1 && (
            <>
              <Code color="warning">Введите последние 4 цифры входящего</Code>
              <Input
                {...register('code')}
                name="code"
                required
                isRequired
                label="Код"
                type="number"
                maxLength={4}
                minLength={4}
                isInvalid={!!errors}
                errorMessage={errors.code && String(errors.code?.message)}
                placeholder="****"
              />
            </>
          )}
        </CardBody>
        <CardFooter className="justify-between gap-4">
          {step === 0 && (
            <>
              <Button>Изменить номер</Button>
              <Button
                disabled={Boolean(timer)}
                isLoading={Boolean(timer) || creationInProcess}
                color="success"
                onPress={sendCode}
              >
                {timer ? `Повторить через ${timer} с.` : 'Запросить звонок'}
              </Button>
            </>
          )}
          {step === 1 && (
            <>
              <Button
                onPress={() => {
                  setStep(0);
                }}
              >
                Назад
              </Button>
              <Button type="submit" color="success" isLoading={isSubmitting}>
                Отправить
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </form>
  );
}

export function VerifyEmailForm() {
  const [timer, setTimer] = useState<number>(0);
  const [creationInProgress, setCreationInProgress] = useState<boolean>(false);
  const user = userService.getCache();

  const sendCode = async (e) => {
    e.preventDefault();
    setCreationInProgress(true);
    contactsApi.createVerification({ type: 'email' })
      .then((r) => {
        toast.success(`${r.message}`);
        setTimer(60);
        const intervalId = setInterval(() => {
          setTimer((prevTimer) => {
            if (prevTimer === 0) {
              clearInterval(intervalId);
              return 0;
            }
            return prevTimer - 1;
          });
        }, 1000);
      })
      .catch(() => toast.error('Произошла ошибка, попробуйте позже'))
      .finally(() => setCreationInProgress(false));
  };
  return (
    <form onSubmit={sendCode}>
      <Card className="md:w-[350px]">
        <CardHeader className='font-bold'>
          Требуется подтвердить почту
        </CardHeader>
        <CardBody>
          <Input
            startContent={<IoMailOutline />}
            label='Почта'
            disabled
            readOnly
            value={user?.contacts.email}
          />
        </CardBody>
        <CardFooter className='justify-between gap-4'>
          <ChangeEmailWrapper>
            {({ onOpen }) => (
                <Button onPress={onOpen}>Изменить почту</Button>
            )}
          </ChangeEmailWrapper>
          
          <Button
                  disabled={Boolean(timer)}
                  isLoading={Boolean(timer) || creationInProgress}
                  type='submit'
                  color='success'>
            {timer
              ? `Повторить через ${timer} с.`
              : 'Отправить ссылку на почту'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
