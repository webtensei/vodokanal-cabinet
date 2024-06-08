import { useMutation } from '@tanstack/react-query';
import { fetchKnownStreets } from '@entities/address/address.api';
import { KnownStreet } from '@entities/address/address.types';
import { GenericError } from '@shared/lib/fetch';
import { queryClient } from '@shared/lib/react-query';

const keys = {
  root: () => ['address'],
  knownStreets: () => [...keys.root(), 'knownStreets'] as const,
};
export const streetsService = {
  queryKey: () => keys.knownStreets(),

  getCache: () => queryClient.getQueryData<KnownStreet[]>(streetsService.queryKey()),

  setCache: (streets: KnownStreet[] | null) => queryClient.setQueryData(streetsService.queryKey(), streets),

  removeCache: () => queryClient.removeQueries({ queryKey: streetsService.queryKey() }),
};
export function useFetchKnownStreets() {

  return useMutation({
    mutationKey: keys.knownStreets(),
    mutationFn: fetchKnownStreets,
    onSuccess: async (streets) => {
      streetsService.setCache(streets);
    },
    onError: (error: GenericError<any>) => error,
  });
}