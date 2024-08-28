import { useEffect, useState } from 'react';
import { Button, Card, CardFooter, CardHeader, ScrollShadow, Spinner, Tooltip } from '@nextui-org/react';
import { InfoIcon } from '@nextui-org/shared-icons';
import { sessionQueries, sessionTypes } from '@entities/session';
import { AuthenticatedDevicesWrapper } from '@features/authenticated-devices';

export function LoginHistory() {
  const [history, setHistory] = useState<sessionTypes.LoginHistory[] | []>([]);
  const { mutate: getHistory, data, isError, isPending } = sessionQueries.useLoginHistory();
  useEffect(() => {
    getHistory();
  }, [getHistory]);
  useEffect(() => {
    if (data) {
      setHistory(data ? data.toReversed() : []);
    }
  }, [data]);

  function renderContent() {
    if (isPending) {
      return <Spinner className="h-full" />;
    }

    if (history.length) {
      return history.map((login, index: number) => {
        const time = new Date(login.login_time);
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
        return (
          <div key={login.id}>
            <div className={index === 0 ? 'font-bold text-primary' : 'font-bold text-foreground'}>
              {formattedDate}, {formattedTime}
            </div>
            <div className="text-xs text-gray-600">
              {login.ip_address}, {login.user_agent}
            </div>
          </div>
        );
      });
    }

    if (isError) {
      return (
        <div className="w-full h-full text-center content-center flex flex-col">
          <p className="text-default">Произошла ошибка </p>
          <p className="text-primary cursor-pointer" onClick={() => getHistory()}>Повторить попытку</p>
        </div>
      );
    }

    return <p className="text-gray-600 w-full h-full text-center content-center">История не найдена</p>;
  }

  return (
    <Card>
      <CardHeader className="font-bold justify-between">История авторизаций
        <Tooltip content="Автоматическое удаление истории раз в 3 месяца">
          <Button isIconOnly variant="light"><InfoIcon /></Button>
        </Tooltip>
      </CardHeader>
      <ScrollShadow
        size={100}
        className="flex h-48 w-full flex-col gap-2 p-4"
      >
        {renderContent()}
      </ScrollShadow>

      <CardFooter className="flex flex-row justify-between">
        <AuthenticatedDevicesWrapper>
          {({ onOpen }) =>
          <Button
            variant="light"
            color="primary"
            size="sm"
            onPress={onOpen}
          >
            Авторизированные устройства
          </Button>
        }</AuthenticatedDevicesWrapper>
      </CardFooter>
    </Card>

  );
}

