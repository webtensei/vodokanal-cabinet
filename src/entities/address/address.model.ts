import { useEffect, useState } from 'react';
import { create } from 'zustand';
import { Address } from '@entities/address/address.types';
import { userService } from '@entities/user/user.queries';


interface SelectedAddressState {
  selectedAddress: Address | null;
  isReady: boolean;
  setSelectedAddress: (address: Address) => void;
  setIsReady: (ready: boolean) => void;
  fetchAddress: () => Promise<void>;
}

export const useSelectedAddress = create<SelectedAddressState>((set) => ({
  selectedAddress: null,
  isReady: false,
  setSelectedAddress: (address: Address) => set({ selectedAddress: address }),
  setIsReady: (ready: boolean) => set({ isReady: ready }),
  fetchAddress: async () => {
    const user = userService.getCache();
    set({ isReady: false });
    if (user) {
      const preferredAddressId = user.preferred_settings?.preferred_address || 0;
      const address = user.addresses?.find((a) => a.id === preferredAddressId) || user.addresses?.[0] || null;
      set({ selectedAddress: address, isReady: true });
    }
  },
}));

export const useAddresses = () => {
  const user = userService.getCache();
  const [addresses, setAddresses] = useState<Address[] | []>([]);
  useEffect(() => {
    if (user) {
     setAddresses(user?.addresses || []);
    }
  }, [user]);
  const addAddress = (address:Address) => {
    setAddresses(prevState => [...prevState, address]);
  };
  return { addresses, addAddress };
};