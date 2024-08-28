import { useEffect, useState } from 'react';
import {
  Button,
  Chip,
  Modal, ModalBody, ModalContent,
  ModalFooter, ModalHeader,
  Radio, RadioGroup,
  Link as NLink,
  useDisclosure,
} from '@nextui-org/react';
import { useAnimation, motion } from 'framer-motion';
import { FaAngleRight } from 'react-icons/fa6';
import { IoAddCircleOutline } from 'react-icons/io5';
import { TbLogout2, TbSelector } from 'react-icons/tb';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { addressModel, addressQueries } from '@entities/address';
import { Address } from '@entities/address/address.types';
import { sessionQueries } from '@entities/session';
import { userService } from '@entities/user/user.queries';
import { AddAddressWrapper } from '@features/add-address';
import { routes } from '@shared/lib/react-router';
import { cn } from '@shared/ui';


export function Navbar() {
  const [isOpen, setOpen] = useState(false);
  const path01Controls = useAnimation();
  const path02Controls = useAnimation();
  const path01Variants = {
    open: { d: 'M3.06061 2.99999L21.0606 21' },
    closed: { d: 'M0 9.5L24 9.5' },
  };
  const path02Variants = {
    open: { d: 'M3.00006 21.0607L21 3.06064' },
    moving: { d: 'M0 14.5L24 14.5' },
    closed: { d: 'M0 14.5L15 14.5' },
  };
  const handleMenuChange = async () => {
    // change the internal state
    setOpen(!isOpen);

    // start animation
    if (!isOpen) {
      await path02Controls.start(path02Variants.moving);
      path01Controls.start(path01Variants.open);
      path02Controls.start(path02Variants.open);
    } else {
      path01Controls.start(path01Variants.closed);
      await path02Controls.start(path02Variants.moving);
      path02Controls.start(path02Variants.closed);
    }
  };
  return (
    <>
      <div
        className=" md:w-72 md:max-w-72 fixed w-full z-20 top-0 start-0 backdrop-blur md:backdrop-blur-none md:static">
        <div className={cn(isOpen && ' backdrop-blur absolute top-0 left-0 h-[100vh] w-full bg-gray-100 opacity-90')} />

        <header
          className="md:hidden sticky top-0  flex h-12 w-full items-center border-b-default border-b-2">
          <Button isIconOnly variant="light" onPress={handleMenuChange}>
            <svg width="24" height="24" viewBox="0 0 24 24">
              <motion.path
                {...path01Variants.closed}
                animate={path01Controls}
                transition={{ duration: 0.2 }}
                stroke="currentColor"
              />
              <motion.path
                {...path02Variants.closed}
                animate={path02Controls}
                transition={{ duration: 0.2 }}
                stroke="currentColor"
              />
            </svg>
          </Button>
        </header>
        <div
          className={cn('md:flex mt-2 md:mt-0 flex-col gap-y-2 md:bg-inherit', isOpen ? 'absolute h-full z-[9999] w-full' : 'hidden')}>
          <ProfileCard />
          <AddressButton />
          <MenuCard />
          <BetaModeNotification />

        </div>

      </div>
      <div className="mb-10 md:hidden" />

    </>
  )
    ;
}

function ProfileCard() {
  const user = userService.getCache();
  const { mutate: logout, error } = sessionQueries.useLogoutUserMutation();
  useEffect(() => {
    if (error) toast.error(`Не удалось выйти, ${error}`);
  }, [error]);
  return (
    <div className="flex flex-row gap-2 mb-2 md:mb-0">
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
        <p className=" font-semibold truncate">{`${user?.name} ${user?.surname[0]}.`}</p>
      </Button>
    </div>
  );
}

function AddressButton() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [addAddressModalState, setAddAddressModalState] = useState<boolean>(false);
  const { addresses, addAddress: handleNewAddress } = addressModel.useAddresses();
  const { selectedAddress, setSelectedAddress, fetchAddress } = addressModel.useSelectedAddress();
  const { mutateAsync: addAddressRequest, isPending } = addressQueries.useAddAddress();
  const user = userService.getCache();
  const changeAddress = (id: string) => {
    const newAddress = addresses && addresses.filter((address) => address.id === id);
    setSelectedAddress(newAddress?.[0] || null);
  };
  useEffect(() => {
    fetchAddress();
  }, []);

  const addAddress = async (address: Omit<Address, 'username' | 'id'>) => {
    if (!user) return toast.error('Ошибка при обработке пользователя');
    const configuredAddress = { ...address, username: user.username };
    await addAddressRequest({ address: configuredAddress })
      .then((data) =>
        handleNewAddress(data))
      .catch((e) => toast.error(e));

  };
  return (
    <>

      <Button onPress={onOpen} fullWidth startContent={<TbSelector />}>
        Выбрать адрес
      </Button>

      <Modal className={cn(addAddressModalState ? 'invisible' : 'visible')} backdrop="opaque" isOpen={isOpen}
             onClose={onClose}>
        <ModalContent>
          {(onClose) => (
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
              <ModalFooter>
                <Button variant="light" color="danger" onPress={onClose}>Закрыть</Button>
                {/* TODO: ТЕПЕРЬ ОБРАБОТКУ ДОБАВЛЕНИЯ НОВОГО АДРЕСА ДОБАВИТЬ */}
                <AddAddressWrapper setDisclosureState={setAddAddressModalState} modifyFunc={(address) => {
                  addAddress(address);
                }}>
                  {({ onOpen }) => (
                    <Button isLoading={isPending} onPress={onOpen} color="primary" variant="light"
                            startContent={<IoAddCircleOutline />}>Добавить
                      адрес</Button>)}
                </AddAddressWrapper>
              </ModalFooter>
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
      name: 'Услуги и оплата',
      href: routes.services.root(),
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

  const { pathname } = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="shadow-none gap-2 flex flex-col">
      {links?.length && links.map((link) => (
        <NLink
          key={`${link.name}+ ${link.href}`}
          href="#"
          color={pathname === link.href ? 'primary' : 'foreground'}
          onPress={() => navigate(link.href)}
          isBlock
        >
          {link.name}
        </NLink>
      ))}
    </nav>
  );
}

function BetaModeNotification() {
  return (
    <div id="dropdown-cta" className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-900" role="alert">
      <div className="flex items-center mb-3">
        <Chip variant="flat" color="warning">Бета</Chip>
        <button type="button"
                className="ms-auto -mx-1.5 -my-1.5 bg-blue-50 inline-flex justify-center items-center w-6 h-6 text-blue-900 rounded-lg focus:ring-2 focus:ring-blue-400 p-1 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-400 dark:hover:bg-blue-800"
                data-dismiss-target="#dropdown-cta" aria-label="Close">
          <span className="sr-only">Close</span>
          <svg className="w-2.5 h-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
               viewBox="0 0 14 14">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
          </svg>
        </button>
      </div>
      <p className="mb-3 text-sm text-blue-800 dark:text-blue-400 text-justify">
        Приложение находится на стадии бета-тестирования. Все вопросы и предложения следует отправлять на телеграмм
        аккаунт <strong>@webtensei</strong>
      </p>
      <a
        className="text-sm text-blue-800 underline font-medium hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
        href="https://t.me/webtensei" target="_blank" rel="noreferrer">Написать разработчику</a>
    </div>
  );
}