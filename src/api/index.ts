import axios from 'axios';

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api`;

export const api = axios.create({
    baseURL: API_URL,
});

export const createPoll = async (data: { question: string; options: string[] }) => {
    const response = await api.post('/polls', data);
    return response.data;
};

export const getPoll = async (id: string) => {
    const response = await api.get(`/polls/${id}`);
    return response.data;
};
