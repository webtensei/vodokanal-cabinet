import { useEffect, useState } from 'react';
import {
  Button,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
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
    refetch,
  } = meterQueries.useAddressMetersList(selectedAddress?.id as string);

  const columns = [
    { name: 'НАЗВАНИЕ', uid: 'name' },
    { name: 'СЕРИЙНЫЙ НОМЕР', uid: 'num' },
    { name: 'ПОВЕРЕН ДО', uid: 'verify_date' },
    { name: 'ТАРИФ', uid: 'rate' },
    { name: 'ДАТА ПОСЛЕДНИХ ПОКАЗАНИЙ', uid: 'date' },
    { name: 'ПОСЛЕДНИЕ ПОКАЗАНИЯ', uid: 'ind' },
    { name: 'ДЕЙСТВИЯ', uid: 'actions' },
  ];

  const renderCell = (meter: MeterByCitizenAddress, columnKey: React.Key) => {
    switch (columnKey) {
      case 'name':
        return (
          <div className="flex items-center gap-1">
            {meter.name}<GoDotFill className="text-success" />
          </div>
        );
      case 'rate':
        return `${Number(meter.rate) / 100} Руб.`;
      case 'ind':
        return Number(meter.ind) / 100;
      case 'actions':
        return (
          <Button 
            href='#' 
            variant='solid' 
            color='primary' 
            onPress={() => setModalState(meter)}
          >
            Передать показания
          </Button>
        );
      default:
        return meter[columnKey as keyof MeterByCitizenAddress];
    }
  };

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

  return (
    <div>
      <Table 
        removeWrapper 
        aria-label="Meters table" 
        className="overflow-y-auto"
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.uid}>
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody 
          emptyContent="Нет данных о приборах учета."
          items={meters || []}
        >
          {(meter) => (
            <TableRow key={meter.num}>
              {(columnKey) => (
                <TableCell>
                  {renderCell(meter, columnKey)}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      {selectedMeter && (
        <SendIndicationsModal 
          meter={selectedMeter} 
          address={selectedAddress as Address} 
          isOpen={isOpen} 
          closeModal={closeModal}
        />
      )}
    </div>
  );
}

export function BusinessMeterTable() {
  return (
    <div />
  );
}