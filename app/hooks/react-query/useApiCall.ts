import { api, TApiError } from 'app/lib/api';
import { useQuery, UseQueryOptions } from 'react-query';

type UseApiCallProps<T> = {
  link: string;
  uniqueDecriber?: number;
  queryParams?: UseQueryOptions<T, TApiError>;
};

export function useApiCall<T = unknown>(props: UseApiCallProps<T>) {
  const { link, uniqueDecriber = '', queryParams } = props;
  const queryKey = uniqueDecriber ? [link, uniqueDecriber] : link;
  return useQuery<T, TApiError>(
    queryKey,
    async () => {
      const response = await api.get<T>(link);
      return response as unknown as T;
    },
    {
      ...queryParams,
    },
  );
}
