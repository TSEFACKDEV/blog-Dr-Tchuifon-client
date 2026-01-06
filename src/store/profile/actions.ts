import { createAsyncThunk } from '@reduxjs/toolkit';
import api, { apiFormData } from '../../config/api.config';
import type { ProfileFormData } from '../../types';
import { toast } from 'react-toastify';

// Get public profile
export const getPublicProfile = createAsyncThunk(
  'profile/getPublic',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/profile/public');
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur de récupération');
    }
  }
);

// Get my profile (admin)
export const getMyProfile = createAsyncThunk(
  'profile/getMy',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/profile/me');
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur de récupération');
    }
  }
);

// Create profile (admin)
export const createProfile = createAsyncThunk(
  'profile/create',
  async (data: ProfileFormData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      
      Object.keys(data).forEach((key) => {
        const value = data[key as keyof ProfileFormData];
        if (value !== undefined && value !== null && key !== 'photo' && key !== 'cv') {
          if (Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value.toString());
          }
        }
      });
      
      if (data.photo) formData.append('photo', data.photo);
      if (data.cv) formData.append('cv', data.cv);

      const response = await apiFormData.post('/profile', formData);
      toast.success('Profil créé avec succès');
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur de création');
    }
  }
);

// Update profile (admin)
export const updateProfile = createAsyncThunk(
  'profile/update',
  async (data: Partial<ProfileFormData>, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      
      Object.keys(data).forEach((key) => {
        const value = data[key as keyof ProfileFormData];
        if (value !== undefined && value !== null && key !== 'photo' && key !== 'cv') {
          if (Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value.toString());
          }
        }
      });
      
      if (data.photo) formData.append('photo', data.photo);
      if (data.cv) formData.append('cv', data.cv);

      const response = await apiFormData.put('/profile', formData);
      toast.success('Profil mis à jour');
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur de mise à jour');
    }
  }
);

// Delete profile (admin)
export const deleteProfile = createAsyncThunk(
  'profile/delete',
  async (_, { rejectWithValue }) => {
    try {
      await api.delete('/profile');
      toast.success('Profil supprimé');
      return null;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur de suppression');
    }
  }
);
