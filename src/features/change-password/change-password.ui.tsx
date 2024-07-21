import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@nextui-org/react';
import { EyeFilledIcon, EyeSlashFilledIcon } from '@nextui-org/shared-icons';
import { FieldValues, useForm } from 'react-hook-form';
import { IoLockOpenOutline } from 'react-icons/io5';
import { toast } from 'react-toastify';
import { userQueries } from '@entities/user';
import { ChangePasswordDto, ChangePasswordDtoSchema } from './change-password.zod';

export function ChangePassword() {
  const user = userQueries.userService.getCache();
  const { onOpen, isOpen, onOpenChange, onClose } = useDisclosure();
  const [isVisible, setIsVisible] = useState(false);
  const { mutate:changePassword, isPending, error, isError, data } = userQueries.useChangePassword();
  // TODO перевести бэк часть на zod validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordDto>({ resolver:zodResolver(ChangePasswordDtoSchema) });
  const toggleVisibility = () => setIsVisible(!isVisible);
  const onSubmit = (data:FieldValues) => {
    const formedData = { username:user?.username || 0, password:data.oldPassword ?? '', newPassword:data.password ?? ''  };
    changePassword(formedData);
  };
  useEffect(() => {
    if (isError) toast.error(error.response.message || 'Неизвестная ошибка');
    if (data && !isError) {
      console.log(data);
      toast.success('Пароль успешно изменён 🎉');
      onClose();
    }
  }, [isError, data]);
  return (
    <>
      <Button onPress={onOpen} startContent={<IoLockOpenOutline />}>
        Изменить пароль
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <form onSubmit={handleSubmit(onSubmit)}>
              <ModalHeader className="flex flex-col gap-1">
                Изменить пароль
              </ModalHeader>
              <ModalBody>
                <Input
                  {...register('oldPassword')}
                  errorMessage={errors.oldPassword && String(errors.oldPassword?.message)}
                  endContent={
                    <button
                      className="focus:outline-none"
                      type="button"
                      onClick={toggleVisibility}
                    >
                      {isVisible ? (
                        <EyeSlashFilledIcon className="pointer-events-none text-2xl text-default-400" />
                      ) : (
                        <EyeFilledIcon className="pointer-events-none text-2xl text-default-400" />
                      )}
                    </button>
                  }
                  type={isVisible ? 'text' : 'password'}
                  placeholder="Введите старый пароль"
                  label="Старый пароль"
                />
                <Input
                  {...register('password')}
                  endContent={
                    <button
                      className="focus:outline-none"
                      type="button"
                      onClick={toggleVisibility}
                    >
                      {isVisible ? (
                        <EyeSlashFilledIcon className="pointer-events-none text-2xl text-default-400" />
                      ) : (
                        <EyeFilledIcon className="pointer-events-none text-2xl text-default-400" />
                      )}
                    </button>
                  }
                  errorMessage={errors.password && String(errors.password?.message)}
                  type={isVisible ? 'text' : 'password'}
                  placeholder="Введите новый пароль"
                  label="Новый пароль"
                />
                <Input
                  {...register('confirmPassword')}
                  endContent={
                    <button
                      className="focus:outline-none"
                      type="button"
                      onClick={toggleVisibility}
                    >
                      {isVisible ? (
                        <EyeSlashFilledIcon className="pointer-events-none text-2xl text-default-400" />
                      ) : (
                        <EyeFilledIcon className="pointer-events-none text-2xl text-default-400" />
                      )}
                    </button>
                  }
                  errorMessage={errors.confirmPassword && String(errors.confirmPassword?.message)}
                  type={isVisible ? 'text' : 'password'}
                  placeholder="Повторите пароль"
                  label="Повторите пароль"
                />
              </ModalBody>
              <ModalFooter>
                <div className="flex gap-2">
                  <Button
                    color="danger"
                    variant="light"
                    onPress={onClose}
                  >
                    Закрыть
                  </Button>
                  <Button
                    type="submit"
                    isLoading={isPending}
                    color="success"
                    variant="bordered"
                  >
                    Сохранить
                  </Button>
                </div>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal></>
  );
}

