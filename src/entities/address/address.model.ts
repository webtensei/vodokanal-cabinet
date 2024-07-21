import { useEffect, useState } from 'react';
import { Address } from '@entities/address/address.types';
import { userService } from '@entities/user/user.queries';

// TODO: уйти от T в названии- к обычному неймингу
export const useSelectedAddress = () => {
  const user = userService.getCache();
  const [selectedAddress, setSelectedAddress] = useState<undefined | null | Address>(null);
  const [isReady, setIsReady] = useState<boolean>(false);
  useEffect(() => {
    setIsReady(false);
    if (user) {
      const preferredAddressId = user?.preferred_settings?.preferred_address || 0;
      setSelectedAddress(user?.addresses?.find((address) => address.id === preferredAddressId) || user?.addresses?.[0] || null);
      setIsReady(true);
    }
  }, [user]);
  return { selectedAddress, setSelectedAddress, isReady };
};

export const useAddresses = () => {
  const user = userService.getCache();
  const [addresses, setAddresses] = useState<Address[] | []>([]);
  useEffect(() => {
    if (user) {
     setAddresses(user?.addresses || []);
    }
  }, [user]);
  return { addresses };
};