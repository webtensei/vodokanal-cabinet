import { Address } from '@entities/address/address.types';

export function createFullAddress(address:Address) {
  console.log(address);
  const stringArray = [];
  if (address.street) {
    stringArray.push(`Улица ${address.street}`);
  }
  if (address.house) stringArray.push(`дом ${address.house}`);
  if ( address.apartment) stringArray.push(`квартира ${address.apartment}`);
  console.log(stringArray.join(', '));
  return stringArray.join(', ');
}