import { ReactNode, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tooltip,
  useDisclosure,
} from '@nextui-org/react';
import { FieldValues, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { contactsQueries } from '@entities/contacts';
import { userQueries } from '@entities/user';
import { ChangeContactsDto, ChangeContactsDtoSchema } from '@features/change-contacts';
import { addServerErrors, isErrorWithValidationErrors } from '@shared/lib/zod';

export function ChangePhoneWrapper({ children  }: { children: ({ onOpen }: { onOpen: () => void }) => ReactNode }) {
  const { onOpen, isOpen, onClose } = useDisclosure();
  return (
    <>
      {children({ onOpen })}
      {isOpen && (<ChangePhoneModal isOpen={isOpen} onClose={onClose}/>)}
    </>
  );
}

function ChangePhoneModal({ isOpen, onClose }:{ isOpen:boolean, onClose:()=>void }) {
  const navigate = useNavigate();
  const user = userQueries.userService.getCache();
  const { register, handleSubmit, setFocus, setError, formState:{ errors } } = useForm<ChangeContactsDto>({
    resolver: zodResolver(ChangeContactsDtoSchema),
    defaultValues: { username: user?.username, phone: user?.contacts.phone, email: user?.contacts.email },
  });
  const { mutate:changeContact, data, error } = contactsQueries.useChangeContacts();
  const onSubmit = (data: FieldValues)=>{
    if (data.phone === user?.contacts.phone) {
      return setFocus('phone', { shouldSelect:true });
    }
    changeContact(data as { username:number, email:string, phone:string });
  };
  useEffect(() => {
    if (data) {
      navigate(0);
    }
  }, [data]);
  useEffect(() => {
    if (error && isErrorWithValidationErrors(error)) addServerErrors(error.validationErrors, setError);
    else if (error) {
      toast.error(`${error.response?.message || error.explanation}`);
    }
  }, [setError, error]);
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        {(onClose) => (
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader className="flex flex-col gap-1">
              Изменить телефон
            </ModalHeader>
            <ModalBody>
              <Tooltip content="Вводите новую почту в это поле" size="sm" color="primary" showArrow offset={30}
                       placement="top-end">
                <Input {...register('phone')} errorMessage={errors?.phone?.message} defaultValue={user?.contacts.phone} label="Телефон"
                       placeholder="Начните вводить" />
              </Tooltip>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Закрыть
              </Button>
              <Button
                color="primary"
                type="submit"
              >
                Сохранить
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
}