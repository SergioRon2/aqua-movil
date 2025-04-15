import { API_PREFIX, API_URL } from '@env';
import axios from 'axios';
import useAuthStore from 'store/auth/auth.store';

const aquaApi = axios.create({
    baseURL: `${API_URL}/${API_PREFIX}`,
    headers: {
        Accept: '*/*',
        'Content-Type': 'application/json',
    },
});

aquaApi.interceptors.request.use(config => {
    const token = useAuthStore.getState().token;
    console.log({token})
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

export { aquaApi };