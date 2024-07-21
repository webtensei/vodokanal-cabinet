import { useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Modal, ModalBody, ModalContent,
  ModalFooter, ModalHeader,
  Radio, RadioGroup,
  useDisclosure,
} from '@nextui-org/react';
import { FaAngleRight } from 'react-icons/fa6';
import { TbLogout2, TbSelector } from 'react-icons/tb';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { addressModel, addressHelpers } from '@entities/address';
import { sessionQueries } from '@entities/session';
import { userService } from '@entities/user/user.queries';
import { AddAddress } from '@features/add-address';
import { routes } from '@shared/lib/react-router';
import { cn } from '@shared/ui';


export function Navbar() {
  const user = userService.getCache();
  return (
    <div className="flex flex-col gap-y-4 md:w-72 md:max-w-72">
      <ProfileCard />
      {user?.role === 'USER' && (<AddressCard />)}
      <MenuCard />
    </div>
  );
}

function ProfileCard() {
  const user = userService.getCache();
  const { mutate: logout, error } = sessionQueries.useLogoutUserMutation();
  useEffect(() => {
    if (error) toast.error(`Не удалось выйти, ${error}`);
  }, [error]);
  return (
    <Card className="p-2 gap-2 text-center rounded-none md:rounded-large">
      <p className=" font-semibold">{`${user?.name} ${user?.surname}`}</p>
      <div className="flex flex-row gap-2">
        <Button
          size="md"
          color="danger"
          variant="flat"
          isIconOnly
          onPress={() => logout()}
        >
          <TbLogout2 />
        </Button>
        <Button
          size="md"
          color="primary"
          variant="flat"
          as={Link}
          fullWidth
          to="/profile"
          endContent={<FaAngleRight />}
        >
          Профиль
        </Button>
      </div>

    </Card>
  );
}

function AddressCard() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [createAddressState, setCreateAddressState] = useState<boolean>(false);
  const { addresses } = addressModel.useAddresses();
  const { selectedAddress, setSelectedAddress } = addressModel.useSelectedAddress();
  const changeAddress = (id: string) => {
    const newAddress = addresses && addresses.filter((address) => address.id === id);
    setSelectedAddress(newAddress?.[0] || null);
  };
  const createAddress = () => {

  };
  return (
    <>
      <Card>
        <CardHeader>
          Адрес
          <Button
            variant="light"
            color="primary"
            className="absolute right-2 top-2"
            onPress={() => setCreateAddressState(true)}
            size="sm"
          >
            Добавить адрес
          </Button>
          <AddAddress modalState={createAddressState} changeModalState={setCreateAddressState}
                      modifyFunc={createAddress} />
        </CardHeader>
        <CardBody className="px-3 py-0">
          {selectedAddress ? (
            <p className="capitalize">
              {addressHelpers.createFullAddress(selectedAddress)}
            </p>
          ) : (
            'Не нашли адрес'
          )}
        </CardBody>
        <CardFooter className="flex flex-row gap-2">
          {addresses && addresses.length > 1 && (
            <Button onPress={onOpen} fullWidth startContent={<TbSelector />}>
              Выбрать другой
            </Button>
          )}
        </CardFooter>
      </Card>
      <Modal backdrop="opaque" isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Выбор активного адреса
              </ModalHeader>
              <ModalBody>
                <RadioGroup
                  value={(selectedAddress && selectedAddress.id) ?? undefined}
                  onValueChange={(address) => {
                    changeAddress(address);
                    onClose();

                  }}
                >
                  {addresses &&
                    addresses.map((address) => (
                      <Radio
                        key={address.id}
                        value={address.id}
                        description={`дом ${address.house}${
                          address?.apartment
                            ? `, квартира ${address.apartment}`
                            : ''
                        }`}
                        classNames={{
                          base: cn(
                            'inline-flex m-0 border-content2   bg-content1 hover:bg-content2 items-center justify-between',
                            'flex-row-reverse max-w-[100%] cursor-pointer rounded-lg gap-4 p-4 border-2 border-content2',
                            'data-[selected=true]:border-primary',
                          ),
                        }}
                      >
                        {address.street}
                      </Radio>
                    ))}
                </RadioGroup>
              </ModalBody>
              <ModalFooter />
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

function MenuCard() {
  const user = userService.getCache();
  const [links, setLinks] = useState<{ name: string, href: string }[] | null>(null);
  const userLinks = [{
    name: 'Приборы учета',
    href: routes.meters.root(),
  },
    {
      name: 'История показаний',
      href: routes.indications.root(),
    },
    {
      name: 'История оплаты',
      href: routes.payments.root(),
    }];

  const adminLinks = [
    {
      name: 'Управление пользователями',
      href: routes.admin.users.root(),
    },
    {
      name: 'Массовая рассылка',
      href: routes.admin.massMailing.root(),
    },
    {
      name: 'Глобальные настройки',
      href: routes.admin.settings.root(),
    }];
  useEffect(() => {
    if (user?.role === 'USER') {
      setLinks(prevState => prevState?.length ? [...prevState, ...userLinks] : [...userLinks]);
    }
    if (user?.role === 'ADMIN') {
      setLinks(prevState => prevState?.length ? [...prevState, ...adminLinks] : [...adminLinks]);
    }
  }, [user]);
  useEffect(() => {
    console.log(links);

  }, [links]);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  return (
    <Card as="nav" className="rounded-none md:rounded-large">
      <CardHeader>Навигация</CardHeader>
      <CardFooter className="flex flex-col gap-2 px-0">
        {links?.length && links.map((link) => (
          <Button
            key={`${link.name}+ ${link.href}`}
            color={pathname === link.href ? 'primary' : 'default'}
            variant={pathname === link.href ? 'flat' : 'light'}
            fullWidth
            className="justify-start rounded-none"
            onPress={() => navigate(link.href)}
          >
            {link.name}{' '}
          </Button>
        ))}
      </CardFooter>
    </Card>
  );
}
