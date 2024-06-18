// src/services/axiosInstance.js
import { InvalidArgumentError,NotFoundError } from '@/exceptions';
import axios from 'axios';

const AxiosRequest = () => {
  return axios.create({
    baseURL: 'https://api-developers.spinalcom.com/api/v1',
  });
};

const AxiosInstance = () => {
  const instance = AxiosRequest();
  instance.interceptors.response.use(
    response => response,
    error => {
      if (error?.response?.status === 404) {
        throw new NotFoundError()
      }
      if (error?.response?.status === 400) {
        throw new InvalidArgumentError();
      }
      return Promise.reject(error);
    },
  );
  return instance;
};

export default AxiosInstance;
