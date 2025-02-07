import axios from 'axios';
import qs from 'qs';

const baseUrl = 'http://localhost:8081'
export const http = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  paramsSerializer: (params) => {
    if (params?.search) params.search = encodeURIComponent(params.search);
    return qs.stringify(params, {
      arrayFormat: 'brackets',
      encode: false,
    });
  },
});

