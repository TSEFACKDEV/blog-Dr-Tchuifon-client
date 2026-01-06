import { createAsyncThunk } from '@reduxjs/toolkit';
import api, { apiFormData } from '../../config/api.config';
import type { CollaboratorFormData } from '../../types';
import { toast } from 'react-toastify';

// Get all collaborators (public)
export const getAllCollaborators = createAsyncThunk(
  'collaborators/getAll',
  async (filters: { search?: string; country?: string; page?: number; limit?: number } = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.country) params.append('country', filters.country);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());

      const response = await api.get(`/collaborators?${params.toString()}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur de récupération');
    }
  }
);

// Get collaborator by ID
export const getCollaboratorById = createAsyncThunk(
  'collaborators/getById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/collaborators/${id}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Collaborateur introuvable');
    }
  }
);

// Get my collaborators (admin)
export const getMyCollaborators = createAsyncThunk(
  'collaborators/getMy',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/collaborators/user/me');
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur de récupération');
    }
  }
);

// Create collaborator (admin)
export const createCollaborator = createAsyncThunk(
  'collaborators/create',
  async (data: CollaboratorFormData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      
      Object.keys(data).forEach((key) => {
        const value = data[key as keyof CollaboratorFormData];
        if (value !== undefined && value !== null && key !== 'photo') {
          formData.append(key, value.toString());
        }
      });
      
      if (data.photo) {
        formData.append('photo', data.photo);
      }

      const response = await apiFormData.post('/collaborators', formData);
      toast.success('Collaborateur créé avec succès');
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur de création');
    }
  }
);

// Update collaborator (admin)
export const updateCollaborator = createAsyncThunk(
  'collaborators/update',
  async ({ id, data }: { id: string; data: Partial<CollaboratorFormData> }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      
      Object.keys(data).forEach((key) => {
        const value = data[key as keyof CollaboratorFormData];
        if (value !== undefined && value !== null && key !== 'photo') {
          formData.append(key, value.toString());
        }
      });
      
      if (data.photo) {
        formData.append('photo', data.photo);
      }

      const response = await apiFormData.put(`/collaborators/${id}`, formData);
      toast.success('Collaborateur mis à jour');
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur de mise à jour');
    }
  }
);

// Delete collaborator (admin)
export const deleteCollaborator = createAsyncThunk(
  'collaborators/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/collaborators/${id}`);
      toast.success('Collaborateur supprimé');
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur de suppression');
    }
  }
);

// Link collaborator to publication
export const linkCollaboratorToPublication = createAsyncThunk(
  'collaborators/linkToPublication',
  async ({ collaboratorId, publicationId }: { collaboratorId: string; publicationId: string }, { rejectWithValue }) => {
    try {
      const response = await api.post('/collaborators/link', {
        collaboratorId,
        publicationId,
      });
      toast.success('Collaborateur lié à la publication');
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur de liaison');
    }
  }
);

// Unlink collaborator from publication
export const unlinkCollaboratorFromPublication = createAsyncThunk(
  'collaborators/unlinkFromPublication',
  async ({ collaboratorId, publicationId }: { collaboratorId: string; publicationId: string }, { rejectWithValue }) => {
    try {
      await api.delete('/collaborators/unlink', {
        data: { collaboratorId, publicationId },
      });
      toast.success('Collaborateur délié de la publication');
      return { collaboratorId, publicationId };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur de déliaison');
    }
  }
);
