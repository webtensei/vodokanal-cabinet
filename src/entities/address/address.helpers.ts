import { Address } from '@entities/address/address.types';

export function createFullAddress(address:Address) {
  const stringArray = [];
  if (address.street) {
    stringArray.push(`Улица ${address.street}`);
  }
  if (address.house) stringArray.push(`дом ${address.house}`);
  if ( address.apartment) stringArray.push(`квартира ${address.apartment}`);
  return stringArray.join(', ');
}