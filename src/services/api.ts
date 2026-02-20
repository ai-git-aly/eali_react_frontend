import axios, { InternalAxiosRequestConfig } from 'axios';

export interface NewsEvent {
    id: number;
    title_en: string;
    title_fr: string;
    description_en: string;
    description_fr: string;
    date: string;
    category: string;
    imageUrl?: string;
}

export interface Tender {
    id: number;
    title_en: string;
    title_fr: string;
    description_en: string;
    description_fr: string;
    deadline: string;
    date_posted: string;
    fileUrl: string;
}

export interface Partner {
    id: number;
    name_en: string;
    name_fr: string;
    country_en: string;
    country_fr: string;
    type: string;
    logo?: string;
}

export interface Faculty {
    id: number;
    name_en: string;
    name_fr: string;
    icon: string;
    options_en: string[];
    options_fr: string[];
}

export interface ProfessionalCourse {
    id: number;
    name_en: string;
    name_fr: string;
    icon: string;
}

export interface Message {
    id: number;
    name: string;
    email: string;
    subject: string;
    content: string;
    created_at: string;
    replied: boolean;
    reply_content?: string;
}

export interface FAQ {
    id: number;
    question_en: string;
    question_fr: string;
    answer_en: string;
    answer_fr: string;
    order: number;
}

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
