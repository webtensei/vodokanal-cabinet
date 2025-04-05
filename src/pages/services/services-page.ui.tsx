import { useEffect, useState } from 'react';
import { Code, Skeleton, Table, TableBody, TableCell, TableHeader, TableRow, TableColumn, Button } from '@nextui-org/react';
import { toast } from 'react-toastify';
import { tokenPayload } from '@/entities/session/session.model';
import { addressModel, addressQueries } from '@entities/address';
import { paymentQueries } from '@entities/payment';
import { cn } from '@shared/ui';

export function ServicesPage() {
  const { selectedAddress } = addressModel.useSelectedAddress();
  const { data: services, refetch, isPending } = addressQueries.useServices(selectedAddress?.id as string);
  const { mutateAsync: createPayment, isPending: isCreatingPayment, error: createPaymentError } = paymentQueries.useCreatePaymentMutation();
  const [selectedToPay, setSelectedToPay] = useState<string[]>([]);
  const [selectionMode, setSelectionMode] = useState<boolean>(false);

  const handleSelectedService = (id) => {
    setSelectedToPay(prevState => {
      const isSelected = prevState.includes(id);
      if (isSelected) {
        return prevState.filter(item => item !== id);
      }
      return [...prevState, id];
    });
  };

  useEffect(() => {
    if (createPaymentError) {
      toast.error(createPaymentError.message as string || 'Ошибка при создании платежа');
    }
  }, [createPaymentError]);

  const handleCreatePayment = async (services: string[], services_amount: string[]) => {
    const amounts = services.map((_service, index) => Math.abs(Number(services_amount[index])));
    const amount = amounts.reduce((acc, curr) => acc + curr, 0);
  
    await createPayment({ 
      addressId: selectedAddress?.id as string, 
      services, 
      services_amount, 
      amount: String(amount), 
      username: tokenPayload().username as number,
    });
  };

  useEffect(() => {
    if (selectedAddress) refetch();
  }, [selectedAddress]);
  
  if (isPending) {
    return (
      <div className="w-full h-full flex flex-col gap-4">
        <Skeleton className="w-full h-28 rounded-large" />
        <Skeleton className="w-full h-52 rounded-large" />
      </div>
    );
  }
  if (!services?.length) {
    return <Code>Не нашли услуги на данном адресе</Code>;
  }
  return (
  
<div className="flex w-full flex-col gap-4">
<Table removeWrapper aria-label='Payments table' className="overflow-y-auto">
  <TableHeader>
    <TableColumn>УСЛУГА</TableColumn>
    <TableColumn>САЛЬДО</TableColumn>
    <TableColumn>ПЕНИ</TableColumn>
    <TableColumn>ОБЩАЯ СУММА ОПЛАТЫ</TableColumn>
    <TableColumn>_</TableColumn>
  </TableHeader>
  <TableBody emptyContent="Нет истории оплаты.">
    {services.map((service) => (
      <TableRow key={service.id}>
        <TableCell>
        {service.name}
        </TableCell>
        <TableCell>
        {Number(service.saldo) / 100}
        </TableCell>
        <TableCell>
        {Number(service.peni) / 100}
        </TableCell>
        <TableCell className={cn(Number(service.saldo) + Number(service.peni) < 0 ? 'text-danger' : 'text-success')}>
        {(Number(service.saldo) + Number(service.peni)) / 100} руб.
        </TableCell>
        <TableCell>
        { (Number(service.peni) + Number(service.saldo) < 0) && 
        <Button color='primary' variant='bordered' onClick={() => handleCreatePayment([service.id], [String(Math.abs(Number(service.peni) + Number(service.saldo)))])}>Оплатить</Button>
        }
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
</div>


  );
}