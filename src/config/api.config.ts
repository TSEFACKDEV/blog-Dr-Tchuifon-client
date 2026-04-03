import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { toast } from 'react-toastify';

// Export de l'URL de base
export const API_BASE_URL = import.meta.env.VITE_API_URL 

// Configuration de base de l'API
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Intercepteur pour les requêtes - Ajouter le token d'authentification
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour les réponses - Gérer les erreurs et le refresh token
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError<any>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Si erreur 401 et pas encore de retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(
            `${api.defaults.baseURL}/auth/refresh-token`,
            { refreshToken }
          );

          const { accessToken } = response.data.data;
          localStorage.setItem('accessToken', accessToken);

          // Réessayer la requête originale avec le nouveau token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          }
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Si le refresh échoue, déconnecter l'utilisateur
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        toast.error('Session expirée, veuillez vous reconnecter');
        return Promise.reject(refreshError);
      }
    }

    // Gérer les autres erreurs
    const errorMessage = error.response?.data?.message || error.message || 'Une erreur est survenue';
    
    // Ne pas afficher de toast pour certaines erreurs spécifiques
    // ou pour les erreurs réseau au chargement initial
    if (error.response?.status !== 404 && error.code !== 'ERR_NETWORK') {
      toast.error(errorMessage);
    }

    return Promise.reject(error);
  }
);

// API pour les uploads de fichiers
export const apiFormData = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
  timeout: 60000, // Plus de temps pour les uploads
});

// Intercepteur pour apiFormData
apiFormData.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

apiFormData.interceptors.response.use(
  (response) => response,
  (error: AxiosError<any>) => {
    const errorMessage = error.response?.data?.message || 'Erreur lors de l\'upload';
    toast.error(errorMessage);
    return Promise.reject(error);
  }
);

export default api;
