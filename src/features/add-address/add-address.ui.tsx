import { ReactNode, useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Autocomplete,
  AutocompleteItem, Button, Checkbox, Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader, Radio, RadioGroup,
  Tab,
  Tabs, useDisclosure,
} from '@nextui-org/react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { toast } from 'react-toastify';
import { addressContracts, addressQueries, addressTypes } from '@entities/address';
import { Address, FindAddressDto } from '@entities/address/address.types';
import { cn } from '@shared/ui';


export function AddAddressWrapper({ children, modifyFunc, isDismissable = true, setDisclosureState }: {
  children: ({ onOpen }: { onOpen: () => void }) => ReactNode,
  modifyFunc: (address: Omit<Address, 'username' | 'id'>) => void,
  isDismissable?: boolean
  setDisclosureState?: (state: boolean) => void
}) {
  const { onOpen, isOpen, onClose, onOpenChange } = useDisclosure();
  useEffect(() => {
    if (setDisclosureState) {
      setDisclosureState(isOpen);
    }
  }, [isOpen, setDisclosureState]);
  return (
    <>
      {children({ onOpen })}
      {isOpen && (
        <AddAddress isDismissable={isDismissable} isOpen={isOpen} onOpenChange={onOpenChange}
                    modifyFunc={(data)=> {
                      modifyFunc(data);
                      onClose();
                    }} />)}
    </>
  );
}

function AddAddress({ isOpen, onOpenChange, modifyFunc, isDismissable }: {

  isOpen: boolean,
  onOpenChange: (isOpen: boolean) => void,
  modifyFunc: (address: Omit<Address, 'username' | 'id'>) => void,
  isDismissable?: boolean
}) {

  const [step, setStep] = useState(0);
  const [foundedTenants, setFoundedTenants] = useState<undefined | addressTypes.FindAddressResponse>(undefined);
  const [addressDto, setAddressDto] = useState<undefined | addressTypes.FindAddressDto>(undefined);
  const nextStep = () => setStep(prevState => prevState + 1);
  const stepBack = () => setStep(prevState => prevState - 1);
  const handleFoundedAddress = (addressDto: addressTypes.FindAddressDto, tenants: addressTypes.FindAddressResponse) => {
    setFoundedTenants(tenants);
    setAddressDto(addressDto);
    nextStep();
  };
  const handleSelectTenant = (tenantId:string) => {
    if (!addressDto || addressDto.street === undefined || addressDto.house === undefined || addressDto.type === undefined) {
      toast.warning('Похоже не все поля были заполнены. Повторите с начала');
      return;
    }
    const configuredAddress = {
      ...addressDto,
      system_id:tenantId,
    };
    modifyFunc(configuredAddress);
  };
  return (
    <Modal isOpen={isOpen} backdrop="opaque" onOpenChange={onOpenChange} isDismissable={isDismissable}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {step === 1 ? 'Выберите себя' : 'Добавление адреса'}
            </ModalHeader>
            {step === 0 && (<FindAddressForm onClose={onClose} modifyFunc={handleFoundedAddress} />)}
            {step === 1 && (
              <SelectTenant stepBack={stepBack} onTenantSelection={handleSelectTenant} tenants={foundedTenants} />)}
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

function FindAddressForm({ onClose, modifyFunc }: {
  onClose: () => void,
  modifyFunc: (addressDto: addressTypes.FindAddressDto, tenants: addressTypes.FindAddressResponse) => void
}) {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<addressTypes.FindAddressForm>({
    resolver: zodResolver(addressContracts.FindAddressFormSchema),
    defaultValues: { isPrivateHouse: false },
  });
  const { data: streets, error: fetchStreetsError, isSuccess, isPending } = addressQueries.useCityStreets();
  const { mutateAsync: findAddress, error } = addressQueries.useFindAddress();
  useEffect(() => {
    if (fetchStreetsError || !fetchStreetsError && isSuccess && !streets?.length) {
      toast.error('Не удалось получить список улиц');
    }
  }, [fetchStreetsError, streets]);
  useEffect(() => {
    if (error) {
      toast.error(error.response.message || 'Неопределенная ошибка. Попробуйте позже и сообщите нам');
    }
  }, [error]);

  async function onSubmit(data: addressTypes.FindAddressForm) {
    const configuredData: FindAddressDto = {
      street: data.street,
      house: data.house,
      type: data.type,
      apartment: data.isPrivateHouse ? null : data.apartment,
    };
    const foundedTenants = await findAddress({ address: configuredData });
    if (!foundedTenants.length) return toast.error('Не удалось найти аккаунты для данного адреса');
    modifyFunc(configuredData, foundedTenants);
    return true;
  }

  const isPrivateHouse = useWatch({
    control,
    name: 'isPrivateHouse',
  });
  useEffect(() => {
    if (isPrivateHouse) {
      setValue('apartment', '');
    }
  }, [isPrivateHouse, setValue]);
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ModalBody>
        <Tabs
          {...register('type')}
          aria-label="Выбор типа здания"
          color="primary"
          disabledKeys={['BUSINESS']}
          onSelectionChange={value => setValue('type', value as 'CITIZEN' | 'BUSINESS')}
        >
          <Tab key="CITIZEN" title="Жилой дом / квартира" />
          <Tab key="BUSINESS" title="Коммерческое здание" />
        </Tabs>
        <Autocomplete
          {...register('street')}
          errorMessage={errors.street && String(errors.street?.message)}
          label="Улица"
          placeholder="Начните вводить"
          isLoading={isPending}
          isRequired
        >
          {streets?.map((street) => (
            <AutocompleteItem key={street.grad_id} value={street.grad_id}>
              {street.name}
            </AutocompleteItem>
          )) || []}
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
          name="isPrivateHouse"
          render={({ field: { onChange, value } }) => (
            <Checkbox defaultSelected onChange={onChange} isSelected={value}>
              Частный дом/нет квартиры
            </Checkbox>
          )}
        />
      </ModalBody>
      <ModalFooter>
        <div className="flex gap-2">
          <Button color="danger" variant="light" onPress={onClose}>
            Закрыть
          </Button>
          <Button
            isLoading={isSubmitting}
            disabled={isPending}
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

function SelectTenant({ tenants, onTenantSelection, stepBack }: {
  tenants: addressTypes.FindAddressResponse | undefined,
  onTenantSelection: (tenantId:string) => void,
  stepBack: () => void
}) {
  const [selectedTenant, setSelectedTenant] = useState<string | undefined>(undefined);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const handleNextTab = () => {
    if (selectedTenant) {
      onTenantSelection(selectedTenant);
    }
  };
  return (
    <>
      <ModalBody>
        <RadioGroup
          value={selectedTenant}
          onValueChange={(tenant)=> setSelectedTenant(tenant)}
        >
          {tenants?.map((tenant)=>
            <Radio
            key={tenant.account}
            value={tenant.account}
            description={tenant.address}
            classNames={{
              base: cn(
                'inline-flex m-0 border-content2   bg-content1 hover:bg-content2 items-center justify-between',
                'flex-row-reverse max-w-[100%] cursor-pointer rounded-lg gap-4 p-4 border-2 border-content2',
                'data-[selected=true]:border-primary',
              ),
            }}
          >
            {tenant.tenant}
          </Radio>,
          )}
        </RadioGroup>
        {tenants?.length && (
          <Checkbox size='sm' isSelected={isConfirmed} onValueChange={setIsConfirmed}>
            Я подтверждаю, что являюсь выбранным человеком
          </Checkbox>
        )}
      </ModalBody>
      <ModalFooter>
        <div className="flex gap-2">
          <Button variant='bordered' color='primary' onPress={stepBack}>
            Назад
          </Button>
          {/* TODO: ВЕЗДЕ ГДЕ ДИЗАБЛЕД НУЖНО ЗАЮЗАТЬ ISDISABLED */}
          <Button
            color="primary"
            type="submit"
            isDisabled={!selectedTenant || !isConfirmed}
            onPress={handleNextTab}
          >
            Сохранить
          </Button>
        </div>
      </ModalFooter>
    </>
  );
}