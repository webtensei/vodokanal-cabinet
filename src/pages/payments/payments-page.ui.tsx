import { useEffect, useState } from 'react';
import {
  Button,
  Code, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Pagination, Popover, PopoverContent, PopoverTrigger,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react';
import { HiOutlineDotsVertical } from 'react-icons/hi';
import { addressModel } from '@entities/address';
import { paymentQueries } from '@entities/payment';
import { cn } from '@shared/ui';

export function PaymentsPage() {
  const { selectedAddress, isReady } = addressModel.useSelectedAddress();
  const paymentTypes = {
    'waiting_for_capture': { color: 'text-warning', text: 'Обработка' },
    'canceled': { color: 'text-danger', text: 'Отклонено' },
    'pending': { color: 'text-warning', text: 'Ожидание' },
    'succeeded': { color: 'text-success', text: 'Успешно' },
  };
  const [page, setPage] = useState(0);

  const {
    data: payments,
    isPending,
    isError,
    refetch,
  } = paymentQueries.usePaymentsByAddressQuery(selectedAddress?.id as string, page);

  useEffect(() => {
    if (selectedAddress) refetch();
  }, [selectedAddress, page]);

  if (!selectedAddress && isReady) {
    return (
      <div className="flex w-full flex-col gap-4 md:flex-row">
        <Code color="danger" className="text-medium">Вы не выбрали адрес в левом меню</Code>
      </div>
    );
  }
  if (isPending) {
    return (
      <Skeleton className="flex w-full flex-col h-24 rounded-large" />
    );
  }

  if (isError) {
    return <div className="flex w-full flex-col gap-4 md:flex-row">
      <Code color="danger" className="text-medium">Произошла ошибка, попробуйте обновить страницу</Code>
    </div>;
  }

  // @ts-ignore
  return (
    <div className="flex w-full flex-col gap-4">
      <Table removeWrapper className="overflow-y-auto">
        <TableHeader>
          <TableColumn>Идентификатор</TableColumn>
          <TableColumn>Сумма</TableColumn>
          <TableColumn>Дата создания</TableColumn>
          <TableColumn>Статус</TableColumn>
          <TableColumn className="text-end">Действия</TableColumn>
        </TableHeader>
        <TableBody emptyContent="Нет истории оплат.">
          {payments.data.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell>
                {payment.id ?? 'Нет идентификатора'}
              </TableCell>
              <TableCell>
                <Popover key={payment.id}
                         showArrow
                         offset={10}
                         placement="bottom-start"

                         backdrop="opaque">
                  <PopoverTrigger>
                    <p
                      className="cursor-pointer text-primary w-full h-full">{payment.total_amount ?? 'Не известно'} ₽</p>
                  </PopoverTrigger>
                  <PopoverContent className="p-1 rounded-lg">
                    <Table removeWrapper
                           bottomContent={<p className='text-default text-center text-sm'>Комиссия: {(Number(payment.total_amount) * Number(payment.comission)).toFixed(2) ?? 'Неизвестно'} ₽</p>}
                    >
                      <TableHeader>
                        <TableColumn>
                          Сервис
                        </TableColumn>
                        <TableColumn>
                          Сумма
                        </TableColumn>
                      </TableHeader>
                      <TableBody>
                        {payment.services_list.map((service, index) => (
                            <TableRow key={service}>
                              <TableCell>{service ?? 'Неизвестно'}</TableCell>
                              <TableCell>{payment.payments_list[index] ?? 'Неизвестно'} ₽</TableCell>
                            </TableRow>

                        ))}
                      </TableBody>
                    </Table>
                  </PopoverContent>
                </Popover>
              </TableCell>
              <TableCell>
                {new Date(payment.created_at).toLocaleDateString('ru-RU', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })}
              </TableCell>
              <TableCell
                className={
                  cn(paymentTypes[payment.status].color)
                }>
                {paymentTypes[payment.status].text}
              </TableCell>
              <TableCell>
                <div className="relative flex justify-end items-center gap-2">
                  <Dropdown>
                    <DropdownTrigger>
                      <Button isIconOnly size="md" className="rounded-lg" variant="light">
                        <HiOutlineDotsVertical />
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu>
                      <DropdownItem>Удалить информацию о платеже</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {payments.meta.lastPage > 1 && (<Pagination showControls total={payments.meta.lastPage} initialPage={page + 1}
                                                  onChange={(page) => setPage(page)} />)}

    </div>
  );
}
