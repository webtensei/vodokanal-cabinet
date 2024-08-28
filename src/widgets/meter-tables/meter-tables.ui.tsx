import { useEffect, useState } from 'react';
import {
  Button,
  Code,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow, useDisclosure,
} from '@nextui-org/react';
import { GoDotFill } from 'react-icons/go';
import { addressModel } from '@entities/address';
import { Address } from '@entities/address/address.types';
import { meterQueries } from '@entities/meter';
import { MeterByCitizenAddress } from '@entities/meter/meter.types';
import { SendIndicationsModal } from '@features/send-indications';

export function CitizenMeterTable() {
  const { selectedAddress } = addressModel.useSelectedAddress();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedMeter, setSelectedMeter] = useState<MeterByCitizenAddress | null>(null);
  const {
    data: meters,
    isPending,
    isError,
    refetch,
  } = meterQueries.useAddressMetersList(selectedAddress?.id as string);
  useEffect(() => {
    if (selectedAddress) refetch();
  }, [selectedAddress]);

  const setModalState = (meter: MeterByCitizenAddress) => {
    setSelectedMeter(meter);
    onOpen();
  };
  const closeModal = () => {
    setSelectedMeter(null);
    onClose();
  };
  if (isPending) {
    return (
      <Skeleton className="flex w-full flex-col h-24 rounded-large" />
    );
  }

  if (isError) {
    return <div className="px-2 pb-8 md:px-0 md:pb-0 flex w-full flex-col gap-4 md:flex-row">
      <Code color="danger" className="text-medium">Произошла ошибка, попробуйте обновить страницу</Code>
    </div>;
  }
  return (
    <div>
      <Table removeWrapper aria-label="Meters table" className="overflow-y-auto">
        <TableHeader>
          <TableColumn>НАЗВАНИЕ</TableColumn>
          <TableColumn>СЕРИЙНЫЙ НОМЕР</TableColumn>
          <TableColumn>ПОВЕРЕН ДО</TableColumn>
          <TableColumn>ТАРИФ</TableColumn>

          <TableColumn>ДАТА ПОСЛЕДНИХ ПОКАЗАНИЙ</TableColumn>
          <TableColumn>ПОСЛЕДНИЕ ПОКАЗАНИЯ</TableColumn>
          <TableColumn>ДЕЙСТВИЯ</TableColumn>
        </TableHeader>
        <TableBody>
          {meters?.map((meter) => (
            <TableRow key={meter.num}>
              <TableCell>
                <div className="flex items-center gap-1">{meter.name}<GoDotFill className="text-success" /></div>
              </TableCell>
              <TableCell>{meter.num}</TableCell>
              <TableCell>{meter.verify_date}</TableCell>
              <TableCell>{Number(meter.rate) / 100} Руб.</TableCell>

              <TableCell>{meter.date}</TableCell>
              <TableCell>{Number(meter.ind) / 100}</TableCell>
              <TableCell><Button href='#' variant='solid' color='primary' className="" onPress={()=>setModalState(meter)}>Передать показания</Button></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {selectedMeter && (
        <SendIndicationsModal meter={selectedMeter} address={selectedAddress as Address} isOpen={isOpen} closeModal={closeModal}/>
      )}
    </div>
  );
}

export function BusinessMeterTable() {
  return (
    <div />
  );
}