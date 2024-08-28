import {
  Code,
} from '@nextui-org/react';
import { addressModel } from '@entities/address';
import { BusinessMeterTable, CitizenMeterTable } from '@widgets/meter-tables';

export function MetersPage() {
  const { selectedAddress, isReady } = addressModel.useSelectedAddress();

  if (!selectedAddress && isReady) {
    return (
      <div className="px-2 pb-8 md:px-0 md:pb-0 flex w-full flex-col gap-4 md:flex-row">
        <Code color="danger" className="text-medium">Вы не выбрали адрес в левом меню</Code>
      </div>
    );
  }

  // @ts-ignore
  return (
    <div className="flex w-full flex-col gap-4">
      {selectedAddress?.type === 'CITIZEN' && (
        <CitizenMeterTable />
      )}
      {selectedAddress?.type === 'CITIZEN' && (
        <BusinessMeterTable />
      )}
    </div>
  );
}
