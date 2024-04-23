import axios from 'axios';

import { interceptorRequest } from './interceptors/request';
import { interceptorResponse, interceptorResponseError } from './interceptors/response';

/**
 * Axios defaults
 */

// Headers
//axios.defaults.headers.common['Content-Type'] = 'application/json';
//axios.defaults.headers.common.Accept = 'application/json';
/**
 * Request Interceptor
 */
axios.interceptors.request.use(
  async inputConfig => await interceptorRequest(inputConfig),
  error => {
    throw error;
  },
);

/**
 * Response Interceptor
 */
axios.interceptors.response.use(
  response => interceptorResponse(response),
  async error => await interceptorResponseError(error),
);
export { axios };
