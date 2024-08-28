import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Code, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react';
import { FieldValues, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Address } from '@entities/address/address.types';
import { meterQueries } from '@entities/meter';
import { MeterByCitizenAddress } from '@entities/meter/meter.types';
import { SendIndicationsDto, SendIndicationsDtoSchema } from '@features/send-indications';

export function SendIndicationsModal({ meter, address, isOpen, closeModal }: {
  meter: MeterByCitizenAddress,
  address: Address,
  isOpen: boolean,
  closeModal: () => void
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SendIndicationsDto>({
    resolver: zodResolver(SendIndicationsDtoSchema),
    defaultValues: { meter: String(meter.id), addressId: address.id },
  });
  const { mutate: sendIndications, isPending, error, isError, data } = meterQueries.useSendIndicationsMutation();
  const onSubmit = (data: FieldValues) => {
    const formedData = { addressId: address.id, metersList: [Number(data.meter)], chargesList: [Number(data.charge)] };
    sendIndications(formedData);
  };
  useEffect(() => {
    if (isError) toast.error(error.response.message || 'Неизвестная ошибка');
    if (data && !isError) {
      toast.success('Вы успешно передали показания 🎉');
      closeModal();
    }
  }, [isError, data]);
  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
      <ModalContent>
        {(onClose) => (
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader>Передать показания</ModalHeader>

            <ModalBody>
              {!meter.allowed && (
                <Code color="danger">В данный момент показания не принимаются</Code>
              )}
              <Input
                isReadOnly
                type="lastIndications"
                label="Последние показания"
                variant="bordered"
                defaultValue={meter?.ind}
              />
              <Input
                {...register('charge')}
                errorMessage={errors?.charge?.message}
                disabled={isPending || !meter.allowed}
                type="newIndications"
                label="Новые показания"
                placeholder="Начните вводить"
                variant="bordered"
                color="primary"
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Закрыть
              </Button>
              <Button
                color="primary"
                type="submit"
                isLoading={isPending}
                disabled={!meter.allowed}
              >
                Отправить
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
}
