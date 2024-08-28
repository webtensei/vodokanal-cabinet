import { Button, Card, CardHeader, Chip, Input } from '@nextui-org/react';
import { MdCancel, MdCheckCircle } from 'react-icons/md';
import { userQueries } from '@entities/user';
import { ChangeEmailWrapper, ChangePhoneWrapper } from '@features/change-contacts';

export function Contacts() {
  const user = userQueries.userService.getCache();
  return (
    <Card data-element="contacts">
      <CardHeader className="font-bold">Контакты</CardHeader>
      <div className="flex flex-col gap-2 px-4 pb-4">
        <div className="flex flex-col gap-1">
          <Chip
            variant="light"
            size="sm"
            startContent={
              user?.contacts.email_activated ? (
                <MdCheckCircle />
              ) : (
                <MdCancel />
              )
            }
            color={user?.contacts.email_activated ? 'success' : 'danger'}
          >
            {user?.contacts.email_activated
              ? `Активирована ${new Date(
                user?.contacts.email_activated_at as Date,
              ).toLocaleDateString('ru-RU', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })}`
              : 'Не активирована'}
          </Chip>

          <div className="relative flex flex-row gap-2">
            <Input
              isReadOnly
              variant="bordered"
              type="email"
              fullWidth
              label="Почта"
              defaultValue={user?.contacts.email}
              className="max-w-full"
            />
            <ChangeEmailWrapper>
              {({ onOpen }) => <Button onPress={onOpen} className="absolute right-0 h-full rounded-l-none">Изменить</Button>}
            </ChangeEmailWrapper>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <Chip
            variant="light"
            size="sm"
            startContent={
              user?.contacts.phone_activated ? (
                <MdCheckCircle />
              ) : (
                <MdCancel />
              )
            }
            color={user?.contacts.phone_activated ? 'success' : 'danger'}
          >
            {user?.contacts.phone_activated
              ? `Активирован ${new Date(
                user?.contacts.phone_activated_at as Date,
              ).toLocaleDateString('ru-RU', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })}`
              : 'Не активирован'}
          </Chip>

          <div className="relative flex flex-row gap-2">
            <Input
              isReadOnly
              variant="bordered"
              type="phone"
              fullWidth
              label="Телефон"
              defaultValue={user?.contacts.phone}
              className="max-w-full"
            />
            <ChangePhoneWrapper>
              {({ onOpen }) => <Button onPress={onOpen} className="absolute right-0 h-full rounded-l-none">Изменить</Button>}
            </ChangePhoneWrapper>
          </div>
        </div>
      </div>
    </Card>

  );
}
