import { cloneElement, ReactElement, useEffect, useState } from 'react';
import {
  Button, Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader, Spinner,
  useDisclosure,
} from '@nextui-org/react';
import { clsx } from 'clsx';
import { FaRegTrashCan } from 'react-icons/fa6';
import { sessionQueries, sessionTypes } from '@entities/session';

export function AuthenticatedDevicesModal({ rendererItem }: { rendererItem: ReactElement }) {
  const { onOpen, isOpen, onClose } = useDisclosure();
  const [devices, setDevices] = useState<sessionTypes.AuthenticatedDevices[] | []>([]);
  const { mutate: getDevices, data, isError, isPending } = sessionQueries.useAuthenticatedDevices();
  useEffect(() => {
    getDevices();
  }, [getDevices]);
  useEffect(() => {
    if (data) {
      setDevices(data || []);
    }
  }, [data]);
  const currentDate = new Date();
  return (
    <>
      {cloneElement(rendererItem, { onClick: () => onOpen() })}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Авторизированные устройства
                </ModalHeader>
                <ModalBody>
                  {isPending && (<Spinner className="h-full" />)}
                  {isError && !devices && (
                    <div className="w-full h-full text-center content-center flex flex-col">
                      <p className="text-default">Произошла ошибка </p>
                      <p className="text-primary cursor-pointer" onClick={() => getDevices()}>Повторить попытку</p>
                    </div>
                  )}
                  {devices.length &&
                    devices.map((auth, index:number) => {

                      const time = new Date(auth.expired_in);
                      const formattedDate = time.toLocaleDateString('ru-RU', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      });
                      const formattedTime = time.toLocaleTimeString('ru-RU', {
                        hour12: false,
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      });

                      const timeDiff = time.getTime() - currentDate.getTime();
                      const daysDiff = timeDiff / (1000 * 3600 * 24);

                      const isThisSession = navigator.userAgent === auth.user_agent;
                      // там захардкожен цвет истечения, нужно вынести его сюда.
                      return (
                        <div key={auth.id}>
                          <div className='flex flex-row items-center justify-between gap-4'>
                            <div>
                              <p>Сессия № {index + 1} {isThisSession && '(это устройство)'}</p>
                              <p className='text-justify text-sm text-gray-400 dark:text-gray-600'>
                                Устройство: {auth.user_agent}
                              </p>
                              <p
                                className={clsx(
                                  'text-sm',
                                  daysDiff <= 7 && '!text-danger',
                                  daysDiff <= 15 && 'text-warning',
                                  daysDiff > 15 && 'text-success',
                                )}
                              >
                                истекает {formattedDate}, {formattedTime}
                              </p>
                            </div>
                            {!isThisSession &&
                              <Button
                                variant='light'
                                color='danger'
                                isIconOnly
                                size='md'
                                onClick={()=>console.log(auth)}
                              >
                                <FaRegTrashCan />
                              </Button>

                            }
                          </div>
                          {devices.length > 1 && <Divider />}
                        </div>
                      );
                    })}
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Закрыть
                  </Button>
                </ModalFooter>
              </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}