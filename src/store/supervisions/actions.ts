import { createAsyncThunk } from '@reduxjs/toolkit';
import api, { apiFormData } from '../../config/api.config';
import type { SupervisionFormData } from '../../types';
import { SupervisionLevel, SupervisionStatus } from '../../types';
import { toast } from 'react-toastify';

// Get all supervisions (public)
export const getAllSupervisions = createAsyncThunk(
  'supervisions/getAll',
  async (filters: { level?: SupervisionLevel; status?: SupervisionStatus; page?: number; limit?: number } = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (filters.level) params.append('level', filters.level);
      if (filters.status) params.append('status', filters.status);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());

      const response = await api.get(`/supervisions?${params.toString()}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur de récupération');
    }
  }
);

// Get supervision by ID
export const getSupervisionById = createAsyncThunk(
  'supervisions/getById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/supervisions/${id}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Encadrement introuvable');
    }
  }
);

// Get my supervisions (admin)
export const getMySupervisions = createAsyncThunk(
  'supervisions/getMy',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/supervisions/user/me');
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur de récupération');
    }
  }
);

// Create supervision (admin)
export const createSupervision = createAsyncThunk(
  'supervisions/create',
  async (data: SupervisionFormData, { rejectWithValue }) => {
    try {
      // Si pas de fichier, envoyer JSON simple
      if (!data.thesis) {
        const payload = {
          studentName: data.studentName,
          level: data.level,
          topic: data.topic,
          description: data.description,
          startDate: data.startDate,
          endDate: data.endDate,
          status: data.status,
          thesisUrl: data.thesisUrl,
          publications: data.publications,
        };
        const response = await api.post('/supervisions', payload);
        toast.success('Encadrement créé avec succès');
        return response.data.data;
      }

      // Si fichier, utiliser FormData
      const formData = new FormData();
      
      // Ajouter les champs texte
      Object.keys(data).forEach((key) => {
        const value = data[key as keyof SupervisionFormData];
        if (value !== undefined && value !== null && key !== 'thesis') {
          if (typeof value === 'object' && !(value instanceof File)) {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value.toString());
          }
        }
      });
      
      // Ajouter le fichier thesis si présent
      if (data.thesis) {
        formData.append('thesis', data.thesis);
      }

      const response = await apiFormData.post('/supervisions', formData);
      toast.success('Encadrement créé avec succès');
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur de création');
    }
  }
);

// Update supervision (admin)
export const updateSupervision = createAsyncThunk(
  'supervisions/update',
  async ({ id, data }: { id: string; data: Partial<SupervisionFormData> }, { rejectWithValue }) => {
    try {
      // Si pas de fichier, envoyer JSON simple
      if (!data.thesis) {
        const payload: any = {
          studentName: data.studentName,
          level: data.level,
          topic: data.topic,
          description: data.description,
          startDate: data.startDate,
          endDate: data.endDate,
          status: data.status,
          thesisUrl: data.thesisUrl,
          publications: data.publications,
        };
        const response = await api.put(`/supervisions/${id}`, payload);
        toast.success('Encadrement mis à jour');
        return response.data.data;
      }

      // Si fichier, utiliser FormData
      const formData = new FormData();
      
      // Ajouter les champs texte
      Object.keys(data).forEach((key) => {
        const value = data[key as keyof SupervisionFormData];
        if (value !== undefined && value !== null && key !== 'thesis') {
          if (typeof value === 'object' && !(value instanceof File)) {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value.toString());
          }
        }
      });
      
      // Ajouter le fichier thesis si présent
      if (data.thesis) {
        formData.append('thesis', data.thesis);
      }

      const response = await apiFormData.put(`/supervisions/${id}`, formData);
      toast.success('Encadrement mis à jour');
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur de mise à jour');
    }
  }
);

// Delete supervision (admin)
export const deleteSupervision = createAsyncThunk(
  'supervisions/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/supervisions/${id}`);
      toast.success('Encadrement supprimé');
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur de suppression');
    }
  }
);
