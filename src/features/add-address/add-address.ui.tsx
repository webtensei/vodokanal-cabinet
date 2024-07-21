import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Autocomplete,
  AutocompleteItem, Button, Checkbox, Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tab,
  Tabs,
} from '@nextui-org/react';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { addressContracts, addressQueries, addressTypes } from '@entities/address';
import { streetsService } from '@entities/address/address.queries';

// TODO: перенести на rendererItem pattern
export function AddAddress({ modalState, changeModalState, modifyFunc, isDismissable = true }: {
  modalState: boolean,
  changeModalState: (isOpen: boolean) => void,
  modifyFunc: () => void,
  isDismissable?: boolean
}) {

  const [step, setStep] = useState(0);
  return (
    <Modal isOpen={modalState} onOpenChange={changeModalState} isDismissable={isDismissable}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {step === 2 ? 'Выберите себя' : 'Добавление адреса'}
            </ModalHeader>
            {step === 0 && (<FindAddressForm onClose={onClose} />)}
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

function FindAddressForm({ onClose }:{ onClose:()=>void }) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<addressTypes.FindAddressDto>({
    resolver: zodResolver(addressContracts.FindAddressDtoSchema),
    defaultValues: { isPrivateHouse: false },
  });
  const { mutate: getStreets, isPending, error:fetchStreetsError, isSuccess } = addressQueries.useFetchKnownStreets();
  const streets = streetsService.getCache();
  useEffect(() => {
    getStreets();
  }, []);
// TODO флаг ошибки и повторение запроса
  useEffect(() => {
    if (fetchStreetsError || !fetchStreetsError && isSuccess && !streets?.length) {
      toast.error('Не удалось получить список улиц');
    }
  }, [fetchStreetsError, streets]);

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
          disabledKeys={['BUSINESS']}
        >
          <Tab key="CITIZEN" title="Жилой дом / квартира" />
          <Tab key="BUSINESS" title="Коммерческое здание" />
        </Tabs>
        <Autocomplete
          {...register('street')}
          errorMessage={errors.street && String(errors.street?.message)}
          label="Улица"
          placeholder="Начните вводить"
          defaultItems={streets && streets.length ? streets : []}
          isLoading={isPending}
          isRequired
        >
          {(item) => <AutocompleteItem key={item.id}>{item.name}</AutocompleteItem>}
        </Autocomplete>
        <Input
          {...register('house')}
          errorMessage={errors.house && String(errors.house?.message)}
          placeholder="Введите дом"
          label="Дом"
          isRequired
        />
        <Input
          {...register('apartment')}
          errorMessage={errors.apartment && String(errors.apartment?.message)}
          placeholder="Введите квартиру"
          label="квартира"
          isRequired={!watch('isPrivateHouse')}
          isDisabled={watch('isPrivateHouse')}
        />
        <Controller
          control={control}
          name='isPrivateHouse'
          render={({ field: { onChange, value } }) => (
            <Checkbox defaultSelected onChange={onChange} isSelected={value}>
              Частный дом/нет квартиры
            </Checkbox>
          )}
        />
      </ModalBody>
      <ModalFooter>
        <div className='flex gap-2'>
          <Button color='danger' variant='light' onPress={onClose}>
            Закрыть
          </Button>
          <Button
            isLoading={isSubmitting}
            color="primary"
            type="submit"
          >
            Продолжить
          </Button>
        </div>
      </ModalFooter>
    </form>
  );
}