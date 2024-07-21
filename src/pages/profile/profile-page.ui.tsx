import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
} from '@nextui-org/react';
import { userHelpers, userQueries } from '@entities/user';
import { AddressesTable } from '@features/addresses-table';
import { ChangePassword } from '@features/change-password';
import { Contacts } from '@widgets/contacts';
import { LoginHistory } from '@widgets/login-history';

export function ProfilePage() {
  const user = userQueries.userService.getCache();

  return (
    <div className="flex w-full flex-col gap-4 md:flex-row">
      <div className="flex w-full flex-col gap-4 md:w-3/5">
        <Card
          data-element="profile"
          className="col-span-12 h-max md:col-span-8"
        >
          <CardHeader className="font-bold">Профиль</CardHeader>
          <CardBody className="gap-8">
            <div>
              <h3 className="text-xl text-gray-600">Пользователь</h3>
              <Divider />
              <p className="text-large">
                {userHelpers.createFullName(user)}
              </p>
            </div>
            <div>
              <h3 className="text-xl text-gray-600">ИНН/Номер ЛК</h3>
              <Divider />
              <p className="text-large">{user?.username}</p>
            </div>
          </CardBody>
          <CardFooter>
            <ChangePassword />
          </CardFooter>
        </Card>
        <AddressesTable />
      </div>

      <div className="flex w-full flex-col gap-4 md:w-2/5">
        <Contacts />
        <LoginHistory/>
      </div>
    </div>
  );
}
