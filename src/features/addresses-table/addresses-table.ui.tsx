import { Card, CardHeader, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react';
import { addressModel } from '@entities/address';

export function AddressesTable() {
  const { addresses } = addressModel.useAddresses();
  return (
    <Card
      data-element='addresses'
      className='col-span-12 h-max md:col-span-8'
    >
      <CardHeader className='font-bold'>Адресы</CardHeader>
      <div className='gap-4 px-4 pb-4'>
        <Table removeWrapper aria-label='Example static collection table'>
          <TableHeader>
            <TableColumn>Адрес</TableColumn>
            <TableColumn>Тип строения</TableColumn>
            <TableColumn>УИД</TableColumn>
          </TableHeader>
          <TableBody emptyContent="Не нашли ни одного адреса.">
            {addresses.map((address) => (
                <TableRow key={address.id}>
                  <TableCell>
                    {address.street}, {address.house}
                    {address.apartment && `, ${address.apartment}`}
                  </TableCell>
                  <TableCell>
                    {address.type === 'CITIZEN'
                      ? 'Дом/квартира'
                      : 'Коммерческое сооружение'}
                  </TableCell>
                  <TableCell>{address.system_id}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}

