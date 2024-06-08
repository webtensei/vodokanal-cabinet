import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Autocomplete,
  AutocompleteItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tab,
  Tabs,
} from '@nextui-org/react';
import { FieldValues, useForm } from 'react-hook-form';
import { addressContracts, addressQueries, addressTypes } from '@entities/address';
import { streetsService } from '@entities/address/address.queries';

export function AddAddress({ modalState, changeModalState, modifyFunc, isDismissable = false }: {
  modalState:boolean,
  changeModalState: (isOpen: boolean) => void,
  modifyFunc: () => void,
  isDismissable?: boolean
}) {

  const [step, setStep] = useState(0);
  return (
    <Modal isOpen={modalState} onOpenChange={changeModalState} isDismissable={isDismissable}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {step === 2 ? 'Выберите себя' : 'Добавление адреса'}
            </ModalHeader>
             {step === 0 && (<FindAddressForm />)}
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

function FindAddressForm() {
  const [type, setType] = useState<'BUSINESS' | 'CITIZEN'>('CITIZEN');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<addressTypes.FindAddressDto>({ resolver: zodResolver(addressContracts.FindAddressDtoSchema) });
  const { mutate: getStreets } = addressQueries.useFetchKnownStreets();
  const streets = streetsService.getCache();
  useEffect(() => {
    getStreets();
  }, []);

  async function onSubmit(data: FieldValues) {
    console.log(data);
    return true;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ModalBody>
        <Tabs
          {...register('type')}
          aria-label="Выбор типа здания"
          color="primary"
          selectedKey={type}
          onSelectionChange={(key) => setType(key as 'BUSINESS' | 'CITIZEN')}
          disabledKeys={['BUSINESS']}
        >
          <Tab key="CITIZEN" title="Жилой дом / квартира" />
          <Tab key="BUSINESS" title="Коммерческое здание" />
        </Tabs>
        <Autocomplete
          {...register('street')}
          isRequired
          label="Улица"
          defaultItems={streets}
          isLoading={!streets}
          placeholder="Начните вводить"
          defaultSelectedKey="cat"
          className="max-w-xs"
        >
          {(item) => <AutocompleteItem key={item.id}>{item.name}</AutocompleteItem>}
        </Autocomplete>
      </ModalBody>
      <ModalFooter />
    </form>
  );
}