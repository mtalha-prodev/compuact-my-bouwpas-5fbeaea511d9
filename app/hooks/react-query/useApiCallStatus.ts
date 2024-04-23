export const useApiCallStatus = (
  status: 'error' | 'success' | 'idle' | 'loading',
  isRefetching = false,
) => {
  const loading = status === 'loading';
  const error = status === 'error';
  const success = status === 'success';

  const showLoading = (loading || isRefetching) && !error;
  const showData = success && !loading && !error && !isRefetching;
  const showError = !loading && error && !isRefetching;

  return {
    showLoading,
    showData,
    showError,
  };
};
